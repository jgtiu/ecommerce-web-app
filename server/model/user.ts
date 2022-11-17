import mongoose from 'mongoose';
const { Schema } = mongoose;
import {userSchema} from '../schema/user';

const UserModel = mongoose.model('UserModel', userSchema);
 
export function loginUser(username: string, password: string, callback: (error: Boolean, success: Boolean) => void) {
    UserModel.findOne({username: username}, function(error: any, user: any) {
      if (error) {
        callback(true, false)
      } else if (!user) {
        callback(true, false)
      } else {
        user.comparePassword(password, function(matchError: Boolean, isMatch: Boolean) {
          if (matchError) {
            callback(true, false)
          } else if (!isMatch) {
            callback(true, false)
          } else {
            callback(false, true)
          }
        })
      }
    })
}
