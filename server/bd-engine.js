var mongoose = require('mongoose');

module.exports = function(){

	var db = mongoose.connection;
	var dbEngine = {queryTable: null, findAll: null};

	var sqlQuerySchema = mongoose.Schema({
		  id: Number,
		  description: {
					type: String,
					required: true
		  },
		  query: {
			        type: String,
					required: true
		  },
		  team: {
		           type: String,
				   required: true
		  },
          author: {
            type: String,
            required: true
          },
          version: {
              type: String,
              required: false
          },
          creationDate: {
              type: Date,
              required: false
          },
          tags: []

    });
	
	dbEngine.initDB = function(onError, onSuccess){
		db.on('error', onError);
		db.once('open', onSuccess);

		mongoose.connect('mongodb://localhost/querySelector');
		dbEngine.queryTable = mongoose.model('queryTable', sqlQuerySchema);
	}
	
	dbEngine.insertRecord = function(tableDef){
		return new dbEngine.queryTable(tableDef);
	}

	dbEngine.findAll = function (callBack) {
        dbEngine.queryTable.find(callBack);
    }

    dbEngine.findByTeams = function (teams, callBack) {

        var findByTeam   = teams !==undefined && teams!==null && teams.length !== 0;

        if(findByTeam){
            var nameTeams= [];

            teams.forEach(function(team){
                var keyValue= {};
                if(typeof team === 'string' && team.trim().length > 0){
                    keyValue['team'] = team;
                    nameTeams.push(keyValue);
                }
            })

            if(nameTeams.length === 0){
                callBack('There is not any valid team.')
            }

            dbEngine.queryTable.find({$or: nameTeams}, callBack);
        }else{
            callBack('There is not any team selected.');
        }
    }

    dbEngine.findByFilters = function (expression, fields, teams, callBack) {

        if(typeof expression !== 'string' || expression.trim().length === 0){
            callBack('No valid expression to search for was provided.');
        }

        var expToSearch     = new RegExp(expression, 'i');

        var findByTeam   = teams !==undefined && teams!==null && teams.length !== 0;
        var findByFields = fields !==undefined && fields!==null && fields.length !== 0;

        if(!findByTeam && !findByFields){
            callBack('There is not any filter selected.');
        }

        if(findByFields){
            var nameFields= [];

            fields.forEach(function(field){
                var keyValue= {};
                if(typeof field === 'string' && field.trim().length > 0){
                    keyValue[field] = expToSearch;
                    nameFields.push(keyValue);
                }
            });

            if(nameFields.length === 0){
                callBack('There is not any valid name field.')
            }
        }

        if(findByTeam){
            var nameTeams= [];
            teams.forEach(function(team){
                var keyValue= {};
                if(typeof team === 'string' && team.trim().length > 0){
                    keyValue['team'] = team;
                    nameTeams.push(keyValue);
                }
            });

            if(nameTeams.length === 0){
                callBack('There is not any valid team.')
            }
        }

        if(findByFields && !findByTeam){
            dbEngine.queryTable.find({$or: nameFields}, callBack);
        }else if(!findByFields && findByTeam){
            dbEngine.queryTable.find({$or: nameTeams}, callBack);
        }else if(findByFields && findByTeam){
            dbEngine.queryTable.find({ $and: [{$or: nameFields}, {$or: nameTeams}] }, callBack);
        }
    }
	
	dbEngine.findOne = function(exp, callBack){
		dbEngine.queryTable.find(exp, callBack);
	}
	
	
	dbEngine.findById = function(id, callBack){
	
	    dbEngine.queryTable.findById(id, callBack);
	
	}
	
	dbEngine.findByIdAndRemove = function(id, callBack){
		 dbEngine.queryTable.findByIdAndRemove(id, {}, callBack);
	}
	
	return dbEngine;
	
}();






