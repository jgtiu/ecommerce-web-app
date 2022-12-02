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

export interface CartOrder {
  // This is a draft version of Order
  // We may or may not implement a cart, but either way we will use this type

  // Note that CartOrder ID is different from product ID
  // The _id field is here instead of in Order because a buyer can have more than
  // one CartOrder at a time
  _id: string
  productName: string
  productPrice: number
  productAllowReturns: boolean
  sellerId: string // the seller of the product
  productId: string
  buyerId: string
}

export interface Order extends CartOrder {
  // "purchased" means that the order is in the seller's queue
  // If we do not implement a cart feature, state: "cart" will never be used
  state: "cart" | "purchased" | "fulfilled"
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