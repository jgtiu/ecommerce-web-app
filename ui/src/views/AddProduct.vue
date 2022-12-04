<template>
  <div class="mx-3 my-3">
    <h2>Add Product</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-form>
      <b-form-group label="Name:" label-for="product-name-input">
        <b-form-input id="product-name-input" v-model="draftProductName" />
      </b-form-group>
      <b-form-group label="Description:" label-for="product-description-input">
        <b-form-input id="product-description-input" v-model="draftProductDescription" />
      </b-form-group>
      <b-form-group label="Price:" label-for="product-price-input">
        <b-form-input id="product-price-input" type="number" :number="true" v-model="draftProductPrice" />
      </b-form-group>
      <b-form-checkbox v-model="draftProductAllowReturns" switch>
        Allow returns <strong>(Checked: {{ draftProductAllowReturns }})</strong> 
        <!-- TODO: Remove the <strong> tag and the stuff within it -->
      </b-form-checkbox>
    </b-form>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, inject, Ref } from 'vue'
import { Seller } from "../../../server/data"

const seller: Ref<Seller | null> = ref(null)
const user: Ref<any> = inject("user")!

const draftProductName: Ref<string> = ref("")
const draftProductDescription: Ref<string> = ref("")
const draftProductPrice: Ref<number> = ref(0)
const draftProductAllowReturns: Ref<boolean> = ref(false)

async function refresh() {
  if (user.value) {
    seller.value = await (await fetch("/api/seller")).json()

    const response = await (await fetch("/api/seller/draft-order")).json()
    draftProductName.value = response?.name || ""
    draftProductDescription.value = response?.description || ""
    draftProductPrice.value = response?.price || 0
    draftProductAllowReturns.value = response?.allowReturns || false
  }
}
watch(user, refresh, { immediate: true })

</script>