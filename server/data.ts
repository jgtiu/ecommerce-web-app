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
  sellerId: string // the seller of the product
  productId: string
  buyerId: string
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

export interface BuyerWithOrders extends Buyer {
  orders: Order[]
}

export interface SellerWithOtherAttributes extends Seller {
  orders: Order[]
  productList: Product[]
}
