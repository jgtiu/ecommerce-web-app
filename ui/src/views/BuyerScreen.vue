<template>
  <div class="mx-3 my-3">
    <h2>Shop</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" />
    
    <h2>Draft Order</h2>
    Check the ingredients you want:
    <b-form-checkbox-group v-model="draftOrderIngredients" :options="possibleIngredients" />
    <div class="mt-2">
      <b-button @click="save">Save</b-button>
    </div>
    <div class="mt-2">
      <b-button @click="submit">Submit</b-button>
      Note: must save before submitting
    </div>
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

const fields = ["name", "description", "price", "allowReturns"]

</script>