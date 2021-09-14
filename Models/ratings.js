const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movies'
  },
  user_email: {
    type : String
  },
  max_rating : {
      type : Number,
      default : 5
  },
  rating_obtained : {
      type : Number
  },
  comment : {
      type : String
  },
  created_on : {
      type : Date,
      default: Date.now()
  }
});

module.exports = mongoose.model('Rating', RatingSchema);