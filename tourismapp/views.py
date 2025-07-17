from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Category, Destination, WeatherInfo, Favorite, SearchHistory
from .serializers import CategorySerializer, DestinationSerializer, WeatherInfoSerializer, FavoriteSerializer, SearchHistorySerializer, RegisterSerializer, LoginSerializer
from .utils import fetch_weather_data
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]  # Solo admins pueden modificar categorías

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticated]  # Usuarios autenticados pueden ver destinos

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        fetch_weather_data(instance)  # Actualiza datos climáticos al recuperar un destino
        return super().retrieve(request, *args, **kwargs)

class WeatherInfoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WeatherInfo.objects.all()
    serializer_class = WeatherInfoSerializer
    permission_classes = [IsAuthenticated]

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SearchHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = SearchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@method_decorator(csrf_exempt, name='dispatch')
class AuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if request.path.endswith('register/'):
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                return Response({"message": "Usuario registrado"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.path.endswith('login/'):
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data
                login(request, user)
                token, _ = Token.objects.get_or_create(user=user)
                return Response({"token": token.key, "user": user.username}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)