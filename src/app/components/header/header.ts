import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private productService = inject(ProductService);
  cartService = inject(CartService);
  authService = inject(AuthService);

  logout() {
    this.authService.logout().subscribe();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.productService.searchProducts(input.value).subscribe();
  }
}
