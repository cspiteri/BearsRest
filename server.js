
// packages 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Bear = require('./models/bear');
var mongoose = require('mongoose'); 

// configure db
mongoose.connect('mongodb://mamabear:Password123!@ds055842.mongolab.com:55842/bearsdb');

// configure bodyParser() to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ====================

// routes

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); //  go to the next routes
});              

// test route 
// GET http://localhost:8080/api
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// ====================
// more routes 

// ----------------------------------------------------
// routes for /api/bears
// ----------------------------------------------------
router.route('/bears')

    // POST /api/bears
    // create a bear
    .post(function(req, res) {        
        var bear = new Bear();      // create a new instance 
        bear.name = req.body.name;  // set name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
            if (err) {
                res.send(err);
            }
            else {
                res.json({ message: 'Bear created!' });    
            }
        });        
    })
    
    // GET /api/bears
    // get all the bears
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err) {
                res.send(err);
            }
            else {
                res.json(bears);    
            }            
        });
    });    

// ----------------------------------------------------
// routes for /api/bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

    // GET /api/bears/:bear_id
    // get bear with given id
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) {
                res.send(err);
            }
            else {
                res.json(bear);
            }
        });
    })

    // PUT /api/bears/:bear_id
    // update bear
    .put(function(req, res) {
        // find bear
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) {
                res.send(err);
            }
            else {
                // get name from BODY, update instance and save
                bear.name = req.body.name; 
                bear.save(function(err) {
                    if (err) {
                        res.send(err);                        
                    }
                    else {
                        res.json({ message: 'Bear updated!' });
                    }
                });
            }
        });
    })
    
    // DELETE /api/bears/:bear_id
    .delete(function(req,res) {
       Bear.remove({
           _id: req.params.bear_id
       }, function(err, bear) {
          if (err) {
              res.send(err);
          } 
          else {
              res.json({ message: 'Successfully deleted' });
          }
       }); 
    });
    
// ====================

// register routes; all of our routes will be prefixed with /api
app.use('/api', router);

// ====================
// start server
app.listen(port);
console.log('Magic happens on port ' + port);