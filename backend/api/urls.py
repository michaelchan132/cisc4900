from django.urls import path
from . import views

urlpatterns = [
    path("restaurants/", views.RestaurantList.as_view(), name="restaurant_list"),
    path("restaurants/<int:pk>/", views.RestaurantDetail.as_view(), name="restaurant_detail"),
    path("reviews/", views.CreateReview.as_view(), name="create_review"),
    path("reviews/delete/<int:pk>/", views.DeleteReview.as_view(), name="delete_review"),
]