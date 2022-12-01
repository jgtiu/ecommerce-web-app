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

