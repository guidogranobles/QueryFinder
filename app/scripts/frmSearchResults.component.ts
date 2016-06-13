import {Component, Output, EventEmitter} from '@angular/core';
import { NgForm }    from '@angular/common';
import { NgStyle }    from '@angular/common';
import {Sidebar} from './sidebar.component';
import {PrettifyDirective} from './prettify.directive';
import {QFinderService} from './qFinder.service';
import {SQLQuery}  from './sqlQuery.model';
import {MainMenu}  from './mainMenu.model';
import {MenuService}  from './menu.service';

@Component({
    selector: 'frm-search-results',
    templateUrl: 'html/frm-search-results.html',
    directives: [ PrettifyDirective, NgStyle],
    providers: [QFinderService]
})
export class FrmSearchResult {

    errorMessage: string;
    sqlQueries: SQLQuery[];
    responseManager: (messageType: string, message: string) => void;

    constructor(private qFinderService: QFinderService, private menuService: MenuService ){}

    findQuery(txtSearch:string, fieldFilters:Object, teamFilters:Object, procResponse: (messageType: string, message: string) => void){

        if(this.sqlQueries){
            this.sqlQueries.length = 0;
        }

        this.errorMessage = "";

        this.responseManager = procResponse;

        var selectedFieldFilters = this.getSelectedFilters(fieldFilters);
        var selectedTeamFilters = this.getSelectedFilters(teamFilters);

        if(selectedFieldFilters.length === 1 && selectedTeamFilters.length ===0 && txtSearch.length > 0){
            this.execFiltersByFieldOnly(selectedFieldFilters, txtSearch);
        }else if(selectedFieldFilters.length === 0 && selectedTeamFilters.length > 0 && txtSearch.length === 0){
            this.getByTeamsOnly(this.getStringItemsFromArray(selectedTeamFilters));
        }else if( (selectedFieldFilters.length > 0 || selectedTeamFilters.length > 0) && txtSearch.length > 0){
            this.getByFullFilters(txtSearch, this.getStringItemsFromArray(selectedFieldFilters), this.getStringItemsFromArray(selectedTeamFilters));
        }else if(selectedFieldFilters.length === 0 && selectedTeamFilters.length === 0 && txtSearch.length === 0){
            this.getAll();
        }else{
            this.errorHandler('The search parameters are wrong. Please fix and try again');
        }

    }

    private execFiltersByFieldOnly(selectedFieldFilters: string[], txtSearch: string){

        if(this.isOnlyThisFilterSelected('description', selectedFieldFilters)){
            this.getByDescription(txtSearch);
        }else if(this.isOnlyThisFilterSelected('query', selectedFieldFilters)){
            this.getByQuery(txtSearch);
        }else if(this.isOnlyThisFilterSelected('tags', selectedFieldFilters)){
            this.getByTags(txtSearch);
        }else if(this.isOnlyThisFilterSelected('author', selectedFieldFilters)){
            this.getByAuthor(txtSearch);
        }

    }

    private getAll() {
        this.qFinderService.getAll()
            .subscribe(
            sqlQueries => this.responseProcessor(sqlQueries),
            error =>   this.errorHandler( <any>error)
        );
    }

    private getByFullFilters(exp: string, fields: string, teams: string) {
        this.qFinderService.getByFullFilters(exp, fields, teams)
            .subscribe(
            sqlQueries => this.responseProcessor(sqlQueries),
            error =>   this.errorHandler( <any>error)
        );
    }

    private getByTeamsOnly(teams: string) {
        this.qFinderService.getByTeams(teams)
            .subscribe(
            sqlQueries => this.responseProcessor(sqlQueries),
            error =>  this.errorHandler( <any>error)
        );
    }

    private getByDescription(desc: string) {
        this.qFinderService.getByDescription(desc)
            .subscribe(
            sqlQueries => this.responseProcessor(sqlQueries),
            error =>  this.errorHandler( <any>error)
        );
    }

    private getByQuery(query: string) {
        this.qFinderService.getByQuery(query)
            .subscribe(
            sqlQueries => this.responseProcessor(sqlQueries),
            error =>   this.errorHandler( <any>error)
        );
    }

    private getByTags(tags: string) {
        this.qFinderService.getByTags(tags)
            .subscribe(
            sqlQueries => this.responseProcessor(sqlQueries),
            error =>  this.errorHandler( <any>error)
        );
    }

    private getByAuthor(author: string) {
        this.qFinderService.getByAuthor(author)
            .subscribe(
            sqlQueries => this.responseProcessor(sqlQueries),
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
        this.responseManager('Error', this.errorMessage);
    }

    private responseProcessor(results: SQLQuery[]){
        if(results && results.length === 0){
            this.errorMessage = 'No results found';
            this.responseManager('Info', this.errorMessage);
        }else{
            this.sqlQueries = results;
        }
    }

    public onClickEdit(sqlQuery: any){
        this.menuService.Stream.sharedData = sqlQuery;
        this.menuService.Stream.changeCurrentView(MainMenu.activities.edit);
     }

}
