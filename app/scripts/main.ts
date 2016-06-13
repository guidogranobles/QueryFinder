import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import {MenuService}  from './menu.service';

bootstrap(AppComponent, [MenuService]);
