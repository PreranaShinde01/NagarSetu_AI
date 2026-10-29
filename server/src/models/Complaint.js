import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality',
      required: true,
      index: true,
    },
    administrativeUnitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdministrativeUnit',
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      area: {
        type: String,
      },
    },
    priority: {
      type: String,
      enum: ['P1', 'P2', 'P3', 'P4'],
      default: 'P2',
      index: true,
    },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'HIGH',
    },
    status: {
      type: String,
      enum: [
        'SUBMITTED',
        'AI_ANALYSIS',
        'ROUTED',
        'ASSIGNED',
        'ACCEPTED',
        'IN_PROGRESS',
        'AWAITING_VERIFICATION',
        'SUPERVISOR_VERIFICATION',
        'CITIZEN_VERIFICATION',
        'AWAITING_CITIZEN_VERIFICATION',
        'RESOLVED',
        'REOPENED',
        'ESCALATED',
        'REASSIGNED',
        'CLOSED',
        'REJECTED',
      ],
      default: 'SUBMITTED',
      index: true,
    },
    statusHistory: [
      {
        status: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    aiAnalysis: {
      classification: String,
      confidence: Number,
      severity: String,
      priority: String,
      reasons: [String],
      recommendedWard: String,
      recommendedDepartment: String,
      recommendedSupervisor: String,
      recommendedWorker: String,
      disclaimer: {
        type: String,
        default: 'AI-generated recommendation. Final action remains with authorized personnel.',
      },
    },
    media: {
      images: [String],
      videos: [String],
    },
    sla: {
      targetHours: { type: Number, default: 24 },
      deadline: { type: Date },
      state: {
        type: String,
        enum: ['NORMAL', 'ON_TRACK', 'DUE_SOON', 'AT_RISK', 'CRITICAL', 'OVERDUE', 'BREACHED'],
        default: 'NORMAL',
      },
    },
    assignedToUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    workOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkOrder',
    },
    isDemoRecord: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
complaintSchema.index({ location: '2dsphere' });
complaintSchema.index({ municipalityId: 1, wardId: 1, status: 1 });
complaintSchema.index({ municipalityId: 1, departmentId: 1, status: 1 });
complaintSchema.index({ createdAt: -1 });

export default mongoose.model('Complaint', complaintSchema);
