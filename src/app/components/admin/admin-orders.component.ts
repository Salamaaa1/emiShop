import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../services/order.service';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-orders.component.html',
    styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
    orders: Order[] = [];

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/orders';

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.http.get<{ message: string, data: Order[] }>(this.apiUrl).subscribe(res => {
            this.orders = res.data;
        });
    }

    updateStatus(order: Order, newStatus: string) {
        this.http.put(`${this.apiUrl}/${order.id}`, { status: newStatus }).subscribe(() => {
            order.status = newStatus;
        });
    }
}
