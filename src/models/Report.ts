import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listingOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['PENDING', 'RESOLVED', 'REJECTED', 'WARNED', 'ACTIONED'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
