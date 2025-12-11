import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  productService = inject(ProductService);

  ngOnInit() {
    this.productService.getCategories().subscribe();
  }

  selectCategory(slug: string) {
    this.productService.getProductsByCategory(slug).subscribe();
  }

  resetCategory() {
    this.productService.getProducts().subscribe();
  }
}
