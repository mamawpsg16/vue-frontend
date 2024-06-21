// guard.js

import { useAuthStore } from '@/stores/auth-store.js';
import NProgress from 'nprogress/nprogress.js';
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false });

export async function beforeEachGuard(to, from, next) {
    NProgress.start()
    const authStore = useAuthStore();

    // Fetch the user data if the route requires authentication
    await authStore.getUser();

    const isAuthenticated = authStore.isUserAuthenticated && authStore.userName;

    // Redirect if trying to access a protected route without being authenticated
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login' });
    } else if (isAuthenticated && (to.name === 'login' || to.name === 'register' || to.name === 'reset-password')) {
        // Redirect authenticated users from login, register, and reset-password to dashboard
        next({ name: 'dashboard' });
    } else {
        next(); // Proceed to the route
    }
}

export function afterEachGuard(to, from) {
    NProgress.done()
}

