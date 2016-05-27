import {Component} from '@angular/core';
import { NgForm }    from '@angular/common';
import { NgClass }    from '@angular/common';

import {Sidebar} from './sidebar.component';
import {PrettifyDirective} from './prettify.directive';
import {QFinderService} from './qFinder.service';
import {SQLQuery}  from './sqlQuery.model';

@Component({ 
	selector: 'my-content',
	templateUrl: 'html/content.html',
	directives: [Sidebar, PrettifyDirective, NgClass],
    providers: [QFinderService]
})
export class Content {

    constructor(private qFinderService: QFinderService){}

    fieldFilters = {description: {field: 'Description', label:'description', selected: false},
                    query: {field: 'Query',  label:'query', selected: false}, tags: { field: 'Tags',  label:'tags', selected: false},
                    author: { field: 'Author',  label:'author', selected: false } };

   
    txtSearch: string = '';
    errorMessage: string;
    errorMsgVisible: boolean = false;
    opValue: string;
    sqlQueries: SQLQuery[];

     findQuery(){


        var selectedFieldFilters = this.getSelectedFilters(this.fieldFilters);
        var selectedTeamFilters = this.getSelectedFilters(this.teamFilters);

        if(selectedFieldFilters.length === 1 && selectedTeamFilters.length ===0 && this.txtSearch.length > 0){
            this.execFiltersByFieldOnly(selectedFieldFilters);
        }else if(selectedFieldFilters.length === 0 && selectedTeamFilters.length > 0 && this.txtSearch.length === 0){
            this.getByTeamsOnly(this.getStringItemsFromArray(selectedTeamFilters));
        }else if( (selectedFieldFilters.length > 0 || selectedTeamFilters.length > 0) && this.txtSearch.length > 0){
            this.getByFullFilters(this.txtSearch, this.getStringItemsFromArray(selectedFieldFilters), this.getStringItemsFromArray(selectedTeamFilters));
        }else if(selectedFieldFilters.length === 0 && selectedTeamFilters.length === 0 && this.txtSearch.length === 0){
            this.getAll();
        }

    }

    private execFiltersByFieldOnly(selectedFieldFilters: string[]){

        if(this.isOnlyThisFilterSelected('description', selectedFieldFilters)){
            this.getByDescription(this.txtSearch);
        }else if(this.isOnlyThisFilterSelected('query', selectedFieldFilters)){
            this.getByQuery(this.txtSearch);
        }else if(this.isOnlyThisFilterSelected('tags', selectedFieldFilters)){
            this.getByTags(this.txtSearch);
        }else if(this.isOnlyThisFilterSelected('author', selectedFieldFilters)){
            this.getByAuthor(this.txtSearch);
        }

    }

    private getAll() {
        this.qFinderService.getAll()
            .subscribe(
                sqlQueries => {this.errorMsgVisible=false; this.sqlQueries = sqlQueries},
                error =>   this.errorHandler( <any>error)
        );
    }

    private getByFullFilters(exp: string, fields: string, teams: string) {
        console.log('getByFullFilters' + fields);
        this.qFinderService.getByFullFilters(exp, fields, teams)
            .subscribe(
            sqlQueries => this.sqlQueries = sqlQueries,
            error =>   this.errorHandler( <any>error)
        );
    }

    private getByTeamsOnly(teams: string) {
        this.qFinderService.getByTeams(teams)
            .subscribe(
            sqlQueries => this.sqlQueries = sqlQueries,
            error =>  this.errorHandler( <any>error)
        );
    }

    private getByDescription(desc: string) {
        this.qFinderService.getByDescription(desc)
            .subscribe(
            sqlQueries => this.sqlQueries = sqlQueries,
            error =>  this.errorHandler( <any>error)
        );
    }

    private getByQuery(query: string) {
        this.qFinderService.getByQuery(query)
            .subscribe(
            sqlQueries => this.sqlQueries = sqlQueries,
            error =>   this.errorHandler( <any>error)
        );
    }

    private getByTags(tags: string) {
        this.qFinderService.getByTags(tags)
            .subscribe(
            sqlQueries => this.sqlQueries = sqlQueries,
            error =>  this.errorHandler( <any>error)
        );
    }

    private getByAuthor(author: string) {
        this.qFinderService.getByAuthor(author)
            .subscribe(
            sqlQueries => this.sqlQueries = sqlQueries,
            error =>  this.errorHandler( <any>error)
        );
    }

    private getSelectedFilters(filters: Object){

        var selectedFilters: Array<string> = [];

        Object.keys(filters).filter(function(key) {
            if(filters.hasOwnProperty(key)){
                if(filters[key].selected)
                    selectedFilters.push(filters[key].label);
            }

            return true;
         });

        return selectedFilters;
    }

    private getStringItemsFromArray(array: String[]){

        var result = '';

        array.forEach(function(item, index){
            result = result + item;
            if(index <= array.length-2){
                result = result + ',';
            }
        });

        return result;
    }

    private isOnlyThisFilterSelected(filterName: string, selectedFilters: string[]){
        if(selectedFilters.length === 1 && selectedFilters.indexOf(filterName) > -1){
            return true;
        }
        return false;
    }

    private errorHandler(error: string){
         this.errorMessage = error;
         this.errorMsgVisible=true;
         this.opValue='dissapear 3s linear 0s 2 alternate';
         var pr = this;
         setTimeout(function(){ pr.opValue = "";}, 5000);
    }
}