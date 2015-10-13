var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test',function(err){
  if(err){
    console.log('Counld not connect to mongodb on localhost');
  }else{
    console.log('Successfully connected to mongodb');
  }
});

var people = mongoose.model('people',{
  firstName:String,
  lastName:String,
  username:String,
  birthday:String,
  bio:String,
  interests:String
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user',function(req,res){
  var person = new people(req.body);
  person.save(function(err,response){
    if(err){
      console.log(err);
    }else{
      res.status(200).json(response);
    }
  });

});

router.patch('/user/:id',function(req,res){
  people.findByIdAndUpdate(req.params.id,{$set:{bio:req.body.bio,interests:req.body.interests}},function(err,response){
    if (err) {
      res.status(500).json({ message: 'Something Broke!' });
    } else {
      res.status(200).json(response);
    }
  });
});

module.exports = router;
