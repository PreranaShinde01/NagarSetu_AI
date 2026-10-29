import mongoose from 'mongoose';

const administrativeUnitSchema = new mongoose.Schema(
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
    code: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['ZONE', 'DIVISION', 'SECTOR', 'AREA'],
      default: 'ZONE',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AdministrativeUnit', administrativeUnitSchema);
