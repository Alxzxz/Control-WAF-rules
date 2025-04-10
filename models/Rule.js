const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ruleId: { type: String, required: true, unique: true },
  description: String,
  active: { 
    type: String, 
    enum: ['active', 'inactive', 'testing', 'disabled', 'pending'],
    default: 'inactive' 
  },
  sensibility: { type: Number, required: true, min: 1, max: 10 },
  group: String,
  comments: [{
    text: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Rule', ruleSchema);
