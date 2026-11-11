from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import BaseUser, Product, Cart, CartProduct, Transaction, ProductTransaction

admin.site.register(BaseUser, UserAdmin)
admin.site.register([Product, Cart, CartProduct, Transaction, ProductTransaction])
