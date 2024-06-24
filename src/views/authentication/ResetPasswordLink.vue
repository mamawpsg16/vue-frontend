<template>
  <Modal id="reset-password-modal" title="Reset Password">
    <template #content>
      <form class="mx-auto rounded-lg p-3" @submit.prevent="resendVerificationLink">
          <div class="mb-2">
              <label for="email" class="form-label">Email</label>
              <Input type="email" id="reset-password-email" autocomplete="email" @paste="getErrors(null, 'email', ['required', 'email'])" @input="getErrors(null, 'email', ['required', 'email'])" class="form-control py-2" placeholder="Enter email" v-model="email" required/>
              <div class="mb-3">
                <span v-for="(error, index) in errors.email" :key="index" :class="{'d-block': errors.email[--index]}" class="text-danger">{{ error }}</span>
              </div>
          </div>
          <div id="btn" class="d-flex justify-content-end mt-2">
            <button class="btn btn-primary form-control" :disabled="isResetLinkSent">{{  isResetLinkSent ? 'Sending...' : 'Send password reset link' }}</button>
          </div>
      </form>
    </template>
  </Modal>
</template>
  
  <script>
  import { useAuthStore } from '@/stores/auth-store';
  import { useVuelidate } from '@vuelidate/core'
  import { required, email } from '@vuelidate/validators';
  import { errors  } from '@/helpers/validation/vuelidate.js';
  import { sweetAlertNotification } from '@/helpers/notification/sweetAlert.js'
  import callOptimization from '@/helpers/request-optimizer/callOptimization';
  import Input from '@/components/Form/Input.vue'
  import Modal from '@/components/Modal.vue';

  export default {
    setup () {
      return { v$: useVuelidate({ $autoDirty : true, $lazy: true}) }
    },
    data() {
      return {
        authStore:useAuthStore(),
        isResetLinkSent:false,
        email:null,
        hasError:null,
        errors:{
          email:{},
        },
      };
    },
    validations () {
      return {
        email: { required, email },
      }
    },
    components:{
      Input,
      Modal
    },
    created() {
    },
    methods: {
      serverErrors({data, status}){
        if(data.errors){
          for (const property in data.errors) {
            this.errors[property] = data.errors[property];
          }
        }
      },

      getErrors: callOptimization.debounce(function(parentProperty = null, dataProperty, validations = []){
        this.errors[dataProperty] = errors(this.v$, parentProperty, dataProperty, validations);
      }, 500),

      resetForm(){
        this.email = null;
        this.v$.$reset();
      },
      async resendVerificationLink() {
        try {
          if(this.v$.email.$errors.length > 0) return;
          this.isResetLinkSent = true;
          const response = await this.authStore.resetPassword(this.email);
          if(response.status == 200){
            this.isResetLinkSent = false;
             sweetAlertNotification(response.data.message,"", "success")
             this.resetForm();
             this.hasError = null;
          }
        } catch (error) {
          this.serverErrors(error.response);
        } finally{
          this.isResetLinkSent = false;
        }
      }
    },
  };
  </script>