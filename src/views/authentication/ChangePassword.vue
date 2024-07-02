<template>
    <Modal id="change-password-modal" title="Change Password">
        <template #content>
            <form class="mx-auto rounded-lg p-3" @submit.prevent="update">
                <input type="text" style="display:none;" id="username" name="username" autocomplete="username">
                <div class="mb-2">
                    <label for="password" class="form-label">Current Password <code>*</code></label>
                    <div class="input-group">
                        <Input :type="passwordInputType" id="current-password"  class="form-control"  @paste="getErrors(null, 'password', ['required'])" @input="getErrors(null, 'password', ['required'])" tabindex="1" autocomplete="current-password"  name="current-password" placeholder="Enter password" v-model="password" required />
                        <span class="input-group-text" id="basic-addon1">
                            <button type="button" class="btn btn-sm" @click="togglePasswordVisibility()" ><i class="fa-solid fa-eye-slash" id="passwordVisibilityToggle"></i></button>
                        </span>
                    </div>
                    <div class="mb-3">
                        <span v-for="(error, index) in errors.password" :key="index" :class="{'d-block': errors.password[--index]}" class="text-danger">{{ error }}</span>
                    </div>
                </div>
                <div class="mb-2">
                    <label for="password" class="form-label">New Password <code>*</code></label>
                    <div class="input-group">
                        <Input :type="newPasswordInputType" id="new-password" @paste="getErrors(null, 'new_password', ['required', 'notSameAsPassword', 'minLength'])" @input="getErrors(null, 'new_password', ['required', 'notSameAsPassword', 'minLength'])" tabindex="2" class="form-control" autocomplete="new-password" name="new-password" placeholder="Enter new password" v-model="new_password" required />
                        <span class="input-group-text" id="basic-addon1">
                            <button type="button" class="btn btn-sm" @click="toggleNewPasswordVisibility()" ><i class="fa-solid fa-eye-slash" id="newPasswordVisibilityToggle"></i></button>
                        </span>
                    </div>
                    <div class="mb-3">
                        <span v-for="(error, index) in errors.new_password" :key="index" :class="{'d-block': errors.new_password[--index]}" class="text-danger">{{ error }}</span>
                    </div>
                </div>
                <div class="mb-2">
                    <label for="password" class="form-label">Confirm New Password <code>*</code></label>
                    <div class="input-group">
                        <Input :type="newPasswordConfirmationInputType" tabindex="3"  @paste="getErrors(null, 'new_password_confirmation', ['required', 'sameAsPassword'])" @input="getErrors(null, 'new_password_confirmation', ['required', 'sameAsPassword'])" id="new-password-confirmation" class="form-control" name="new-password-confirmation" autocomplete="new-password-confirmation"  placeholder="Enter new password confirmation" v-model="new_password_confirmation" required />
                        <span class="input-group-text" id="basic-addon1">
                            <button type="button" class="btn btn-sm" @click="toggleNewPasswordConfirmationVisibility()" ><i class="fa-solid fa-eye-slash" id="newPasswordConfirmationVisibilityToggle"></i></button>
                        </span>
                    </div>
                    <div class="mb-3">
                        <span v-for="(error, index) in errors.new_password_confirmation" :key="index" :class="{'d-block': errors.new_password_confirmation[--index]}" class="text-danger">{{ error }}</span>
                    </div>
                </div>
                <span v-if="isCredentialInvalid" class="text-danger mb-1">{{ isCredentialInvalid }}</span>
                <div id="btn" class="d-flex justify-content-end mt-2">
                    <button type="submit" class="btn btn-primary form-control" tabindex="4" :disabled="isUpdating">{{  isUpdating ? 'Updating' : 'Update' }}</button>
                </div>
            </form>
        </template>
    </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import Input from '@/components/Form/Input.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, sameAs, helpers, minLength  } from '@vuelidate/validators'
import { errors  } from '@/helpers/validation/vuelidate.js';
import { useAuthStore } from '@/stores/auth-store.js';
import { sweetAlertNotification } from '@/helpers/notification/sweetAlert.js';
import callOptimization from '@/helpers/request-optimizer/callOptimization';

    const notSameAsPassword = (currentPassword) => {
        return helpers.withParams( { type: 'notSameAsPassword', value: currentPassword },
            (value) => value != currentPassword
        );
    };
    // const notSameAsPassword = (currentPassword) => {
    //     return helpers.withMessage(
    //         (value) => value !== currentPassword,
    //         `New password cannot be the same as the current password (${currentPassword}).`
    //     );
    // };


    export default {
        setup () {
            return { v$: useVuelidate({ $autoDirty : true, $lazy: true}) }
        },
        components: {
            Modal,
            Input
        },
        data() {
            return {
                password: '',
                authStore:useAuthStore(),
                new_password: '',
                new_password_confirmation: '',
                isCredentialInvalid:null,
                isUpdating:false,
                passwordInputType: 'password',
                showPassword:false,
                newPasswordInputType: 'password',
                showNewPassword:false,
                newPasswordConfirmationInputType: 'password',
                showNewConfirmationPassword:false,
                errors:{
                    password:{},
                    new_password:{},
                    new_password_confirmation:{},
                },
            }
        },
        validations () {
            return {
                password: { required },
                new_password: { required, notSameAsPassword:  helpers.withMessage('New password cannot be the same as the current password', notSameAsPassword(this.password)), minLength:minLength(8) },
                new_password_confirmation: { required: helpers.withMessage('New password confirmation is required', required), sameAsPassword: sameAs(this.new_password) }
            }
        },
        methods:{
            
            resetForm() {
                this.password = null;
                this.new_password = null;
                this.new_password_confirmation = null;
                this.errors = [{
                    password:false,
                    new_password:false,
                    new_password_confirmation:false,
                }],
                this.v$.$reset();
                this.isUpdating = false;
            },

            serverErrors(response){
                if(response?.status != 200){
                   if(response?.data?.errors){
                       for (const property in data?.errors) {
                           this.errors[property] = data?.errors[property];
                       }
                   }
                }
            },

            getErrors: callOptimization.debounce(function(parentProperty = null, dataProperty, validations = []){
                this.errors[dataProperty] = errors(this.v$, parentProperty, dataProperty, validations);
            }, 500),

            togglePasswordVisibility() {
                const passwordVisibilityToggle = document.getElementById('passwordVisibilityToggle');
                this.showPassword = !this.showPassword;
                if (this.showPassword) {
                    this.passwordInputType =  'text';
                    passwordVisibilityToggle.classList.remove('fa-eye-slash');
                    passwordVisibilityToggle.classList.add('fa-eye');
                } else {
                    this.passwordInputType = 'password';
                    passwordVisibilityToggle.classList.remove('fa-eye');
                    passwordVisibilityToggle.classList.add('fa-eye-slash');
                }
            },

            toggleNewPasswordVisibility() {
                const passwordVisibilityToggle = document.getElementById('newPasswordVisibilityToggle');
                this.showNewPassword = !this.showNewPassword;
                if (this.showNewPassword) {
                this.newPasswordInputType =  'text';
                passwordVisibilityToggle.classList.remove('fa-eye-slash');
                passwordVisibilityToggle.classList.add('fa-eye');
                } else {
                this.newPasswordInputType = 'password';
                passwordVisibilityToggle.classList.remove('fa-eye');
                passwordVisibilityToggle.classList.add('fa-eye-slash');
                }
            },

            toggleNewPasswordConfirmationVisibility() {
                    const passwordVisibilityToggle = document.getElementById('newPasswordConfirmationVisibilityToggle');
                    this.showNewConfirmationPassword = !this.showNewConfirmationPassword;
                if (this.showNewConfirmationPassword) {
                    this.newPasswordConfirmationInputType =  'text';
                    passwordVisibilityToggle.classList.remove('fa-eye-slash');
                    passwordVisibilityToggle.classList.add('fa-eye');
                } else {
                    this.newPasswordConfirmationInputType = 'password';
                    passwordVisibilityToggle.classList.remove('fa-eye');
                    passwordVisibilityToggle.classList.add('fa-eye-slash');
                }
            },
            
            update(){
                this.authStore.changePassword
            },
            async update() {
                try {
                    if(!await this.v$.$validate()) return;
                    this.isUpdating = true;
                    const response = await this.authStore.changePassword(this.password, this.new_password, this.new_password_confirmation);
                    if(response?.status == 200){
                        this.resetForm()
                        sweetAlertNotification(response.data.message,'','success')
                    }
                    if (response.response.status == 422) {
                        this.serverErrors(response?.response);
                    }
                    
                } catch (error) {
                    this.serverErrors(error?.response);
                }finally{
                    this.isUpdating = false;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>