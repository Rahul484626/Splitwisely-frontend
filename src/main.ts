import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/auth/auth.interceptor';
import { initNativeShell } from './app/core/native/native-init';

async function start() {
  await initNativeShell();

  await bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideHttpClient(withInterceptors([authInterceptor])),
      provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    ],
  });
}

void start();
