import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Comment {
    id?: number;
    productId: string;
    userId: string;
    username: string;
    content: string;
    rating?: number;
    date?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = 'http://localhost:3001/api/comments';

    getComments(productId: string): Observable<{ message: string, data: Comment[] }> {
        return this.http.get<{ message: string, data: Comment[] }>(`${this.apiUrl}/${productId}`);
    }

    addComment(comment: Comment): Observable<any> {
        const token = this.authService.getToken();
        const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
        return this.http.post(this.apiUrl, comment, { headers });
    }

    deleteComment(id: number): Observable<any> {
        const token = this.authService.getToken();
        const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
        return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }
}
