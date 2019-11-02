var mentors = require('../models/mentors');

const getMatch = (userId) => {
    var matched = new Set();
    for (var i=0; i<mentors.length; i++) {
        if (userId in mentors[i].matchedWith) {
            matched.add(mentors[i].userId);
        }
    }
    return matched;
};

module.exports = getMatch;