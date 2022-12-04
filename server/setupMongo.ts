import { MongoClient, ObjectId } from 'mongodb'
import { Buyer, Seller } from './data'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // set up unique index for upsert -- to make sure a seller cannot have more than one draft product
  db.collection("products").createIndex(
    { sellerId: 1 }, 
    { unique: true, partialFilterExpression: { state: "draft" } }
  )

  // TODO: Find how to add buyers and sellers as different user types

  process.exit(0)
}

main()
