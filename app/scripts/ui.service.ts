import { Injectable, EventEmitter } from '@angular/core';
import {Subject } from 'rxjs/Subject';
import {MainMenu}  from './mainMenu.model';

export class UIService extends Subject<MainMenu> {

     sharedData: any;

     constructor() {
        super();
    }

    public  changeCurrentView(newView: any){
        MainMenu.currentView = newView;
        super.next(newView);
    }
}
