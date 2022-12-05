<template>
  <div class="mx-3 my-3">
    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table :items="orders" :fields="fields">
      <template #cell(fulfillOrder)="cellScope">
        <b-button @click="fulfillOrder(cellScope.item)">
          Fulfill
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, Ref, inject } from 'vue'
import { Order, SellerWithOtherAttributes } from "../../../server/data"

const seller: Ref<SellerWithOtherAttributes | null> = ref(null)
const orders: Ref<Order[]> = ref([])

const user: Ref<any> = inject("user")!

async function refresh() {
  if (user.value) {
    seller.value = await (await fetch("/api/seller")).json()
  }
  if (seller.value) {
    orders.value = seller.value.orders.filter((element: Order) => {
      return element.state === "purchased"
    })
  }
}
watch(user, refresh, { immediate: true })

const fields = ["productName", "productPrice", "productAllowReturns", "buyerId", "fulfillOrder"]

async function fulfillOrder(order: Order) {
  await fetch(
    "/api/order/" + encodeURIComponent(order._id) + "/fulfill",
    { method: "PUT" }
  )
  await refresh()
}
</script>