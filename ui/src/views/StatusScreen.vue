<template>
  <div class="mx-3 my-3">
    <h2>Admin</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table :items="orders" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { Product } from '../../../server/data'

const products: Ref<Product[]> = ref([])
const productBeingEdited: Ref<Product | null> = ref(null)
const newPrice: Ref<number> = ref(0)

async function refresh() {
  products.value = await (await fetch("/api/products")).json()
  newPrice.value = 0
}
onMounted(refresh)
</script>