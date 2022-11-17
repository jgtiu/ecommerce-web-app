import mongoose from 'mongoose';
const { Schema } = mongoose;

export const orderSchema = new Schema({
    _id: String,
    buyer_id: String,
    quantity: Number,
    seller_id: String,
    product_id: String,
    status: String,
    complete: Boolean
});
