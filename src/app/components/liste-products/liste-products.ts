import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-liste-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liste-products.html',
  styleUrl: './liste-products.css',
})
export class ListeProducts implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);

  ngOnInit() {
    this.productService.getProducts().subscribe();
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.productService.sortProducts(select.value);
  }
}
