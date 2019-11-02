var express = require('express');
var router = express.Router();
var Answer = require('../models/answer');

/* GET all */
router.get('/', function(req, res, next) {
    Answer.find({}, function(err, answers) {
        if (err) console.log(err);
        res.json(answers);
    });
});

/* Get by userId */
router.get('/user/:userId', function(req, res, next) {
    Answer.find({ userId: req.params.userId}, function(err, answers) {
        if (err) console.log(err);
        res.json(answers);
    });
});

/* Get by questionId */
router.get('/question/:questionId', function(req, res, next) {
    Answer.find({ questionId: req.params.questionId}, function(err, answers) {
        if (err) console.log(err);
        res.json(answers);
    });
});

/* POST answer */
router.post('/', function(req, res, next) {
    var answer = new Answer();
    answer.answer = req.body.answer;
    answer.questionId = req.body.questionId;
    answer.userId = req.body.userId;

    answer.save().then((err) => {
        if (err) throw err;
        console.log('Answer submitted!');
    });

    res.send('Answer submitted!');

});

module.exports = router;
