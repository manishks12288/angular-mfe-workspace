import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideStore } from '@ngrx/store';
import { cartReducer } from 'shared-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
     provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    // Global NgRx Store
    provideStore({
      cart: cartReducer,
      // Add more global state here (auth, settings, etc.)
    }),
    
    // NgRx DevTools
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      name: 'Host Global Store',
      trace: true,
      traceLimit: 75
    })
  ]
};
