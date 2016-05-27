import {Component}        from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import {Header}           from './header.component';
import {Content}          from './content.component';
import {Footer}           from './footer.component';



@Component({
    selector: 'my-app',
    templateUrl: 'html/main.html',
	directives: [Header, Content, Footer],
    providers: [ HTTP_PROVIDERS ]
})

export class AppComponent { }
