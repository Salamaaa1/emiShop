import { Injectable, signal, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface Category {
    slug: string;
    name: string;
    url: string;
}

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3001/api/products';


    products = signal<Product[]>([]);
    categories = signal<Category[]>([]);

    constructor(private http: HttpClient) { }

    getProducts(): Observable<ProductResponse> {
        return this.http.get<ProductResponse>(this.apiUrl).pipe(
            tap(response => this.products.set(response.products))
        );
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
            tap(categories => this.categories.set(categories))
        );
    }

    getProductsByCategory(categorySlug: string): Observable<ProductResponse> {
        return this.http.get<ProductResponse>(`${this.apiUrl}/category/${categorySlug}`).pipe(
            tap(response => this.products.set(response.products))
        );
    }

    searchProducts(query: string): Observable<ProductResponse> {
        return this.http.get<ProductResponse>(`${this.apiUrl}/search?q=${query}`).pipe(
            tap(response => this.products.set(response.products))
        );
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    sortProducts(sortBy: string) {
        this.products.update(products => {
            const sorted = [...products];
            switch (sortBy) {
                case 'price-asc':
                    return sorted.sort((a, b) => a.price - b.price);
                case 'price-desc':
                    return sorted.sort((a, b) => b.price - a.price);
                case 'rating':
                    return sorted.sort((a, b) => b.rating - a.rating);
                case 'best-sellers':
                    return sorted.sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0));
                default:
                    return sorted.sort((a, b) => a.id - b.id);
            }
        });
    }

    private authService = inject(AuthService); // Inject properly (need to import inject, AuthService)
    addProduct(product: Partial<Product>): Observable<any> {
        const token = this.authService.getToken();
        const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
        return this.http.post(this.apiUrl, product, { headers }).pipe(
            tap(() => {
                // Refresh products
                this.getProducts().subscribe();
            })
        );
    }
}
