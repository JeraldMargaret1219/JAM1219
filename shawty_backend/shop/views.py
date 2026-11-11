from django.db import transaction as db_tx
from django.db.models import F
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import BaseUser, Product, Cart, CartProduct, Transaction, ProductTransaction
from .serializers import (RegisterSerializer, ProductSerializer, CartSerializer,
                          CartProductSerializer, TransactionSerializer)


class RegisterView(generics.CreateAPIView):
    queryset = BaseUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True)
        q = self.request.query_params.get("search")
        return qs.filter(name__icontains=q) if q else qs


def get_active_cart(user):
    cart, _ = Cart.objects.get_or_create(owner=user)
    return cart


class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        return Response(CartSerializer(get_active_cart(request.user)).data)

    @action(detail=False, methods=["post"])
    def add(self, request):
        cart = get_active_cart(request.user)
        product = Product.objects.get(pk=request.data["product"], is_active=True)
        qty = int(request.data.get("quantity", 1))
        item, created = CartProduct.objects.get_or_create(
            cart=cart, product=product, defaults={"quantity": qty})
        if not created:
            item.quantity += qty
            item.save()
        return Response(CartProductSerializer(item).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def set_quantity(self, request):
        cart = get_active_cart(request.user)
        qty = int(request.data["quantity"])
        item = cart.cart_products.get(product_id=request.data["product"])
        if qty <= 0:
            item.delete()
        else:
            item.quantity = qty
            item.save()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def checkout(self, request):
        cart = get_active_cart(request.user)
        items = list(cart.cart_products.select_related("product"))
        if not items:
            return Response({"detail": "Cart is empty."}, status=400)
        with db_tx.atomic():
            tx = Transaction.objects.create(buyer=request.user)
            for ci in items:
                p = Product.objects.select_for_update().get(pk=ci.product_id)
                if p.stock < ci.quantity:
                    raise ValidationError({"detail": f"Not enough stock for {p.name}."})
                Product.objects.filter(pk=p.pk).update(stock=F("stock") - ci.quantity)
                ProductTransaction.objects.create(transaction=tx, item=p, quantity=ci.quantity)
            cart.cart_products.all().delete()
        return Response(TransactionSerializer(tx).data, status=201)


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(buyer=self.request.user).prefetch_related(
            "product_transactions__item")
