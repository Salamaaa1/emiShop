import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private productService = inject(ProductService);
  cartService = inject(CartService);

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.productService.searchProducts(input.value).subscribe();
  }
}
