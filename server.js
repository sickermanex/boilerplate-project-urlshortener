'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var dns = require('dns');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var urlSchema = new Schema({
  url: "String", 
  code: "Number"
});
var Url = mongoose.model('Url',urlSchema);


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", function(req,res){
  var url = req.body.url;
  var options = {
    all: true,
  }
  dns.lookup(url.split('//')[1], options, function(err, addr, fam){
    if(err === null){
      var newUrl = new Url({
        url: 'www.testurl.com',
        code: -1
      });
      newUrl.save().then(function(err, url){
        if(err){
          res.json(err);
        } else{
          var response = {
            original_url: url.url,
            short_url: url._id
          }
          res.json(response);
        }
      });
    } else{
      res.json({ error: "Invalid URL" })
    }
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});