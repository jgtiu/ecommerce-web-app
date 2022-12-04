<template>
  <div class="mx-3 my-3">
    <h2>Add Product</h2>
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

</script>