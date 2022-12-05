import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'

// buyer screens
import BuyerScreen from '@/views/BuyerScreen.vue'
import Cart from '@/views/Cart.vue'
import PurchaseHistory from '@/views/PurchaseHistory.vue'

// seller screens
import SellerScreen from '@/views/SellerScreen.vue'
import AddProduct from '@/views/AddProduct.vue'
import Products from '@/views/Products.vue'

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
    },
    {
      path: "/buyer",
      component: BuyerScreen, // BuyerScreen doubles as the shopping screen
    },
    {
      path: "/buyer/cart",
      component: Cart,
    },
    {
      path: "/buyer/purchase-history",
      component: PurchaseHistory,
    },
    {
      path: "/seller", // under construction; The SellerScreen doubles as the "orders to fulfill" screen
      component: SellerScreen,
    },
    {
      path: "/seller/add-product",
      component: AddProduct,
    },
    {
      path: "/seller/products",
      component: Products,
    },
    {
      path: "/admin", //under construction
    }
  ],
})

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
