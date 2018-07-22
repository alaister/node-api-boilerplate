import mongoose, { Schema } from 'mongoose'

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    refreshToken: {
      type: String,
      required: [true, 'Refresh token is required'],
    },
    jwtIds: {
      type: [String],
      required: [true, 'JWT IDs are required'],
      default: [],
    },
    createdAt: {
      type: Date,
      expires: 1210000, // 14 Days = 1210000 Seconds
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => {
        let t = new Date()
        t.setSeconds(t.getSeconds() + 1210000)
        return t
      },
    },
  },
  { timestamps: false }
)

export default mongoose.model('Session', sessionSchema)
