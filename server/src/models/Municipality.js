import mongoose from 'mongoose';

const municipalitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Municipality name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Municipality code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: 'Maharashtra',
    },
    country: {
      type: String,
      default: 'India',
    },
    centerCoordinates: {
      type: [Number], // [latitude, longitude]
      default: [18.5204, 73.8567],
    },
    zoomLevel: {
      type: Number,
      default: 12,
    },
    adminStructureType: {
      type: String,
      enum: ['ZONE_WARD_HIERARCHY', 'DIV_WARD_HIERARCHY', 'WARD_DIRECT_HIERARCHY', 'PRABHAG_WARD_HIERARCHY'],
      default: 'ZONE_WARD_HIERARCHY',
    },
    tagline: {
      type: String,
      default: 'Smart City Operations Hub',
    },
    officeAddress: {
      type: String,
      trim: true,
    },
    totalAreaSqKm: {
      type: Number,
    },
    totalWardsCount: {
      type: Number,
    },
    totalPrabhagsCount: {
      type: Number,
    },
    isDemo: {
      type: Boolean,
      default: true,
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

export default mongoose.model('Municipality', municipalitySchema);
