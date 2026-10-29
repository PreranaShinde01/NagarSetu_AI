import mongoose from 'mongoose';

const slaEventSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    workOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkOrder',
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality',
      required: true,
      index: true,
    },
    event: {
      type: String,
      enum: ['SLA_WARNING', 'SLA_BREACH'],
      required: true,
    },
    targetHours: {
      type: Number,
      default: 24,
    },
    elapsedMinutes: {
      type: Number,
      default: 0,
    },
    remainingMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['NORMAL', 'AT_RISK', 'CRITICAL', 'BREACHED'],
      required: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

slaEventSchema.index({ municipalityId: 1, createdAt: -1 });

export default mongoose.model('SLAEvent', slaEventSchema);
