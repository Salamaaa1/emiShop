import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { CommentService, Comment } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

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
    newCommentRating = 5;
    errorMessage = '';

    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private commentService = inject(CommentService);
    public cartService = inject(CartService); // Public for template
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
            content: this.newCommentText,
            rating: this.newCommentRating
        };

        this.commentService.addComment(newComment).subscribe({
            next: () => {
                this.loadComments(this.product!.id.toString()); // Reload to get IDs
                this.newCommentText = '';
                this.newCommentRating = 5;
                this.errorMessage = '';
            },
            error: (err) => {
                this.errorMessage = err.error.error || 'Failed to post comment';
                console.error('Comment error:', err);
            }
        });
    }

    deleteComment(commentId: number | undefined) {
        if (!commentId) return;
        if (!confirm('Are you sure you want to delete this comment?')) return;

        this.commentService.deleteComment(commentId).subscribe(() => {
            this.comments = this.comments.filter(c => c.id !== commentId);
        });
    }
}
