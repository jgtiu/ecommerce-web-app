import mongoose from 'mongoose';
const { Schema } = mongoose;


export const productSchema = new Schema({
    _id: String,
    name: String,
    description: String,
    iamge: String,
    category: Number
});

export const categorySchema = new Schema({
    _id: String,
    name: String
});

export const tagSchema = new Schema({
    _id: String,
    name: String,
    description: String
});

export const productTagSchema = new Schema({
    _id: String,
    product_id: String,
    tag_id: String
});
