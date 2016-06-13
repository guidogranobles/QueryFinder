import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { Observable }     from 'rxjs/Rx';
import {SQLQuery}         from './sqlQuery.model';


@Injectable()
export class QFinderService {

    constructor (private http: Http) {}

    ROOT_APP: string = '/qfinder';

    private servicePath = {
               getAll:     this.ROOT_APP + '/all',
               getByDesc:  this.ROOT_APP + '/description/',
               getByQuery: this.ROOT_APP + '/query/',
               getByTags:  this.ROOT_APP + '/tags/',
               getByAuthor:this.ROOT_APP + '/author/',
               getByTeams: this.ROOT_APP + '/filter/teams?',
               postNewOne: this.ROOT_APP + '/create',
               updateOne:  this.ROOT_APP + '/update',
               deleteOne:  this.ROOT_APP + '/delete/',
               getByFilter:this.ROOT_APP + '/filter?'
    };

    getAll (): Observable<SQLQuery[]> {
        return this.http.get(this.servicePath.getAll)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByTeams(teams: string): Observable<SQLQuery[]> {
        return this.http.get(this.servicePath.getByTeams + 'teams=' + teams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByDescription (desc: string): Observable<SQLQuery[]> {
        return this.http.get(this.servicePath.getByDesc + desc)
                                .map(this.extractData)
                                .catch(this.handleError);
    }

    getByQuery (query: string): Observable<SQLQuery[]> {
        return this.http.get(this.servicePath.getByQuery + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByTags (tags: string): Observable<SQLQuery[]> {
        return this.http.get(this.servicePath.getByTags + tags)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByAuthor (author: string): Observable<SQLQuery[]> {
        return this.http.get(this.servicePath.getByAuthor + author)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getByFullFilters(exp: string, fields: string, teams: string): Observable<SQLQuery[]> {
        console.log('send: ' + fields);
        return this.http.get(this.servicePath.getByFilter + 'term=' + exp + '&' + 'fields=' + fields + '&' + 'teams=' + teams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    save(newQuery: any): Observable<SQLQuery[]> {
        let body = JSON.stringify(newQuery);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.servicePath.postNewOne, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    update(newQuery: any): Observable<SQLQuery[]> {
        let body = JSON.stringify(newQuery);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(this.servicePath.updateOne, body, options)
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
