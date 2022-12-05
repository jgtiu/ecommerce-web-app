<template>
  <div class="mx-3 my-3">
    <h2>My Cart</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
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