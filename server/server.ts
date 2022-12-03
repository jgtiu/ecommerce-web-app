import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { DraftProduct, Order, Product } from './data'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Issuer, Strategy } from 'openid-client'
import passport from 'passport'
import { keycloak } from "./secrets"

if (process.env.PROXY_KEYCLOAK_TO_LOCALHOST) {
  // NOTE: this is a hack to allow Keycloak to run from the 
  // same development machine as the rest of the app. We have exposed
  // Keycloak to run off port 8081 of localhost, where localhost is the
  // localhost of the underlying laptop, but localhost inside of the
  // server's Docker container is just the container, not the laptop.
  // The following line creates a reverse proxy to the Keycloak Docker
  // container so that localhost:8081 can also be used to access Keycloak.
  require("http-proxy").createProxyServer({ target: "http://keycloak:8080" }).listen(8081)
}

// set up Mongo
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(mongoUrl)
let db: Db
let buyers: Collection
let sellers: Collection
let products: Collection
let orders: Collection

// set up Express
const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// set up session
app.use(session({
  secret: 'a just so-so secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },

  // comment out the following to default to a memory-based store, which,
  // of course, will not persist across load balanced servers
  // or survive a restart of the server
  store: MongoStore.create({
    mongoUrl,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done: any) => {
  logger.info("serializeUser " + JSON.stringify(user))
  done(null, user)
})
passport.deserializeUser((user: any, done: any) => {
  logger.info("deserializeUser " + JSON.stringify(user))
  done(null, user)
})

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401)
    return
  }

  next()
}

// app routes
app.post(
  "/api/logout", 
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      res.redirect("/")
    })
  }
)

app.get("/api/products", async (req, res) => {
  // returns all products and product info
  // primarily for admin page
  res.status(200).json(await products.find({ state: { $ne: "draft" } }).toArray())
})

app.get("/api/user", (req, res) => { // UNDER CONSTRUCTION: DO NOT USE
  // user profile
  res.json(req.user || {})
})

app.get("/api/product/:productId", checkAuthenticated, async (req, res) => {
  // for product detail page
  const _id = req.params.productId
  const product = await products.findOne({ _id })
  if (product == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(product)
})

app.get("/buyer/:buyerId", checkAuthenticated, async (req, res) => { // UNDER CONSTRUCTION: DO NOT USE
  const _id = req.params.buyerId
  logger.info("/buyer/" + _id)
  const buyer = await buyers.findOne({ _id })
  if (buyer == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(buyer)
})

app.get("/api/operator", checkAuthenticated, async (req, res) => { // UNDER CONSTRUCTION: DO NOT USE
  const _id = req.user.preferred_username
  const operator = await operators.findOne({ _id })
  if (operator == null) {
    res.status(404).json({ _id })
    return
  }
  operator.orders = await orders.find({ operatorId: _id }).toArray()
  res.status(200).json(operator)
})

app.get("/api/seller/:sellerId/draft-product", async (req, res) => {
  const { sellerId } = req.params

  // TODO: validate customerId

  const draftProduct = await products.findOne({ state: "draft", sellerId })
  res.status(200).json(draftProduct || { name: "", description: "", price: 0, allowReturns: false, sellerId })
})

app.put("/api/seller/:sellerId/draft-product", checkAuthenticated, async (req, res) => {
  const product: DraftProduct = req.body

  // TODO: validate customerId

  const result = await products.updateOne(
    {
      sellerId: req.params.sellerId,
      state: "draft",
    },
    {
      $set: {
        name: product.name,
        description: product.description,
        price: product.price,
        allowReturns: product.allowReturns,
        sellerId: req.params.sellerId
      }
    },
    {
      upsert: true
    }
  )
  res.status(200).json({ status: "ok" })
})

app.post("/api/seller/:sellerId/submit-draft-order", async (req, res) => {
  const result = await products.updateOne(
    {
      sellerId: req.params.sellerId,
      state: "draft",
    },
    {
      $set: {
        state: "submitted",
      }
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "no draft product" })
    return
  }
  res.status(200).json({ status: "ok" })
})

app.post("/api/buyer/:buyerId/purchase", async (req, res) => {
  const product: Product = req.body

  const result = await orders.insertOne( // If we implement cart, we need to change this to updateOne
    {
      productName: product.name,
      productPrice: product.price,
      productAllowReturns: product.allowReturns,
      sellerId: product.sellerId,
      productId: product._id,
      buyerId: req.params.buyerId,
      state: "purchased",
    }
  )
  res.status(200).json({ status: "ok" })
})

app.put("/api/order/:orderId", checkAuthenticated, async (req, res) => { // UNDER CONSTRUCTION: DO NOT USE
  const order: Order = req.body

  // TODO: validate order object

  const condition: any = {
    _id: new ObjectId(req.params.orderId),
    state: { 
      $in: [
        // because PUT is idempotent, ok to call PUT twice in a row with the existing state
        order.state
      ]
    },
  }
  switch (order.state) {
    case "blending":
      condition.state.$in.push("queued")
      // can only go to blending state if no operator assigned (or is the current user, due to idempotency)
      condition.$or = [{ operatorId: { $exists: false }}, { operatorId: order.operatorId }]
      break
    case "done":
      condition.state.$in.push("blending")
      condition.operatorId = order.operatorId
      break
    default:
      // invalid state
      res.status(400).json({ error: "invalid state" })
      return
  }
  
  const result = await orders.updateOne(
    condition,
    {
      $set: {
        state: order.state,
        operatorId: order.operatorId,
      }
    }
  )

  if (result.matchedCount === 0) {
    res.status(400).json({ error: "orderId does not exist or state change not allowed" })
    return
  }
  res.status(200).json({ status: "ok" })
})

// connect to Mongo
client.connect().then(() => {
  logger.info('connected successfully to MongoDB')
  db = client.db("test")
  sellers = db.collection('sellers')
  orders = db.collection('orders')
  buyers = db.collection('buyers')

  Issuer.discover("http://127.0.0.1:8081/auth/realms/webapp/.well-known/openid-configuration").then(issuer => {
    const client = new issuer.Client(keycloak)
  
    passport.use("oidc", new Strategy(
      { 
        client,
        params: {
          // this forces a fresh login screen every time
          prompt: "login"
        }
      },
      async (tokenSet: any, userInfo: any, done: any) => {
        logger.info("oidc " + JSON.stringify(userInfo))

        const _id = userInfo.preferred_username
        const seller = await sellers.findOne({ _id })
        if (seller != null) {
          userInfo.roles = ["seller"]
        } else {
          await buyers.updateOne(
            { _id },
            {
              $set: {
                name: userInfo.name
              }
            },
            { upsert: true }
          )
          userInfo.roles = ["buyer"]
        }

        return done(null, userInfo)
      }
    ))

    app.get(
      "/api/login", 
      passport.authenticate("oidc", { failureRedirect: "/api/login" }), 
      (req, res) => res.redirect("/")
    )
    
    app.get(
      "/api/login-callback",
      passport.authenticate("oidc", {
        successRedirect: "/",
        failureRedirect: "/api/login",
      })
    )    

    // start server
    app.listen(port, () => {
      logger.info(`Server listening on port ${port}`)
    })
  })
})
