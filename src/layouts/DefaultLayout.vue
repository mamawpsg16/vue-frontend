<script setup>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth-store.js';

const authStore = useAuthStore();
</script>

<template>
  <div>
    <AppSidebar/>
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader/>
      <div class="body flex-grow-1">
        <CContainer fluid class="px-5">
          <router-view />
        </CContainer>
      </div>
      <AppFooter/>
    </div>
  </div>
</template>
