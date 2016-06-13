import { Injectable } from '@angular/core'


export class MainMenu {

    public static activities  = {
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
    }

    public static currentView: any =  MainMenu.activities.search;


    constructor(){}
}
