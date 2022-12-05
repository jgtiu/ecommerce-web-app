<template>
  <div class="mx-3 my-3">
    <h2>Shop</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table :items="products" :fields="fields">
      <template #cell(addToCart)="cellScope">
        <b-button @click="addToCart(cellScope.item)">
          Add to Cart
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, inject, Ref } from 'vue'
import { Buyer, Product } from "../../../server/data"

const buyer: Ref<Buyer | null>= ref(null)
const products: Ref<Product[]> = ref([])
const user: Ref<any> = inject("user")!

async function refresh() {
  products.value = await (await fetch("/api/products")).json()

  if (user.value) {
    buyer.value = await (await fetch("/api/buyer")).json()
  }
}
watch(user, refresh, { immediate: true })

const fields = ["name", "description", "price", "allowReturns", "addToCart"]

async function addToCart(product: Product) {
  await fetch(
    "/api/product/" + product._id + "/addToCart",
    { method: "POST" }
  )
  await refresh()
}

</script>