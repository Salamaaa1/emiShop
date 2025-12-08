import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { Categories } from './components/categories/categories';
import { ListeProducts } from './components/liste-products/liste-products';
import { Auth } from './components/auth/auth';
import { Panier } from './components/panier/panier';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    RouterOutlet,
    Header,
    Categories,
    ListeProducts,
    Auth,
    Panier,
    Footer
  ]
})
export class App { }
