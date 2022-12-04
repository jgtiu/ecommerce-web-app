import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import BuyerScreen from '@/views/BuyerScreen.vue'
import SellerScreen from '@/views/SellerScreen.vue'

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
      path: "/buyer", // under construction; The BuyerScreen doubles as the shopping screen
      component: BuyerScreen,
    },
    {
      path: "/buyer/cart",
    },
    {
      path: "/buyer/purchase-history",
    },
    {
      path: "/seller", // under construction; The SellerScreen doubles as the "orders to fulfill" screen
      component: SellerScreen,
    },
    {
      path: "/seller/add-product", //under construction
    },
    {
      path: "/seller/products", // under construction
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
