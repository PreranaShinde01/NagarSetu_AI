import mongoose from 'mongoose';

const complaintCategorySchema = new mongoose.Schema(
  {
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      default: 'INFRASTRUCTURE',
    },
    subcategory: {
      type: String,
    },
    defaultDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    defaultSlaHours: {
      type: Number,
      default: 24,
    },
    priority: {
      type: String,
      enum: ['P1', 'P2', 'P3', 'P4'],
      default: 'P2',
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

export default mongoose.model('ComplaintCategory', complaintCategorySchema);
