from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Restaurants(models.Model):
    camis = models.TextField()
    dba = models.TextField()
    boro = models.TextField()
    street = models.TextField()
    zipcode = models.TextField()
    phone = models.TextField()
    cuisine_description = models.TextField()

    def __str__(self):
        return f"{self.dba}"

class Inspection(models.Model):
    restaurant = models.ForeignKey(Restaurants, on_delete=models.CASCADE, related_name="inspections")
    inspection_date = models.DateField()
    score = models.IntegerField()
    grade = models.TextField()

    def __str__(self):
        return f"{self.grade} {self.restaurant.dba} {self.inspection_date}"

class Review(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurants, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username}'s review of {self.restaurant.dba}"




