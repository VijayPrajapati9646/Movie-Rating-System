const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  name: {
      type : String,
  },
  description: {
      type : String
  },
});

module.exports = mongoose.model('Movies', MovieSchema);