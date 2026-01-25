import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  query = '';
  suggestions: any[] = [];
  showSuggestions = false;

  private productService = inject(ProductService);
  private router = inject(Router);

  onInput() {
    if (!this.query.trim()) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }

    const q = this.query.toLowerCase();
    this.suggestions = this.productService.products().filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    ).slice(0, 5); // Limit to 5 suggestions

    this.showSuggestions = this.suggestions.length > 0;
  }

  selectSuggestion(product: any) {
    this.router.navigate(['/product', product.id]);
    this.query = '';
    this.suggestions = [];
    this.showSuggestions = false;
  }

  search() {
    if (this.query.trim()) {
      this.showSuggestions = false;
    }
  }
}
