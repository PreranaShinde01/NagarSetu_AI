import mongoose from 'mongoose';

const workOrderSchema = new mongoose.Schema(
  {
    workOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality',
      required: true,
      index: true,
    },
    wardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ward',
      required: true,
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true,
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    assignedWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    assignedTeam: {
      type: String,
      default: 'Field Maintenance Team A',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['P1', 'P2', 'P3', 'P4'],
      default: 'P2',
    },
    status: {
      type: String,
      enum: [
        'CREATED',
        'ASSIGNED',
        'ACCEPTED',
        'IN_PROGRESS',
        'PAUSED',
        'COMPLETED',
        'VERIFICATION_PENDING',
        'VERIFIED',
        'REJECTED',
        'CANCELLED',
      ],
      default: 'CREATED',
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    dueAt: Date,
    completionNotes: String,
    completionEvidence: {
      beforeImages: [String],
      afterImages: [String],
      videoUrl: String,
      notes: String,
      gpsVerified: { type: Boolean, default: true },
      location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
      },
      completedAt: Date,
    },
    verificationStatus: {
      type: String,
      enum: [
        'NONE',
        'PENDING_SUPERVISOR',
        'SUPERVISOR_APPROVED',
        'SUPERVISOR_REJECTED',
        'PENDING_CITIZEN',
        'CITIZEN_APPROVED',
        'CITIZEN_REJECTED',
      ],
      default: 'NONE',
    },
    reworkReason: String,
    isDemoRecord: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

workOrderSchema.index({ municipalityId: 1, departmentId: 1, status: 1 });
workOrderSchema.index({ assignedWorkerId: 1, status: 1 });

export default mongoose.model('WorkOrder', workOrderSchema);
