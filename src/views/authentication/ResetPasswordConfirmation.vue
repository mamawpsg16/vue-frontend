<template>
    <form class="mx-auto col-6 border border-gray-300 rounded-lg p-4 mt-5" @submit.prevent="reset">
        <input type="text" style="display:none;" id="username" name="username" autocomplete="username">
        <h4 class="text-center">Reset Password</h4>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <Input type="password" id="password" class="form-control" autocomplete="current-password" placeholder="Enter password" v-model="password" @paste="getErrors(null, 'password', ['required', 'minLength'])" @input="getErrors(null, 'password', ['required', 'minLength'])" required/>
            <div class="mb-3">
              <span v-for="(error, index) in errors.password" :key="index" :class="{'d-block': errors.password[--index]}" class="text-danger">{{ error }}</span>
            </div>
        </div>
        <div class="mb-3">
            <label for="confirm-password" class="form-label">Password Confirmation</label>
            <Input type="password" id="confirm-password" class="form-control" autocomplete="new-password-confirm" placeholder="Enter password confirmation" v-model="password_confirmation" @paste="getErrors(null, 'password_confirmation', ['required', 'sameAsPassword'])" @input="getErrors(null, 'password_confirmation', ['required', 'sameAsPassword'])" required/>
            <div class="mb-3">
              <span v-for="(error, index) in errors.password_confirmation" :key="index" :class="{'d-block': errors.password_confirmation[--index]}" class="text-danger">{{ error }}</span>
            </div>
        </div>
        <span v-if="isCredentialInvalid" class="text-danger mb-2">{{ isCredentialInvalid }}</span>
        <div id="btn" class="d-flex justify-content-end mt-2">
            <button type="submit" class="btn btn-primary form-control" :disabled="isProcessing">{{ isProcessing ? 'Processing' : 'Reset' }}</button>
        </div>
  </form>

</template>
  
  <script>
  import Input from '@/components/Form/Input.vue'
  import { useAuthStore } from '@/stores/auth-store.js';
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, sameAs, minLength } from '@vuelidate/validators'
  import { errors  } from '@/helpers/validation/vuelidate.js';
  import callOptimization from '@/helpers/request-optimizer/callOptimization';
  import Swal from 'sweetalert2/dist/sweetalert2.js'
  import { sweetAlertNotification } from '@/helpers/notification/sweetAlert.js';
  export default {
    setup () {
      return { v$: useVuelidate({ $autoDirty : true, $lazy: true}) }
    },
    data() {
      return {
        name: '',
        email: '',
        password: '',
        password_confirmation:'',
        isCredentialInvalid:null,
        authStore:useAuthStore(),
        isProcessing:false,
        errors:{
          password:{},
          password_confirmation:{},
        },
      }
    },
    validations () {
      return {
        password: { required,  minLength:minLength(8) },
        password_confirmation: { required, sameAsPassword: sameAs(this.password) }, // Matches this.password
      }
    },
    components:{
      Input
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
        this.password = null;
        this.password_confirmation = null; 
        this.errors = {
            password:null,
            password_confirmation:null,
        };
        this.v$.$reset()
      },

      async reset() {
        try {
            if(!await this.v$.$validate()) return;         
            this.isProcessing = true;
            const response = await this.authStore.resetPasswordConfirmation(this.$route.query.email, this.password, this.password_confirmation, this.$route.params.token);
            if(response.data.isReset){
                // localStorage.setItem('authenticated', true);
                this.isProcessing = false;
                this.resetForm();
                sweetAlertNotification(response.data.message,"", "success")
                this.$router.push({name:'login'});
            }else{
                // localStorage.setItem('authenticated', true);
                this.isProcessing = false;
                Swal.fire({
                    title: response.data.message,
                    icon: "error",
                    showConfirmButton: false,
                });
            }
            if (response?.response?.status == 422) {
                this.errors =   this.serverErrors(response.response);
                this.isProcessing = false;
            }
        } catch (error) {
            this.serverErrors(error.response);
        } finally{
          this.isProcessing = false;
        }
      }
    },

    mounted(){
    }
  }
  </script>