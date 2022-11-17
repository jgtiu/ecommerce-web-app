import { MongoClient, ObjectId } from 'mongodb'
import { Operator, Customer, Ingredient } from './data'
import {UserModel, userSchema} from "./schema/user";
import mongoose from 'mongoose';


async function main() {
    const url = 'mongodb://127.0.0.1:27017/webappfinalproj'
    mongoose.connect(url)
    UserModel.create({_id: new mongoose.Types.ObjectId(), username: "test1", name: "test1", password: "123456", email: "test1@test.com", balance: 0});
    UserModel.create({_id: new mongoose.Types.ObjectId(), username: "test2", name: "test2", password: "123456", email: "test2@test.com", balance: 0});
    console.log("Database Setup Completed")
    process.exit(0)
}

main()
