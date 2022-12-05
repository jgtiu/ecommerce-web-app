<template>
  <div class="mx-3 my-3">
    <h2>Admin</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table :items="products" :fields="fields">
      <template #cell(editPrice)="cellScope">
        <b-button @click="changeEditState(cellScope.item)">
          Edit Price
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { Product } from '../../../server/data'

const products: Ref<Product[]> = ref([])
const formState: Ref<boolean> = ref(false)
const productBeingEdited: Ref<Product | null> = ref(null)
const newPrice: Ref<number> = ref(0)

async function refresh() {
  products.value = await (await fetch("/api/products")).json()
  newPrice.value = 0
}
onMounted(refresh)

const fields = ["name", "description", "allowReturns", "sellerId", "price", "editPrice"]

async function changeEditState(product: Product) {
  formState.value = true
  productBeingEdited.value = product
}
</script>