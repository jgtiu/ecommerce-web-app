export interface DraftProduct {
  name: string
  description: string
  price: number
  allowReturns: boolean
}

export interface Product extends DraftProduct {
  _id: string
  sellerId: string
}

export interface Order {
  _id: string // Note that order ID is different from product ID
  productName: string
  productPrice: number
  productAllowReturns: boolean
  productId: string
  productSellerId: string
  fulfilled: boolean
}
