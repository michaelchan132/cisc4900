from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .serializers import UserSerializer, RestaurantSerializer, InspectionSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Restaurants, Inspection, Review
from django.db.models import Avg

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class RestaurantPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

class RestaurantList(generics.ListAPIView):
    queryset = Restaurants.objects.annotate(average_rating=Avg("reviews__rating")).order_by("id")
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]
    pagination_class = RestaurantPagination
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get("search", "").strip()
        boro = self.request.query_params.get("boro", "").strip()
        inspection = self.request.query_params.get("inspection", "").strip()
        if search:
            queryset = queryset.filter(dba__icontains=search)
        if boro:
            queryset = queryset.filter(boro__iexact=boro)
        if inspection:
            queryset = queryset.filter(inspections__grade__icontains=inspection)
        sort = self.request.query_params.get("sort", "").strip()
        sort_options = {
            "name_asc": "dba",
            "name_desc": "-dba",
            "boro_asc": "boro",
            "boro_desc": "-boro",
            "id_asc": "id",
            "id_desc": "-id",
            "rating_asc": "average_rating",
            "rating_desc": "-average_rating",
        }
        order_by_field = sort_options.get(sort)
        if order_by_field:
            queryset = queryset.order_by(order_by_field, "id")
        
        return queryset.distinct()

class RestaurantDetail(generics.RetrieveAPIView):
    queryset = Restaurants.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

class CreateReview(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class DeleteReview(generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Review.objects.filter(author=user)

class MyReviewList(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.object.filter(author=self.request.user).order_by("-created_at")
