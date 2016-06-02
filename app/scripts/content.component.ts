import {Component, ViewChild , Input   } from '@angular/core';
import { NgForm }    from '@angular/common';
import { NgStyle }    from '@angular/common';

import {SQLQuery}  from './sqlQuery.model';
import {FrmSearchResult}  from './frmSearchResults.component';
import {FrmAddQuery}  from './frmAddQuery.component';

@Component({ 
	selector: 'my-content',
	templateUrl: 'html/content.html',
	directives: [NgStyle, FrmSearchResult, FrmAddQuery]

})
export class Content {

    constructor(){

    }

    @ViewChild(FrmSearchResult) frmSearchResult:FrmSearchResult;

    fieldFilters = {description: {field: 'Description', label:'description', selected: false},
        query: {field: 'Query',  label:'query', selected: false}, tags: { field: 'Tags',  label:'tags', selected: false},
        author: { field: 'Author',  label:'author', selected: false } };

   
    txtSearch: string = '';
    errorMessage: string;
    errorMsgVisible: boolean = false;
    opValue: string;
    titleHeader: string = '';
    backgroundHeader: string = '';
    footerMsg: string = '';
    showMsg = this.showMessage.bind(this);
    marginResults: string = '0';
    transResults: string = '';

    _action: any = {
           action: "Search",
           label: "Search results"
    };

    test(t: any){
        this._action = t;
    }

   @Input()
    set action(act: any){
        this._action = act;
        console.log(act);
    }

    get action(){
        return this._action;
    }

    public findQuery(){
        this.frmSearchResult.findQuery(this.txtSearch, this.fieldFilters, this.teamFilters, this.showMsg);
    }

    public isSearchQueryActive(){

        var isSearchSelected = this._action.action === 'Search'
        if(isSearchSelected){
            this.moveResultsPanel('right');
        }else{
            this.moveResultsPanel('left');
        }

        return isSearchSelected;
    }

    public isAddNewQueryActive(){
        return this._action.action === 'Add';
    }

    private moveResultsPanel(direction: string){

         if(direction === 'right'){
             this.marginResults = '0';
         }else  if(direction === 'left'){
             this.marginResults = '250px'

         }
    }


    private showMessage(typeMessage: string, msg: string){
        if(typeMessage === 'Error'){
            this.titleHeader = 'Error!';
            this.backgroundHeader = "rgba(255, 0, 0, 0.39)";
            this.footerMsg = 'Invalid entry';
        }else if (typeMessage === 'Info'){
            this.titleHeader = 'Information';
            this.backgroundHeader = "#587DA0";
            this.footerMsg = 'The server returned 0 records';
        }

        this.errorMessage = msg;

        this.opValue='dissapear 2s linear 0s 2 alternate';
        var pr = this;
        setTimeout(function(){ pr.opValue = "";}, 5000);
    }

}
