<template>
  <div class="mx-3 my-3">
    <h2>My Purchase History</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, inject, Ref } from 'vue'
import { BuyerWithOrders, Order } from "../../../server/data"

const buyer: Ref<BuyerWithOrders | null>= ref(null)
const purchaseHistory: Ref<Order[]> = ref([])
const user: Ref<any> = inject("user")!

async function refresh() {
  if (user.value) {
    buyer.value = await (await fetch("/api/buyer")).json()
  }
  if (buyer.value) {
    purchaseHistory.value = buyer.value.orders.filter((element: Order) => {
      return element.state != "cart"
    })
  }
}
watch(user, refresh, { immediate: true })

</script>