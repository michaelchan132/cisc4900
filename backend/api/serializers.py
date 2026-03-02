from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Restaurants, Inspection, Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class InspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inspection
        fields = ["restaurant", "inspection_date", "score", "grade"]
        extra_kwargs = {}

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["author", "restaurant", "rating", "comment", "created_at"]
        extra_kwargs = {"author": {"read_only": True}}

class RestaurantSerializer(serializers.ModelSerializer):
    inspections = InspectionSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Restaurants
        fields = ["dba", "boro", "street", "zipcode", "phone", "cuisine_description"]
        extra_kwargs = {}