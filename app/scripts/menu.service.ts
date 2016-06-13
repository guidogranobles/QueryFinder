import {Injectable} from '@angular/core';
import {UIService}  from './ui.service';

@Injectable()
export class MenuService{
    Stream:UIService;
    constructor(){
        this.Stream = new UIService();
    }
}
