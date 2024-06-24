<template>
  <ThemeColor/>
  <ResetPasswordLink/>
  <div class="wrapper d-flex flex-row">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="login">
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput @paste="getErrors('form', 'email', ['required', 'email'])" @input="getErrors('form', 'email', ['required', 'email'])" v-model="form.email"  placeholder="Username" autocomplete="username">
                    </CFormInput> 
                  </CInputGroup>
                  <div class="mb-3">
                    <span v-for="(error, index) in errors.email" :key="index" :class="{'d-block': errors.email[--index]}" class="text-danger">{{ error }}</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput  @paste="getErrors('form', 'password', ['required', 'minLength'])"  @input="getErrors('form', 'password', ['required', 'minLength'])" v-model="form.password" type="password" placeholder="Password" autocomplete="current-password"/>
                  </CInputGroup>
                  <div :class="{'mb-3': !isCredentialInvalid}">
                    <span v-for="(error, index) in errors.password" :key="index" :class="{'d-block': errors.password[--index]}" class="text-danger">{{ error }}</span>
                  </div>
                  <span v-if="isCredentialInvalid" class="text-danger">{{ isCredentialInvalid }}</span>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="form-check mb-1 mt-2">
                        <input id="remember" type="checkbox" v-model="form.remembered" class="form-check-input"/>
                        <label for="remember" class="form-check-label ms-1">Remember me</label>
                    </div>
                    <button type="button" class="btn btn-md text-primary" @click="changePassword">Forgot password</button>
                  </div>
                  <div class="d-grid my-2">
                    <CButton color="primary" class="px-4 form-control" type="submit" :disabled="isLoggingIn">{{  isLoggingIn ? 'Logging In' : 'Login' }} </CButton>
                  </div>
                  <div class="d-flex align-items-center my-2">
                    <span class="text-body-secondary text-decoration-none">Dont have an account yet?</span>
                    <CButton  color="link" class="px-0" @click="navigateRegister" style="text-decoration:none;">
                      <span class="text-primary"  color="link">&nbsp;Register</span>
                    </CButton>
                  </div>
                  <!-- <p class="text-center">OR</p>
                  <div class="border rounded py-2 my-2 text-center">
                    <a  color="link" class="px-0" :href="googleRedirect">
                      <CIcon icon="cib-google" />
                    </a>
                  </div> -->
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import ThemeColor from '@/components/ThemeColor.vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators';
import { checkValidity, errors  } from '@/helpers/validation/vuelidate.js';
import { useAuthStore } from '@/stores/auth-store.js';
import callOptimization from '@/helpers/request-optimizer/callOptimization';
import { sweetAlertNotification } from '@/helpers/notification/sweetAlert.js';
import ResetPasswordLink from './ResetPasswordLink.vue';

export default{
  setup() {
    const authStore = useAuthStore();
    const googleRedirect = 'http://laravel-best-practices.org/auth/google/redirect';
    const v$ = useVuelidate({ $autoDirty: true, $lazy: true });
    return { v$, authStore, googleRedirect };
  },

  components:{
    ThemeColor,
    ResetPasswordLink
  },

  data(){
    return{
      isLoggingIn:false, 
      isCredentialInvalid:null, 
      form:{
        email:'',
        password:'',
        remembered:false,
      },
      errors:{
        email:{},
        password:{},
      },
    }
  },

  validations () {
    return {
      form:{
        email: { required, email},
        password: { required,  minLength:minLength(8)  },
      }
    }
  },
  
  methods:{
    checkInputValidity(parentProperty = null, dataProperty, validations = []) {
      return checkValidity(this.v$, parentProperty, dataProperty, validations);
    },

    serverErrors({data, status}){
      if(data.error){
        this.isCredentialInvalid  = data.error;
      }
      if(data.errors){
        for (const property in data.errors) {
          this.errors[property] = data.errors[property];
        }
      }
    },

    getErrors: callOptimization.debounce(function(parentProperty = null, dataProperty, validations = []){
      this.isCredentialInvalid = null;
      this.errors[dataProperty] = errors(this.v$, parentProperty, dataProperty, validations);
    }, 500),

    async login() {
      this.isLoggingIn = true;
      try {
        if (!this.v$.$validate()) return;
        await this.authStore.login(this.form.email, this.form.password, this.form.remembered);
        sweetAlertNotification("Logged In Succesfully", "", "success")
        setTimeout(() => {
          location.href = '/';
        }, 1000);
      } catch (error) {
        this.serverErrors(error.response);
      } finally{
        this.isLoggingIn = false;
      }
    },

    navigateRegister(){
      this.$router.push({name:'register'});
    },
    changePassword(){
        const modal_id = document.getElementById("reset-password-modal");
        const modal = bootstrap.Modal.getOrCreateInstance(modal_id);
        modal.show();
    },
  },
}
</script>
