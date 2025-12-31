import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
    cartService = inject(CartService);
    orderService = inject(OrderService);
    authService = inject(AuthService);
    router = inject(Router);

    placeOrder() {
        const user = this.authService.currentUserSig();
        if (!user) {
            this.router.navigate(['/login']);
            return;
        }

        const order = {
            userId: user.uid,
            items: this.cartService.cartItems(),
            totalAmount: this.cartService.totalPrice()
        };

        this.orderService.createOrder(order).subscribe({
            next: () => {
                this.cartService.clearCart();
                this.router.navigate(['/order-history']);
            },
            error: (err) => {
                console.error('Order failed', err);
                // Handle error (show message)
            }
        });
    }
}
