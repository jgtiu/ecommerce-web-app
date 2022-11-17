import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import mongoose from 'mongoose';
const { Schema } = mongoose;

import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { DraftOrder, Order, possibleIngredients } from './data'

// set up Mongo
const url = 'mongodb://127.0.0.1:27017/webappfinalproj'
mongoose.connect(url)

// set up Express
const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// app routes
app.get("/api/possible-ingredients", async (req, res) => {
  const data = await possibleIngredients
  res.status(200).json(data)
})

app.get("/api/orders", async (req, res) => {
})

app.get("/api/customer/:customerId", async (req, res) => {
  const _id = req.params.customerId
})

app.get("/api/operator/:operatorId", async (req, res) => {
  const _id = req.params.operatorId
})

app.get("/api/customer/:customerId/draft-order", async (req, res) => {
  const { customerId } = req.params

  // TODO: validate customerId

})

app.put("/api/customer/:customerId/draft-order", async (req, res) => {
})

app.post("/api/customer/:customerId/submit-draft-order", async (req, res) => {
})

app.put("/api/order/:orderId", async (req, res) => {
})

