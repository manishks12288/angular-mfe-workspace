import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { authGuard, guestGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => 
      import('./home/home').then(m => m.Home),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart').then(m => m.Cart)
  },
  {
    path: 'products',
    loadChildren: () => {
      console.log('=== Starting to load products remote ===');
      console.log('Remote name: products');
      console.log('Exposed module: ./routes');
      console.log('Expected URL: http://localhost:4201/remoteEntry.json');
      
      return loadRemoteModule('products', './routes')
        .then((m) => {
          console.log('✅ Successfully loaded remote module');
          console.log('Module contents:', Object.keys(m));
          console.log('PRODUCTS_ROUTES:', m.PRODUCTS_ROUTES);
          
          if (!m.PRODUCTS_ROUTES) {
            console.error('❌ PRODUCTS_ROUTES not found in module!');
            console.log('Available exports:', m);
          }
          
          return m.PRODUCTS_ROUTES;
        })
        .catch(err => {
          console.error('❌ Failed to load products remote');
          console.error('Error details:', err);
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
          throw err;
        });
    }
  },
  // {
  //   path: 'products',
  //   loadChildren: () =>
  //     loadRemoteModule('products', './routes').then(m => m.PRODUCTS_ROUTES),
  // },
  {
    path: 'orders',
    loadChildren: () =>
      loadRemoteModule('orders', './routes').then(m => m.ORDERS_ROUTES),
  },
  {
    path: 'users',
    loadChildren: () =>
      loadRemoteModule('users', './routes').then(m => m.USERS_ROUTES),
  }
];