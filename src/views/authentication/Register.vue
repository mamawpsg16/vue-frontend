<template>
  <ThemeColor/>
  <div class="bwrapper d-flex flex-row">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm>
                <h1>Register</h1>
                <p class="text-body-secondary">Create your account</p>
                <CInputGroup>
                  <CInputGroupText><CIcon icon="cil-user" /></CInputGroupText>
                  <CFormInput v-model="form.name" @paste="getErrors('form', 'name', ['required', 'maxLength'])" @input="getErrors('form', 'name', ['required', 'maxLength'])" placeholder="Name" autocomplete="name" />
                </CInputGroup>
                <div class="mb-3">
                  <span v-for="(error, index) in errors.name" :key="index" :class="{'d-block': errors.name[--index]}" class="text-danger">{{ error }}</span>
                </div>
                <CInputGroup>
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput @paste="getErrors('form', 'email', ['required', 'email'])" @input="getErrors('form', 'email', ['required', 'email'])" v-model="form.email"  placeholder="Email" autocomplete="email" />
                </CInputGroup>
                <div class="mb-3">
                  <span v-for="(error, index) in errors.email" :key="index" :class="{'d-block': errors.email[--index]}" class="text-danger">{{ error }}</span>
                </div>
                <CInputGroup>
                  <CInputGroupText><CIcon icon="cil-lock-locked" /> </CInputGroupText>
                  <CFormInput v-model="form.password" @paste="getErrors('form', 'password', ['required', 'minLength'])" @input="getErrors('form', 'password', ['required', 'minLength'])" type="password" placeholder="Password" autocomplete="new-password"/>
                </CInputGroup>
                <div class="mb-3">
                  <span v-for="(error, index) in errors.password" :key="index" :class="{'d-block': errors.password[--index]}" class="text-danger">{{ error }}</span>
                </div>
                <CInputGroup>
                  <CInputGroupText><CIcon icon="cil-lock-locked" /></CInputGroupText>
                  <CFormInput  v-model="form.password_confirmation" @paste="getErrors('form', 'password_confirmation', ['required', 'sameAsPassword'])" @input="getErrors('form', 'password_confirmation', ['required', 'sameAsPassword'])" type="password" placeholder="Repeat password" autocomplete="new-password"/>
                </CInputGroup>
                <div class="mb-3">
                  <span v-for="(error, index) in errors.password_confirmation" :key="index" :class="{'d-block': errors.password_confirmation[--index]}" class="text-danger">{{ error }}</span>
                </div>
                <div class="d-grid">
                  <CButton color="success"  :disabled="isProcessing" @click="register">{{ isProcessing ? 'Processing' : 'Register'}}</CButton>
                </div>
                <div class="d-flex align-items-center my-2">
                  <span class="text-body-secondary text-decoration-none">Have an account already?</span>
                  <CButton  color="link" class="px-0" @click="navigateLogin">
                    <span class="text-primary"  color="link">&nbsp;Login</span>
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>
<script >
import { useRouter } from 'vue-router';
import ThemeColor from '@/components/ThemeColor.vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs, maxLength } from '@vuelidate/validators';
import { errors  } from '@/helpers/validation/vuelidate.js';
import callOptimization from '@/helpers/request-optimizer/callOptimization';
import { useAuthStore } from '@/stores/auth-store.js';
import { sweetAlertNotification } from '@/helpers/notification/sweetAlert.js';

export default{
  setup() {
    const navigateLogin = () =>  router.push({ name:'login' })

    const router = useRouter()
    const authStore = useAuthStore();
    const v$ = useVuelidate({ $autoDirty: true, $lazy: true });

    return { v$, authStore, navigateLogin };
  },

  components:{
    ThemeColor
  },

  data(){
    return{
      isProcessing:false, 
      form:{
        name:'',
        email:'',
        password:'',
        password_confirmation:'',
      },
      errors:{
        name:{},
        email:{},
        password:{},
        password_confirmation:{},
      }
    }
  },

  validations () {
    return {
      form:{
        name: { required, maxLength:maxLength(100) }, 
        email: { required, email }, 
        password: { required, minLength:minLength(8) },
        password_confirmation: { required, sameAsPassword: sameAs(this.form.password) }, // Matches this.password
      }
    }
  },

  methods:{
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

    async register() {
      console.log('Register');
      this.isProcessing = true;
      try {
        if (!this.v$.$validate()) return;
        await this.authStore.register(this.form.name, this.form.email, this.form.password, this.form.password_confirmation);
        sweetAlertNotification("Registered Succesfully, Kindly Verify Your Email","", "success")
        setTimeout(() => {
          location.href = '/';
        }, 1000);
      } catch (error) {
        this.serverErrors(error.response);
      } finally{
        this.isProcessing = false;
      }
    },
  }
}
</script>
