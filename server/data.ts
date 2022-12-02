export interface DraftProduct {
  name: string
  description: string
  price: number
  allowReturns: boolean
  sellerId: string
}

export interface Product extends DraftProduct {
  _id: string
  state: "draft" | "submitted"
}

export interface Order {
  _id: string // Note that order ID is different from product ID
  productName: string
  productPrice: number
  productAllowReturns: boolean
  productId: string
  buyerId: string
  sellerId: string
  fulfilled: boolean
}

export interface Buyer {
  _id: string
  username: string
  fullName: string
  email: string
}

export interface Seller {
  // For now, this is exactly the same as Buyer but we may want to be able to
  // edit these two types independently
  _id: string
  username: string
  fullName: string
  email: string
}

export interface BuyerWithCart extends Buyer {
  // If we implement a cart, we need this
  cart: Product[]
}