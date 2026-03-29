import json
from datetime import date
from urllib.error import URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from api.models import Inspection, Restaurants

DATASET_URL = "https://data.cityofnewyork.us/resource/43nn-pn8j.json"
DEFAULT_SELECT = (
    "camis,dba,boro,street,zipcode,phone,cuisine_description,"
    "inspection_date,score,grade"
)


class Command(BaseCommand):
    help = "Import restaurants from NYC Open Data dataset."

    def add_arguments(self, parser):
        parser.add_argument(
            "--batch-size",
            type=int,
            default=5000,
            help="Rows per request (default: 5000).",
        )
        parser.add_argument(
            "--max-records",
            type=int,
            default=None,
            help="Optional cap on total rows to ingest.",
        )
        parser.add_argument(
            "--since",
            type=str,
            default=None,
            help="Only fetch rows with inspection_date >= YYYY-MM-DD.",
        )
        parser.add_argument(
            "--app-token",
            type=str,
            default=None,
            help="Optional Socrata app token (sent as X-App-Token header).",
        )

    def handle(self, *args, **options):
        batch_size = options["batch_size"]
        max_records = options["max_records"]
        since = options["since"]
        app_token = options["app_token"]

        if batch_size <= 0:
            raise CommandError("--batch-size must be > 0")

        where_parts = ["camis IS NOT NULL"]
        if since:
            try:
                date.fromisoformat(since)
            except ValueError as exc:
                raise CommandError("--since must be in YYYY-MM-DD format") from exc
            where_parts.append(f"inspection_date >= '{since}T00:00:00'")

        offset = 0
        fetched_total = 0
        restaurants_created = 0
        restaurants_updated = 0
        inspections_created = 0

        self.stdout.write(self.style.NOTICE("Starting restaurants import..."))

        while True:
            remaining = None if max_records is None else max_records - fetched_total
            if remaining is not None and remaining <= 0:
                break

            limit = batch_size if remaining is None else min(batch_size, remaining)
            params = {
                "$select": DEFAULT_SELECT,
                "$where": " AND ".join(where_parts),
                "$order": "inspection_date DESC",
                "$limit": limit,
                "$offset": offset,
            }
            rows = self._fetch_rows(params=params, app_token=app_token)
            if not rows:
                break

            created_r, updated_r, created_i = self._ingest_rows(rows)
            restaurants_created += created_r
            restaurants_updated += updated_r
            inspections_created += created_i

            fetched = len(rows)
            fetched_total += fetched
            offset += fetched

            self.stdout.write(
                f"Fetched {fetched_total} rows total "
                f"(restaurants +{created_r}/{updated_r}, inspections +{created_i})"
            )

            if fetched < limit:
                break

        self.stdout.write(self.style.SUCCESS("Import complete."))
        self.stdout.write(
            f"Summary: fetched_rows={fetched_total}, "
            f"restaurants_created={restaurants_created}, "
            f"restaurants_updated={restaurants_updated}, "
            f"inspections_created={inspections_created}"
        )

    def _fetch_rows(self, *, params, app_token):
        query = urlencode(params)
        request = Request(f"{DATASET_URL}?{query}")
        if app_token:
            request.add_header("X-App-Token", app_token)

        try:
            with urlopen(request, timeout=60) as response:  # nosec B310
                payload = response.read().decode("utf-8")
            return json.loads(payload)
        except URLError as exc:
            raise CommandError(f"Failed to fetch NYC Open Data: {exc}") from exc
        except json.JSONDecodeError as exc:
            raise CommandError("NYC Open Data returned invalid JSON") from exc

    @transaction.atomic
    def _ingest_rows(self, rows):
        created_restaurants = 0
        updated_restaurants = 0
        created_inspections = 0

        for row in rows:
            camis = (row.get("camis") or "").strip()
            if not camis:
                continue

            restaurant_defaults = {
                "dba": (row.get("dba") or "").strip(),
                "boro": (row.get("boro") or "").strip(),
                "street": (row.get("street") or "").strip(),
                "zipcode": (row.get("zipcode") or "").strip(),
                "phone": (row.get("phone") or "").strip(),
                "cuisine_description": (row.get("cuisine_description") or "").strip(),
            }

            restaurant, created = Restaurants.objects.get_or_create(
                camis=camis,
                defaults=restaurant_defaults,
            )
            if created:
                created_restaurants += 1
            else:
                changed = False
                for field, value in restaurant_defaults.items():
                    if getattr(restaurant, field) != value:
                        setattr(restaurant, field, value)
                        changed = True
                if changed:
                    restaurant.save(update_fields=list(restaurant_defaults.keys()))
                    updated_restaurants += 1

            inspection_date_value = (row.get("inspection_date") or "")[:10]
            grade = (row.get("grade") or "").strip()
            score_value = row.get("score")

            if not inspection_date_value or score_value in (None, ""):
                continue

            try:
                inspection_date = date.fromisoformat(inspection_date_value)
                score = int(score_value)
            except (ValueError, TypeError):
                continue

            _, inspection_created = Inspection.objects.get_or_create(
                restaurant=restaurant,
                inspection_date=inspection_date,
                score=score,
                grade=grade,
            )
            if inspection_created:
                created_inspections += 1

        return created_restaurants, updated_restaurants, created_inspections