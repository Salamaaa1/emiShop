import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
    id?: number;
    productId: string;
    userId: string;
    username: string;
    content: string;
    date?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/comments';

    getComments(productId: string): Observable<{ message: string, data: Comment[] }> {
        return this.http.get<{ message: string, data: Comment[] }>(`${this.apiUrl}/${productId}`);
    }

    addComment(comment: Comment): Observable<any> {
        return this.http.post(this.apiUrl, comment);
    }
}
