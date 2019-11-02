var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET matched users. */
router.get('/matched/:facebookId', function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) console.log(err);
    res.json(users.filter(e => e.facebookId !== req.params.userId).slice(0,2)); // dumb logic to give top 3 users
  });
});

/* PUT user */
router.put('/:facebookId', function(req, res, next) {
  if (!req.body.data) {
    res.send('NOOP: Update data not received!');
  }

  else {
    User.findOne({ facebookId: req.params.facebookId}, function(err, user) {
      if (err) console.log(err);
      user.data = req.body.data;
      user.save().then((err) => {
        if (err) throw err;
        console.log('User updated!');
      }); 
    });
  }

  res.send('User updated!');
});

/* POST user */
router.post('/', function(req, res, next) {
  var user = new User();
  user.data = req.body.data;
  user.facebookId = req.body.facebookId; // '115925323175201';

  user.save().then((err) => {
      if (err) throw err;
      console.log('User created!');
  });

  res.send('User created!');

});

module.exports = router;
