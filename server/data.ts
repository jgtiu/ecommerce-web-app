import { MongoClient, ObjectId } from 'mongodb'

export interface Ingredient {
  _id: string
  name: string
  price: number
}

export interface DraftOrder {
  customerId: string
  ingredientIds: string[]
}

export interface Order extends DraftOrder {
  _id: string
  state: "draft" | "queued" | "blending" | "done"
  operatorId?: string
}

export interface Customer {
  _id: string
  name: string
}

export interface CustomerWithOrders extends Customer {
  orders: Order[]
}

export interface Operator {
  _id: string
  name: string
}

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

async function getPossibleIngredients() {
    await client.connect()
    console.log('Connected successfully to MongoDB')
    const db = client.db("test")
    const data = await db.collection("possibleIngredients").find().toArray()
    return data
}
export const possibleIngredients = getPossibleIngredients()
