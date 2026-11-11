from rest_framework import serializers

from .models import BaseUser, Product, Cart, CartProduct, Transaction, ProductTransaction


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = BaseUser
        fields = ("id", "username", "email", "password", "first_name", "last_name")

    def create(self, validated_data):
        return BaseUser.objects.create_user(**validated_data)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "name", "sku", "description", "price", "stock", "thumbnail", "is_active")


class CartProductSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = CartProduct
        fields = ("id", "product", "product_detail", "quantity")


class CartSerializer(serializers.ModelSerializer):
    cart_products = CartProductSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ("id", "cart_products")


class ProductTransactionSerializer(serializers.ModelSerializer):
    item_detail = ProductSerializer(source="item", read_only=True)

    class Meta:
        model = ProductTransaction
        fields = ("id", "item", "item_detail", "quantity")


class TransactionSerializer(serializers.ModelSerializer):
    product_transactions = ProductTransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Transaction
        fields = ("id", "created_at", "product_transactions")
