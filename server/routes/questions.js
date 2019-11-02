var express = require('express');
var router = express.Router();
var Question = require('../models/question');

/* GET all */
router.get('/', function(req, res, next) {
    Question.find({}, function(err, questions) {
        if (err) console.log(err);
        res.json(questions);
    });
});

/* POST question */
router.post('/', function(req, res, next) {
    var question = new Question();
    question.question = req.body.question; //'Whats your favorite programming language?'
    question.choices = req.body.choices; // ['JS', 'Java', 'Kotlin'];

    question.save().then((err) => {
        if (err) throw err;
        console.log('Question created!');
    });

    res.send('Question created!');

});

module.exports = router;
