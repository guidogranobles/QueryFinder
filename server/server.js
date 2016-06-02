var process = require('process');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./bd-engine.js');

var expServer = express();
var PORT = process.env.PORT || 3000;

var onConDbError = function(){
	throw new Error('Unable to start MongoDB: connection error');
}

var onConDbSucess = function(){
	console.log('connected to mongoDB');   
	expServer.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	}).on('error', function(err){
		throw new Error('Unable to start Express server: ' + err);
	});
}

var errorHandler = function(err, req, res, next) {
    var code = err.code;
    var message = err.message;
    res.writeHead(code, message, {'content-type' : 'text/plain'});
    res.end(message);
}

db.initDB(onConDbError, onConDbSucess);
console.log('Root directory: ' + process.cwd() + '\\app');
expServer.use(express.static(process.cwd() + '\\app'));
expServer.use(bodyParser.json());
expServer.use(errorHandler);



expServer.get('/qfinder', function(req, res) {
	res.send('App Root');
});

expServer.get('/qfinder/all', function(req, res) {

	  var getResults = function(err, result){
		if (err)
          return  res.status(500).json({"error":  err});

         return res.json(result);
	  }

	  db.findAll(getResults);
	  
});

expServer.get('/qfinder/description/:desc', function(req, res) {

    var getResults = function(err, result){
        if (err)
            return res.status(400).json({"error":  err});

        return res.json(result);
    }


    if(typeof req.params.desc !== 'string' || req.params.desc.length === 0 || req.params.desc==='undefined'){
          return res.status(500).json({
              "error": "The server did not get any expression value to search for."
          });
	  }
	  
	  var descriptQuery = req.params.desc;

	  console.log('find by Description: ' + descriptQuery);


	  db.findOne({description: new RegExp(descriptQuery, 'i')}, getResults);
	  
});

expServer.get('/qfinder/query/:term', function(req, res) {

    var getResults = function(err, result){
        if (err)
            return  res.status(500).json({"error":  err});

        return res.json(result);
    }

    if(!req.params.term || typeof req.params.term !== 'string' || req.params.term.length === 0){
        return res.status(500).json({
            "error": "The server did not get any expression value to search for."
        });
    }
	  
	var term = req.params.term;

	console.log('find by Query: ' + term);


	db.findOne({query: new RegExp(term, 'i')}, getResults);
	  
});

expServer.get('/qfinder/tags/:tagstr', function(req, res) {

    var getResults = function(err, result){
        if (err)
            return res.status(500).json({"error":  err});

        return res.json(result);
    }

    db.findOne({tags: new RegExp(term, 'i')}, getResults);


    if(!req.params.tagstr || typeof req.params.tagstr !== 'string' || req.params.tagstr.length === 0){
        return res.status(500).json({
            "error": "The server did not get any tags to search for."
        });
    }

    var term = req.params.tagstr;

	console.log('find by tags: ' + term);

});

expServer.get('/qfinder/author/:auth', function(req, res) {

    var getResults = function(err, result){
        if (err)
            return res.status(500).json({"error":  err});

        return res.json(result);
    }

    if(!req.params.auth || typeof req.params.auth !== 'string' || req.params.auth.length === 0){
        return res.status(500).json({
            "error": "The server did not get any author to search for."
        });
    }

    var auth = req.params.auth;

    console.log('find by auth: ' + auth);


    db.findOne({author: new RegExp(auth, 'i')}, getResults);

});

expServer.get('/qfinder/filter/teams', function(req, res) {

    var searchParams = _.pick(req.query, 'teams');

    if(searchParams.teams && typeof searchParams.teams === 'string' && searchParams.teams.length > 0){
        searchParams.teams = searchParams.teams.split(",");
    }else{
        searchParams.teams = null;
    }

    if(!searchParams.fields && searchParams.teams){
        res.status(500).json({
            "error": "The server did not get any team filtered. It mas be a least one filter."
        });
    }

    console.log('find by filter: ' +searchParams.teams);


    db.findByTeams(searchParams.term, searchParams.teams, getResults);

});


expServer.get('/qfinder/filter', function(req, res) {

    var getResults = function(err, result){
        if (err)
            return res.status(500).json({"error":  err});

        return res.json(result);
    }

    var searchParams = _.pick(req.query, 'term', 'fields','teams');

    if(searchParams.fields && typeof searchParams.fields === 'string' && searchParams.fields.length > 0){
        searchParams.fields = searchParams.fields.split(",");
    }else{
        searchParams.fields = null;
    }

    if(searchParams.teams && typeof searchParams.teams === 'string' && searchParams.teams.length > 0){
        searchParams.teams = searchParams.teams.split(",");
    }else{
        searchParams.teams = null;
    }

    if(!searchParams.fields && searchParams.teams){
        res.status(500).json({
            "error": "The server did not get any filter. It mas be a least one filter."
        });
    }

    if(!searchParams.term || typeof searchParams.term !=='string' || searchParams.term.length === 0){
        res.status(500).json({
            "error": "The server did not get any expression to search for."
        });
    }

    console.log('find by filter: ' +searchParams.fields);


    db.findByFilters(searchParams.term, searchParams.fields, searchParams.teams, getResults);

});

expServer.post('/qfinder/create', function(req, res) {
  
	var body = _.pick(req.body, 'description', 'query', 'team', 'author', 'version', 'creationDate', 'tags');
    console.log(body);
    var missingParams = [];

    if(!body.description || typeof body.description !== 'string' || body.description.length === 0){
        missingParams.push('description');
    }
    if(!body.query || typeof body.query !== 'string' || body.query.length === 0){
        missingParams.push('query');
    }
    if(!body.team || typeof body.team !== 'string' || body.team.length === 0){
        missingParams.push('description');
    }
    if(!body.author || typeof body.author !== 'string' || body.author.length === 0){
        missingParams.push('author');
    }

    if(missingParams.length > 0){
        res.status(500).json({
            "error": "The server did not get any these parameters: [ " + missingParams + " ]"});
    }

	var prepareRecord = {
		   id: 0,
		   description: body.description,
		   query: body.query,
           team: body.team,
           author: body.author,
           version: body.version ? body.version: null,
           creationDate: body.creationDate ? body.creationDate : new Date(),
		   tags: body.tags ? body.tags: []
	};
	
	var newRecord = db.insertRecord(prepareRecord);
	
	newRecord.save(function (err, newRecord) {
		if (err){
            return res.status(500).json({"error":  err});
		}else{
			console.log('saved successfully');			
			return res.json(newRecord);
		}
	});


});

expServer.put('/qfinder/update', function(req, res) {
 
	var body = _.pick(req.body, '_id', 'description', 'query','team', 'author', 'version', 'creationDate', 'tags');
    var missingParams = [];

    if(!body.description || typeof body.description !== 'string' || body.description.length === 0){
        missingParams.push('description');
    }
    if(!body.query || typeof body.query !== 'string' || body.query.length === 0){
        missingParams.push('query');
    }
    if(!body.team || typeof body.team !== 'string' || body.team.length === 0){
        missingParams.push('team');
    }
    if(!body.author || typeof body.author !== 'string' || body.author.length === 0){
        missingParams.push('author');
    }

    if(missingParams.length > 0){
        res.status(500).json({
            "error": "The server did not find any of these parameters in the request: [ " + missingParams + " ]"
        });
    }

	var getResults = function(err, query){
		if (err)
            return res.status(500).json({"error":  err});

        console.log(body);
		query.description = body.description;
		query.query = body.query;
        query.team = body.team;
        query.author = body.author;
        query.version =  body.version;
        query.creationDate = body.creationDate;
		query.tags = body.tags;
						
		query.save(function (err, query) {
			if (err){
                return res.status(500).json({"error":  err});
		    }else{
		 	    console.log('find by id: ' + query.query);
						console.log('saved successfully');												
						return res.json(query);
			}
		});
	  }

	  db.findById(body._id, getResults);
		
});

expServer.delete('/qfinder/delete/:id', function(req, res) {
 
	var id = req.params.id;
		  
	var result = {};
	console.log('find by id: ' + id);
	var getResults = function(err, result){
		if (err)
            return res.status(500).json({"error":  err});

         return res.json(result);
	}

	db.findByIdAndRemove(id, getResults);
		
});







