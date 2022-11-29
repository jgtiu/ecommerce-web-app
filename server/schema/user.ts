import mongoose from 'mongoose';
const { Schema } = mongoose;
const bcrypt = require("bcryptjs")

export const userSchema = new Schema({
  _id:  String, // String is shorthand for {type: String}
  username: String,
  name:   String,
  email: String,
  password: String,
  balance: Number
});

userSchema.pre("save", function (next) {
  const user = this

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError: NativeError, salt: string) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function(hashError: NativeError, hash: string) {
          if (hashError) {
            return next(hashError)
          }

          user.password = hash
          next()
        })
      }
    })
  } else {
    return next()
  }
})

userSchema.methods.comparePassword = function(password: string, callback:(error: Boolean, success: Boolean) => void) {
  bcrypt.compare(password, this.password, function(error: Boolean, isMatch: Boolean) {
    if (error) {
      return callback(error, false)
    } else {
      callback(null, isMatch)
    }
  })
}

export const UserModel = mongoose.model('UserModel', userSchema);

export const sellerSchema = new Schema({
    user_id: String
});

export const cartSchema = new Schema({
    _id: String,
    buyer_id: String,
    seller_id: String,
    quantity: Number,
    status: String
});

export const inventorySchema = new Schema({
    _id: String,
    seller_id: String,
    product_id: String,
    price: Number,
    quantity: Number
});

