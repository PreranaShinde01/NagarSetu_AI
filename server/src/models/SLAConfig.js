import mongoose from 'mongoose';

const slaConfigSchema = new mongoose.Schema(
  {
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality',
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ComplaintCategory',
    },
    priority: {
      type: String,
      enum: ['P1', 'P2', 'P3', 'P4'],
      required: true,
    },
    slaHours: {
      type: Number,
      required: true,
    },
    escalationEnabled: {
      type: Boolean,
      default: true,
    },
    escalationHours: {
      type: Number,
      default: 4,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('SLAConfig', slaConfigSchema);
