import {Component, Output, EventEmitter} from '@angular/core';
import { NgForm }    from '@angular/common';
import { NgStyle }    from '@angular/common';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control   } from '@angular/common';

import {Sidebar} from './sidebar.component';
import {PrettifyDirective} from './prettify.directive';
import {QFinderService} from './qFinder.service';
import {SQLQuery}  from './sqlQuery.model';
import {MainMenu}  from './mainMenu.model';
import {MenuService}  from './menu.service';

@Component({
    selector: 'frm-add-query',
    templateUrl: 'html/frm-add-query.html',
    directives: [ PrettifyDirective, NgStyle, FORM_DIRECTIVES],
    providers: [QFinderService]
})
export class FrmAddQuery {

    teams:Array<string> = [ 'Application Management', 'Closing/Funding', 'Doc Gen / Prepaids', 'Pricing - Closing Fees'];
    errorMessage: string;
    opValue: string;
    titleHeader: string = '';
    backgroundHeader: string = '';
    footerMsg: string = '';
    sqlQueries: SQLQuery[];
    responseManager: (messageType: string, message: string) => void;
    isDataMissing: boolean;

    frmAddQuery: ControlGroup;
    description: AbstractControl;
    query: AbstractControl;
    author: AbstractControl;
    team: AbstractControl;
    version: AbstractControl;
    newAction: any;

    constructor(fb: FormBuilder, private qFinderService: QFinderService,  private menuService: MenuService){
        this.frmAddQuery = fb.group(
            {
                'description': ['', Validators.required],
                'query':       ['', Validators.required],
                'author':      ['', Validators.required],
                'team':[this.teams[0], Validators.required],
                'version':      ['', Validators.required]
            }
        );

        this.description = this.frmAddQuery.controls['description'];
        this.query = this.frmAddQuery.controls['query'];
        this.author = this.frmAddQuery.controls['author'];
        this.team = this.frmAddQuery.controls['team'];
        this.version = this.frmAddQuery.controls['version'];
    }

    public onSubmit(newQuery:string) : void{
        if(!this.frmAddQuery.valid){
            this.showMsgError();
        }else{
            this.qFinderService.save(newQuery)
                .subscribe(
                sqlQueries => this.responseProcessor(sqlQueries),
                error =>   this.errorHandler( <any>error)
            );
        }
    }

    public cancelAction(){
        this.menuService.Stream.changeCurrentView(MainMenu.activities.search);

    }

    private showMsgError(){

        if(!this.description.valid){
            this.showMessage('Error', '' +
                'please enter a description for this query');
        }else  if(!this.author.valid){
            this.showMessage('Error', '' +
                'please enter an author for this query');
        }else  if(!this.team.valid){
            this.showMessage('Error', '' +
                'please enter a team for this query');
        }else  if(!this.version.valid){
            this.showMessage('Error', '' +
                'please enter a version for this query');
        }else  if(!this.query.valid){
            this.showMessage('Error', '' +
                'please enter a sql query statement');
        }

        this.isDataMissing = true;

    }

    private errorHandler(error: string){
        this.errorMessage = error;
        this.showMessage('Error', this.errorMessage);
    }

    private responseProcessor(results: SQLQuery[]){
        if(results && results.length === 0){
            this.errorMessage = 'No results found';
            this.showMessage('Info', this.errorMessage);
        }else{
            this.resetFields();
            this.showMessage('Info', 'New Query saved successfully');
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
            this.footerMsg = 'Record saved';
        }

        this.errorMessage = msg;

        this.opValue='dissapear 2s linear 0s 2 alternate';
        var pr = this;
        setTimeout(function(){ pr.opValue = "";}, 5000);
    }

    private resetFields(){
        (<Control>this.frmAddQuery.controls['description']).updateValue('');
        (<Control>this.frmAddQuery.controls['query']).updateValue('');
    }

}
