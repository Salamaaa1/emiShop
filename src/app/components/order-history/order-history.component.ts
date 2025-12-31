import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
    orders: Order[] = [];

    private orderService = inject(OrderService);
    private authService = inject(AuthService);

    ngOnInit() {
        const user = this.authService.currentUserSig();
        if (user) {
            this.orderService.getUserOrders(user.uid).subscribe(res => {
                this.orders = res.data;
            });
        }
    }
}
