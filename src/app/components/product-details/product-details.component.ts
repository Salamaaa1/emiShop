import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { CommentService, Comment } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
    product: Product | undefined;
    comments: Comment[] = [];
    newCommentText = '';

    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private commentService = inject(CommentService);
    public authService = inject(AuthService); // Public for template access

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadProduct(id);
            this.loadComments(id);
        }
    }

    loadProduct(id: string) {
        this.productService.getProduct(id).subscribe(product => {
            this.product = product;
        });
    }

    loadComments(productId: string) {
        this.commentService.getComments(productId).subscribe(res => {
            this.comments = res.data;
        });
    }

    submitComment() {
        const user = this.authService.currentUserSig();
        if (!user || !this.product || !this.newCommentText.trim()) return;

        // Use current time for display; backend will overwrite date
        const newComment: Comment = {
            productId: this.product.id.toString(),
            userId: user.uid,
            username: user.displayName || user.email || 'Anonymous',
            content: this.newCommentText
        };

        this.commentService.addComment(newComment).subscribe(() => {
            this.comments.push({ ...newComment, date: new Date().toISOString() });
            this.newCommentText = '';
        });
    }
}
