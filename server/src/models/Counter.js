import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      default: 'complaint',
    },
    year: {
      type: Number,
      required: true,
      default: new Date().getFullYear(),
    },
    sequence: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

counterSchema.index({ key: 1, year: 1 }, { unique: true });

export default mongoose.model('Counter', counterSchema);
