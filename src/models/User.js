import mongoose, { Schema } from 'mongoose'
import isemail from 'isemail'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email is required'],
      validate: {
        validator: isemail.validate,
        message: 'Email address is invalid',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be a least 8 characters long'],
    },
  },
  { timestamps: true }
)

userSchema.pre('save', function(next) {
  const user = this

  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.hash(user.password, 13, (err, hash) => {
    if (err) {
      return next(err)
    }

    user.password = hash
    return next()
  })
})

userSchema.post('save', function(error, _doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      message: 'Email address already in use',
      field: ['email'],
    })
  } else {
    next(error)
  }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
