// guard.js

import { useAuthStore } from '@/stores/auth-store.js';
import NProgress from 'nprogress/nprogress.js';
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false });

export async function beforeEachGuard(to, from, next) {
    NProgress.start()
    const authStore = useAuthStore();

    // Fetch the user data if the route requires authentication
    await authStore.getUser();
    const isUserAuthenticated = authStore.isUserAuthenticated;
    const isUserVerified = authStore.isUserVerified;

    // Prevent infinite loop for the email-verification route
    if (to.name === 'email-verification') {
        if (isUserAuthenticated && !isUserVerified) {
        next(); // Allow access to the email-verification route
        } else {
        next({ name: 'dashboard' }); // Redirect to the dashboard if user is verified
        }
        return;
    }
    // Redirect if trying to access a protected route without being authenticated
    if (to.meta.requiresAuth && !isUserAuthenticated) {
        // User is not authenticated, redirect to login
        next({ name: 'login' });
    } else if (to.meta.requiresAuth && isUserAuthenticated && !isUserVerified) {
        // User is authenticated but not verified, redirect to email verification
        next({ name: 'email-verification' });
    } else if (!to.meta.requiresAuth && isUserAuthenticated) {
        // User is authenticated, prevent access to login route
        next({ name: 'dashboard' });
    } else {
    next();
    }
}

export function afterEachGuard(to, from) {
    NProgress.done()
}

