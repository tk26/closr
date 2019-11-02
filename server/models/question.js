var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
  question: String,
  choices: [{ type: String }]
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;