<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="login">
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="email"
                      placeholder="Username"
                      autocomplete="username"
                    >
                    </CFormInput> 
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="password"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" type="submit"> Login </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Dont have account yet?</h2>
                  <CButton color="light" variant="outline" class="mt-3">
                    Register Now!
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import apiClient from '@/helpers/http/apiClient.js';
import { login } from '@/helpers/http/authService.js';
import axios from 'axios';
import { useLayoutStore } from '@/stores/layout.js';

export default {
    data() {
        return {
            email: '',
            password: '',
            layout:useLayoutStore()
        };
    },
    beforeMount(){
        this.layout.setLayout({
          header:false,
          sidebar:false,
          footer:false,
        });
    },
    methods: {
        async login() {
            try {
                const csrf = axios.get('/sanctum/csrf-cookie');
                const response = await apiClient.post('/login',{ email: this.email, password: this.password, remembered: false });
            } catch (error) {
                console.error(error);
            }
        },
    },
};
</script>
