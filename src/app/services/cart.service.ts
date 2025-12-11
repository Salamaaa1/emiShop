import { Injectable, computed, signal } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartItems = signal<CartItem[]>([]);

    totalItems = computed(() =>
        this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
    );

    totalPrice = computed(() =>
        this.cartItems().reduce((acc, item) => acc + (item.product.price * 10 * item.quantity), 0)
    );

    addToCart(product: Product) {
        this.cartItems.update(items => {
            const existingItem = items.find(item => item.product.id === product.id);
            if (existingItem) {
                return items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...items, { product, quantity: 1 }];
        });
    }

    removeFromCart(productId: number) {
        this.cartItems.update(items => items.filter(item => item.product.id !== productId));
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        this.cartItems.update(items =>
            items.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    }

    clearCart() {
        this.cartItems.set([]);
    }
}
