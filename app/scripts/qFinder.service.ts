/**
 * Created by u334244 on 5/24/16.
 */
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Rx';
import {SQLQuery}  from './sqlQuery.model';



@Injectable()
export class QFinderService {

    constructor (private http: Http) {}

    private serviceUrl = {
               getAll: '/qfinder/all',
               getByDesc: '/qfinder/description/',
               getByQuery: '/qfinder/query/',
               getByTags: '/qfinder/tags/',
               getByAuthor: '/qfinder/author/',
               getByTeams: '/qfinder/filter/teams?',
               postNewOne: '/qfinder/create',
               updateOne: '/qfinder/update',
               deleteOne: '/qfinder/delete/',
               getByFilter: '/qfinder/filter?'
    };

    getAll (): Observable<SQLQuery[]> {
        return this.http.get(this.serviceUrl.getAll)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByTeams(teams: string): Observable<SQLQuery[]> {
        return this.http.get(this.serviceUrl.getByTeams + 'teams=' + teams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByDescription (desc: string): Observable<SQLQuery[]> {
        return this.http.get(this.serviceUrl.getByDesc + desc)
                                .map(this.extractData)
                                .catch(this.handleError);
    }

    getByQuery (query: string): Observable<SQLQuery[]> {
        return this.http.get(this.serviceUrl.getByQuery + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByTags (tags: string): Observable<SQLQuery[]> {
        return this.http.get(this.serviceUrl.getByTags + tags)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByAuthor (author: string): Observable<SQLQuery[]> {
        return this.http.get(this.serviceUrl.getByAuthor + author)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByFullFilters(exp: string, fields: string, teams: string): Observable<SQLQuery[]> {
        console.log('send: ' + fields);
        return this.http.get(this.serviceUrl.getByFilter + 'term=' + exp + '&' + 'fields=' + fields + '&' + 'teams=' + teams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }
    private handleError (error: any) {
        let errMsg = (error._body) ? JSON.parse(error._body) :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg.error);
        return Observable.throw(errMsg.error);
    }
}
