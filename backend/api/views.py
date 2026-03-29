from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .serializers import UserSerializer, RestaurantSerializer, InspectionSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Restaurants, Inspection, Review

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
    queryset = Restaurants.objects.all().order_by("id")
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]
    pagination_class = RestaurantPagination

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