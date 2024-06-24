import { defineStore } from 'pinia';
import axios from 'axios';
import apiClient from '@/helpers/http/api-client.js';
// Declare your store
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:null,
    isAuthenticated:false,
    authenticationDetails:{}
  }),

  getters: {
    userName(state) {
      return state.user ? state.user.name : '';
    },
    isUserAuthenticated(state){
      return state.isAuthenticated;
    },
    isUserBanned(state){
      return state.user?.isUserBanned;
    },
    isUserVerified(state){
      return state.user?.isVerified;
    },
    isSocialAuthenticated(state){
      return state.user?.provider;
    },
    hasLoginError(state){
      return state.authenticationDetails?.status_code && state.authenticationDetails?.status_code != 200;
    },
  },

  actions: {
    async register(name, email, password, passwordConfirmation){
      await apiClient.get("sanctum/csrf-cookie");
      return await apiClient.post('/register', {
        name: name,
        email: email,
        password: password,
        password_confirmation : passwordConfirmation
      });
    },
    
    async login(email, password, remembered){
        await apiClient.get("sanctum/csrf-cookie");
        return await apiClient.post('/login', {
          email: email,
          password: password,
          remembered:remembered
        });
    },

    async resetPassword(email){
      await apiClient.get("sanctum/csrf-cookie");
      return await axios.post('/forgot-password', {
        email: email,
      });
    },
    
    async resetPasswordConfirmation(email, password, passwordConfirmation, token){
        await apiClient.get("sanctum/csrf-cookie");
        return await apiClient.post('/reset-password/confirmation', {
          email: email,
          password: password,
          password_confirmation : passwordConfirmation,
          token: token,
        });
    },

    async changePassword(password, new_password, new_password_confirmation){
      try {
          const response = await apiClient.post('api/user/change-password', {
            password: password,
            new_password: new_password,
            new_password_confirmation:new_password_confirmation
          });
          return response;
        } catch (error) {
          return error;
        }
    },

    async logout(){
      try {
          await apiClient.post('/api/logout').then((response =>{
            if(response.status == 200) {
              window.location.href = '/login'
            }
          }));
        } catch (error) {
        }
    },

  
    async getUser() {
        await apiClient.get('/api/user').then(response => {
          if(response?.data && response?.data?.user ){
            this.setAuthenticated(true);
            this.setUser(response.data.user);
            return;
          }
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    },

    setAuthenticated(isAuthenticated) {
      this.isAuthenticated = isAuthenticated
    },
    
    setUser(user) {
      this.user = user
    },

    setAuthenticationDetails(details) {
      this.authenticationDetails = details
    },
  },
});
