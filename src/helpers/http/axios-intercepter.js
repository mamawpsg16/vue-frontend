import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store.js'; // Adjust the import path

function setupInterceptors() {
    axios.interceptors.response.use(
        function (response) {
            // Call was successful, don't do anything special.
            return response;
        },
        function (error) {
            console.log('Error interceptor triggered', error.response); // Add logging
            if (error.response) {
                const currentPath = window.location.pathname;

                switch (error.response.status) {
                    case 401: // Not logged in
                        useAuthStore().setAuthenticated(false);
                        if (currentPath !== '/login' && currentPath !== '/register') {
                            location.href = "/login";
                        }
                        break;
                    case 403: // Forbidden
                        if (error.response.data.status === 'forbidden') {
                            if (currentPath !== '/forbidden') {
                                location.href = "/forbidden";
                            }
                        }
                        break;
                    case 503: // Down for maintenance
                        console.log('Handling 503');
                        // You may want to show a maintenance page or something similar
                        break;
                    case 500:
                        console.log('Handling 500');
                        // Handle server errors here
                        break;
                    default:
                        // Allow individual requests to handle other errors
                        return Promise.reject(error);
                }
            } else {
                console.log('No response in error'); // Add this to check if error.response is undefined
            }
            return Promise.reject(error); // Add this to continue rejecting the promise after handling
        }
    );
}

export default setupInterceptors;
