import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Order, OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-orders.component.html',
    styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
    activeTab = 'orders';
    orders: Order[] = [];
    users: any[] = [];
    newProduct: any = {
        title: '',
        price: 0,
        description: '',
        brand: '',
        category: '',
        thumbnail: '',
        images: []
    };

    // Services
    private orderService = inject(OrderService);
    private authService = inject(AuthService);
    private productService = inject(ProductService);
    private http = inject(HttpClient);

    headers = [
        { key: 'id', label: 'ID' },
        { key: 'userId', label: 'User ID' },
        { key: 'date', label: 'Date' },
        { key: 'totalAmount', label: 'Total' },
        { key: 'status', label: 'Status' }
    ];
    sortColumn = 'date';
    sortDirection: 'asc' | 'desc' = 'desc';

    ngOnInit() {
        this.loadOrders();
        this.loadUsers();
    }

    loadUsers() {
        const token = this.authService.getToken();
        const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
        this.http.get<{ data: any[] }>('http://localhost:3001/api/users', { headers }).subscribe(res => {
            this.users = res.data;
        });
    }

    createProduct() {
        // Simple validation
        if (!this.newProduct.title) return;

        // Set default image if empty
        if (!this.newProduct.images || this.newProduct.images.length === 0) {
            this.newProduct.images = [this.newProduct.thumbnail];
        }

        this.productService.addProduct(this.newProduct).subscribe(() => {
            alert('Product Created!');
            this.newProduct = { title: '', price: 0, description: '', brand: '', category: '', thumbnail: '', images: [] };
        });
    }

    loadOrders() {
        this.orderService.getAllOrders().subscribe(res => {
            this.orders = res.data;
            this.sortOrders(this.sortColumn); // Initial sort
        });
    }

    sortOrders(column: string) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.orders.sort((a: any, b: any) => {
            let valA = a[column];
            let valB = b[column];

            // Handle date strings
            if (column === 'date') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }

            if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    updateStatus(order: Order, newStatus: string) {
        if (!order.id) return;
        this.orderService.updateOrderStatus(order.id, newStatus).subscribe(() => {
            order.status = newStatus;
        });
    }
    resetPassword(email: string) {
        if (!confirm(`Envoyer un email de réinitialisation à ${email}?`)) return;
        this.authService.resetPassword(email).subscribe({
            next: () => alert('Email de réinitialisation envoyé!'),
            error: (err) => alert('Erreur: ' + err.message)
        });
    }
}
