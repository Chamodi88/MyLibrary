const mongoose = require('mongoose');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: ROLE.BASIC 
  }
});

module.exports = mongoose.model('User', UserSchema);