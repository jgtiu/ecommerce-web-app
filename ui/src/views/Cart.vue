<template>
  <div class="mx-3 my-3">
    <h2>My Cart</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table :items="cart" :fields="fields">
      <template #cell(removeFromCart)="cellScope">
        <b-button @click="deleteOrder(cellScope.item)">
          Remove from Cart
        </b-button>
      </template>
    </b-table>
    <b-button @click="purchase">Checkout and Purchase</b-button>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, inject, Ref } from 'vue'
import { BuyerWithOrders, Order } from "../../../server/data"

const buyer: Ref<BuyerWithOrders | null>= ref(null)
const cart: Ref<Order[]> = ref([])
const user: Ref<any> = inject("user")!

async function refresh() {
  if (user.value) {
    buyer.value = await (await fetch("/api/buyer")).json()
  }
  if (buyer.value) {
    cart.value = buyer.value.orders.filter((element: Order) => {
      return element.state === "cart"
    })
  }
}
watch(user, refresh, { immediate: true })

const fields = ["productName", "productPrice", "productAllowReturns", "removeFromCart"]

async function deleteOrder(order: Order) {
  await fetch(
    "/api/order/" + encodeURIComponent(order._id) + "/delete",
    { method: "DELETE" }
  )
  await refresh()
}

async function purchase() {
  await fetch(
    "/api/buyer/purchase",
    { method: "PUT" }
  )
  await refresh()
}

</script>