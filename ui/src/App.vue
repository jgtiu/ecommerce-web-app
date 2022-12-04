<template>
  <div>
    <b-navbar toggleable="lg" type="dark"
    :variant="$route.fullPath.includes('admin') ? 'dark' : $route.fullPath.includes('seller') ? 'danger' : 'info'">
      <b-navbar-brand href="#">
        <span v-if="user?.name">Welcome, {{ user.name }}</span>
        <span v-else>E-commerce site</span>
      </b-navbar-brand>
      <b-navbar-nav>

        <b-nav-item v-if="(user?.name && $route.fullPath.includes('buyer'))" href="/buyer">
          Shop
        </b-nav-item>
        <b-nav-item v-if="(user?.name && $route.fullPath.includes('buyer'))" href="/buyer/cart">
          My Cart
        </b-nav-item>
        <b-nav-item v-if="(user?.name && $route.fullPath.includes('buyer'))" href="/buyer/purchase-history">
          My Purchase History
        </b-nav-item>

        <b-nav-item v-if="(user?.name && !$route.fullPath.includes('buyer'))" href="/buyer">
          My Buyer Screen
        </b-nav-item>
        <b-nav-item v-if="(user?.name && !$route.fullPath.includes('seller'))" href="/seller">
          My Seller Screen
        </b-nav-item>
        <b-nav-item v-if="(user?.roles?.includes('administrator'))" href="/admin">
          My Admin Screen
        </b-nav-item>

        <b-nav-item v-if="user?.name == null" href="/api/login">Login</b-nav-item>
        <b-nav-item v-if="user?.name" @click="logout">Logout</b-nav-item>
        <form method="POST" action="/api/logout" id="logoutForm" />
      </b-navbar-nav>
    </b-navbar>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'

const user = ref({} as any)
provide("user", user)

onMounted(async () => {
  user.value = await (await fetch("/api/user")).json()
})

function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}
</script>