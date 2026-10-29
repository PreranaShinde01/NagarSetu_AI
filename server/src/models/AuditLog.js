import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    actorRole: {
      type: String,
      required: true,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality',
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    requestId: {
      type: String,
    },
  },
  {
    timestamps: false, // Explicit timestamp field used
  }
);

// Read-only safeguards: throw error if update or remove attempted
auditLogSchema.pre('updateOne', function () {
  throw new Error('AuditLog records are immutable and cannot be updated.');
});
auditLogSchema.pre('deleteOne', function () {
  throw new Error('AuditLog records are immutable and cannot be deleted.');
});

export default mongoose.model('AuditLog', auditLogSchema);
