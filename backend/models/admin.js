const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
},  { timestamps: true, collection: 'admins' }); // Ensure the collection name is 'admins'

module.exports = mongoose.model('Admin', adminSchema); // This should match 'Admin'
