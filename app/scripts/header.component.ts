import {Component, Output, EventEmitter} from '@angular/core';

@Component({ 
	selector: 'my-header',
	templateUrl: 'html/header.html'
})
export class Header {

    activities  = {
        add: {
            action: "Add",
            label: "Create a new sql query"
        },
        edit:{
            action: "Edit",
            label: "Edit query"
        },
        search: {
            action: "Search",
            label: "Search results"
        },
        favorites: {
            action: "Favorites",
            label: "Your favorite queries"
        },
        settings: {
            action: "Settings",
            label: "Enviroment settings"
        }
    };

    @Output() addMenuClick: EventEmitter<any> = new EventEmitter();

    public addOnClick() {
        this.addMenuClick.emit({value: this.activities.add});
    }

    public searchOnClick() {
        this.addMenuClick.emit({value: this.activities.search});
    }

}
