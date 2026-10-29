import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema(
  {
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      trim: true,
    },
    officerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    centerCoordinates: {
      type: [Number], // [lat, lng]
    },
    population: {
      type: Number,
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

wardSchema.index({ municipalityId: 1, number: 1 }, { unique: true });

export default mongoose.model('Ward', wardSchema);
