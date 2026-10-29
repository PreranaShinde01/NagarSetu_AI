import mongoose from 'mongoose';

const escalationSchema = new mongoose.Schema(
  {
    escalationId: {
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
    wardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ward',
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    level: {
      type: Number,
      default: 1, // 1: Supervisor, 2: Department Officer, 3: Controller, 4: Senior Authority
    },
    reason: {
      type: String,
      required: true,
    },
    trigger: {
      type: String,
      enum: [
        'SLA_BREACH',
        'WORKER_REJECTION',
        'VERIFICATION_REJECTED',
        'REPEATED_REOPEN',
        'HIGH_CITIZEN_IMPACT',
        'MANUAL_OVERRIDE',
      ],
      default: 'SLA_BREACH',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'RESOLVED', 'REASSIGNED'],
      default: 'ACTIVE',
      index: true,
    },
    escalatedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionNotes: String,
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

escalationSchema.index({ municipalityId: 1, status: 1 });

export default mongoose.model('Escalation', escalationSchema);
