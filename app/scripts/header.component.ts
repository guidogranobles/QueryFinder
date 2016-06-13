import {Component, Output, EventEmitter} from '@angular/core';
import {MainMenu}  from './mainMenu.model';
import {MenuService}  from './menu.service';


@Component({ 
	selector: 'my-header',
	templateUrl: 'html/header.html',
    providers:[MenuService, MainMenu]
})
export class Header {

    constructor(private menuService: MenuService){
        menuService.Stream.changeCurrentView(MainMenu.activities.search);
    }

    public addOnClick() {
        this.menuService.Stream.changeCurrentView(MainMenu.activities.add);
    }

    public searchOnClick() {
        this.menuService.Stream.changeCurrentView(MainMenu.activities.search);
    }

}
