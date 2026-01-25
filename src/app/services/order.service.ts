import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';
import { AuthService } from './auth.service';

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
    private authService = inject(AuthService);
    private apiUrl = '/api/orders';

    private getHeaders(): any {
        const token = this.authService.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    createOrder(order: { userId: string, items: CartItem[], totalAmount: number }): Observable<any> {
        return this.http.post(this.apiUrl, order, { headers: this.getHeaders() });
    }

    getUserOrders(userId: string): Observable<{ message: string, data: Order[] }> {
        return this.http.get<{ message: string, data: Order[] }>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
    }

    getAllOrders(): Observable<{ message: string, data: Order[] }> {
        return this.http.get<{ message: string, data: Order[] }>(this.apiUrl, { headers: this.getHeaders() });
    }

    updateOrderStatus(orderId: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${orderId}`, { status }, { headers: this.getHeaders() });
    }
}
