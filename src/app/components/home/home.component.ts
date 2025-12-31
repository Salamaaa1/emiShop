import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categories } from '../categories/categories';
import { ListeProducts } from '../liste-products/liste-products';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, Categories, ListeProducts],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

}
