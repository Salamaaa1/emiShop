import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'product/:id', loadComponent: () => import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent) },
    { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [authGuard] },
    { path: 'order-history', loadComponent: () => import('./components/order-history/order-history.component').then(m => m.OrderHistoryComponent), canActivate: [authGuard] },
    { path: 'admin/orders', loadComponent: () => import('./components/admin/admin-orders.component').then(m => m.AdminOrdersComponent), canActivate: [authGuard] },
    { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) }
];
