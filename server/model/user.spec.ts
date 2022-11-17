import {UserModel, userSchema} from "../schema/user";
import {loginUser} from "./user";
import mongoose from 'mongoose';
const { Schema } = mongoose;

const url = 'mongodb://127.0.0.1:27017/webappfinalproj'
mongoose.connect(url)

UserModel.create({_id: new mongoose.Types.ObjectId(), username: "Zhe", name: "Zhe", password: "123456", email: "test@test.com", balance: 10});


loginUser("Zhe", "123456", function(error: Boolean, success: Boolean) {
    if (success) {
        console.log("successfully login!")
    }
    else {
        console.log("login failed!")
    }
});
