import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';

export interface Order {
    id?: number;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    status: string;
    date?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/orders';

    createOrder(order: { userId: string, items: CartItem[], totalAmount: number }): Observable<any> {
        return this.http.post(this.apiUrl, order);
    }

    getUserOrders(userId: string): Observable<{ message: string, data: Order[] }> {
        return this.http.get<{ message: string, data: Order[] }>(`${this.apiUrl}/user/${userId}`);
    }
}
