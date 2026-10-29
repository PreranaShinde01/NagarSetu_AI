import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      required: [true, 'User role is required'],
      enum: [
        'CITIZEN',
        'NAGARSETU_CONTROLLER',
        'MUNICIPAL_OFFICER',
        'WARD_MEMBER',
        'WARD_OFFICER',
        'WARD_AUTHORITY',
        'DEPARTMENT_OFFICER',
        'DEPARTMENT_SUPERVISOR',
        'MUNICIPAL_WORKER',
        'SENIOR_AUTHORITY',
        'CITY_ADMIN',
        'SUPER_ADMIN',
        'POLICE_EMERGENCY_USER',
      ],
      default: 'CITIZEN',
      index: true,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality',
      index: true,
    },
    administrativeUnitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdministrativeUnit',
    },
    wardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ward',
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to compare entered password with bcrypt hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Static helper to hash passwords
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

export default mongoose.model('User', userSchema);
