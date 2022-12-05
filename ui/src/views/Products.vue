<template>
  <div class="mx-3 my-3">
    <h2>My Products</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="seller" :items="seller.productList" />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, inject, Ref } from 'vue'
import { SellerWithOtherAttributes } from '../../../server/data';

const seller: Ref<SellerWithOtherAttributes | null> = ref(null)
const user: Ref<any> = inject("user")!

async function refresh() {
  if (user.value) {
    seller.value = await (await fetch("/api/seller")).json()
  }
}
watch(user, refresh, { immediate: true })

</script>