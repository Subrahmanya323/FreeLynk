const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  proposal: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  estimatedDays: {
    type: Number,
    required: true,
    min: 1,
    max: 365
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Ensure one bid per freelancer per project
bidSchema.index({ project: 1, freelancer: 1 }, { unique: true });

// Index for better query performance
bidSchema.index({ freelancer: 1, status: 1 });
bidSchema.index({ project: 1, status: 1 });
bidSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Bid', bidSchema); 