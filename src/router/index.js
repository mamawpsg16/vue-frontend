// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes.js';
import {beforeEachGuard, afterEachGuard} from './guard.js';
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  }
});

router.beforeEach(beforeEachGuard);
router.afterEach(afterEachGuard);

export default router;
