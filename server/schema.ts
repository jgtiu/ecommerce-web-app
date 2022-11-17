import mongoose from 'mongoose';
import {userSchema} from './schema/user';


async function main() {
  await mongoose.connect('mongodb://localhost:27017/webappfinalproj');
  const User = mongoose.model('User', userSchema);
  console.log("success")
}

main().catch(err => console.log(err));
