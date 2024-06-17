<script setup>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useLayoutStore } from '@/stores/layout.js';
import { watch } from 'vue';

const layoutStore  = useLayoutStore()
watch(
  () => layoutStore.layout,
  (newLayout) => {
    console.log('Layout updated:', newLayout);
  },
  { deep: true }
);
</script>

<template>
  <div>
    <AppSidebar v-if="layoutStore.layout.sidebar" />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader v-if="layoutStore.layout.header" />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <router-view />
        </CContainer>
      </div>
      <AppFooter v-if="layoutStore.layout.footer" />
    </div>
  </div>
</template>
