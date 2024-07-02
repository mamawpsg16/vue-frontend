<script setup>
import formatter from '@/helpers/formatter/transform.js';
import { onMounted, ref } from 'vue'
import router from '@/router'

const breadcrumbs = ref()

const getBreadcrumbs = () => {
  const routes = router.currentRoute.value.matched
    .filter(route => route.meta.breadcrumb)
    .map(route => {
      return {
        active: (route.path === router.currentRoute.value.fullPath || route.meta.parent),
        name: route.meta.breadcrumb,
        path: `${router.options.history.base}${route.path}`,
      };
    });

  // Use a Set to track unique 'name' and 'path' combinations
  const seen = new Set();
  const uniqueRoutes = routes.filter(route => {
    const key = `${route.name}:${route.path}`;
    if (seen.has(key)) {
      return false;
    } else {
      seen.add(key);
      return true;
    }
  });

  return uniqueRoutes;
};

router.afterEach(() => {
  breadcrumbs.value = getBreadcrumbs()
})

const getModuleName = (route) => {
  const segments = route.split("-");
  return segments[1] ? segments[1] : route;
};
onMounted(() => {
  breadcrumbs.value = getBreadcrumbs()
})
</script>

<template>
  <CBreadcrumb class="my-0">
    <router-link
      v-for="item in breadcrumbs"
      :key="item.path"
      :to="item.active ? '' : item.path"
      :class="{ 'breadcrumb-item': true, active: item.active }"
      aria-current="item.active ? 'page' : null"
    >
      {{ formatter.capitalizeFirstLetter(getModuleName(item.name)) }}
    </router-link>
  </CBreadcrumb>
</template>