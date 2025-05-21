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

// Safer model initialization pattern to avoid 'Cannot read properties of undefined' errors
let ReportModel: mongoose.Model<any>;

try {
  // Check if the model is already registered
  ReportModel = mongoose.model('Report');
} catch (error) {
  // If not, create a new model
  ReportModel = mongoose.model('Report', reportSchema);
}

export const Report = ReportModel;
