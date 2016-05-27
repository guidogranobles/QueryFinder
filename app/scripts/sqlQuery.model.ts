/**
 * Created by u334244 on 5/24/16.
 */
export class SQLQuery{

    constructor(
        public id: number,
        public description: string,
        public query: string,
        public team: string,
        public author: string,
        public version: string,
        public creationDate: Date,
        public tags: string[]

    ){}
}
