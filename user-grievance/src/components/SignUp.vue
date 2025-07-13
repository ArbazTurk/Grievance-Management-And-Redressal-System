<template>
  <div class="bwrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CModal style="color: #d9534f;" :visible="showModal" @close="showModal = false">
        <CModalHeader>
          <CModalTitle>Password Mismatch Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h6>The password and confirm password do not match. Please try again.</h6>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="showModal = false">
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <CRow class="justify-content-center custom-form-size">
        <CCol md="11" lg="9" xl="7" class="px-0">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm @submit.prevent="createAcc">
                <div class="image d-flex justify-content-center">
                  <img src="/RDLOGOBGREMOVED.png" alt="Searching..." class="text-center" />
                </div>
                <transition name="slide-fade">
                  <CAlert v-if="errorMessage" color="danger" class="d-flex align-items-center mt-2 alert-slide">
                    <CIcon icon="cil-exclamation-circle" class="flex-shrink-0 me-2" width="24" height="24" />
                    {{ errorMessage }}
                  </CAlert>
                </transition>
                <transition name="slide-fade">
                  <CAlert v-if="successMessage" color="success" class="d-flex align-items-center mt-2 alert-slide">
                    <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />
                    {{ successMessage }}
                  </CAlert>
                </transition>
                <div>
                  <h2 class="grievance text-center mt-5">Welcome to RD Grievance Management</h2>
                </div>
                <div>
                  <h3 class="reg text-center">Register Yourself</h3>
                </div>

                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput placeholder="Firstname" autocomplete="firstname" name="firstName" v-model="firstName"
                    required />
                </CInputGroup>

                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput placeholder="Lastname" autocomplete="lastname" name="lastName" v-model="lastName"
                    required />
                </CInputGroup>

                <CInputGroup class="">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput type="email" placeholder="Email" autocomplete="email" name="email" v-model="email"
                    required />
                </CInputGroup>

                <div class="mb-4 text-danger">
                  Note - only college email is allowed, otherwise it will be cancelled by admin
                </div>

                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-phone" />
                  </CInputGroupText>
                  <CFormInput type="tel" placeholder="Mobile" autocomplete="mobile" name="mobileNo" v-model="mobileNo"
                    maxlength="10" pattern="\d{10}" inputmode="numeric" required />
                </CInputGroup>

                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormSelect v-model="role" required>
                    <option value="" selected disabled>Select your role</option>
                    <option value="Student">Student</option>
                    <option value="Staff">Staff</option>
                  </CFormSelect>
                </CInputGroup>

                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput :type="showPassword ? 'text' : 'password'" placeholder="Password" autocomplete="password"
                    id="password" v-model="password" minlength="6" required />
                  <span class="password-toggle">
                    <font-awesome-icon :icon="showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'"
                      @click="togglePasswordVisibility('Password')" />
                  </span>
                </CInputGroup>
                <p class="mb-4 text-danger">Password must be at least
                  6 characters long.</p>

                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm-Password"
                    autocomplete="new-password" id="confirmPassword" v-model="confirmPassword" required />
                  <span class="password-toggle">
                    <font-awesome-icon :icon="showConfirmPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'"
                      @click="togglePasswordVisibility('ConfirmPassword')" />
                  </span>
                </CInputGroup>
                <p class="mb-4 text-danger">Passwords must match.</p>
                <CCol class="d-flex justify-content-center gap-4 mt-3 mb-4">
                  <CButton class="px-3 text-white" type="button" color="danger" @click="cancelCreateAcc"
                    :disabled="loading">Cancel
                  </CButton>
                  <CButton class="px-4" type="submit" :color="theme === 'light' ? 'dark' : 'light'" variant="outline"
                    :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status"
                      aria-hidden="true"></span>
                    <span v-if="loading"> Creating...</span>
                    <span v-else>Create Account</span>
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <transition name="slide-fade">
        <CAlert v-if="successMessage" color="success" class="d-flex align-items-center mt-2 alert-slide">
          <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />
          {{ successMessage }}
        </CAlert>
      </transition>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios'
// import router from '../router'
// import '@fortawesome/fontawesome-free';
import { mapState } from 'pinia'
import { useThemeStore } from '@/stores/theme'

export default {
  name: 'SignUp',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      mobileNo: '',
      role: '',
      password: '',
      confirmPassword: '',
      // passwordValid: false,
      confirmPasswordValid: false,
      showPassword: false,
      showConfirmPassword: false,
      successMessage: '',
      errorMessage: '',
      showModal: false,
      loading: false,
    }
  },
  computed: {
    ...mapState(useThemeStore, ['theme']),
  },
  methods: {
    togglePasswordVisibility(fieldName) {
      this[`show${fieldName}`] = !this[`show${fieldName}`];
    },
    async createAcc() {
      try {
        this.loading = true;
        // this.passwordValid = this.password.length >= 6;
        this.confirmPasswordValid = this.password === this.confirmPassword;
        if (this.confirmPasswordValid) {
          let data = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            mobileNo: this.mobileNo,
            role: this.role,
            password: this.password,
          }
          let url = import.meta.env.VITE_BASE_API + '/signup'
          const response = await axios({
            method: 'post',
            url: url,
            data: data,
          })
          if (response.status === 200) {
            this.successMessage = 'Registration successful! Please check your email to verify your account.'
            this.clearForm();
            setTimeout(() => {
              this.successMessage = ''
            }, 5000)
          }
        } else {
          this.showModal = true;
          this.errorMessage = 'Password and Confirm Password do not match.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      } catch (err) {
        console.log(err);
        this.errorMessage = 'An error occurred during registration. Please try again.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      } finally {
        this.loading = false;
      }
    },
    cancelCreateAcc() {
      this.$router.push({ name: 'Member Login' });
    },
    clearForm() {
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.mobileNo = '';
      this.role = '';
      this.password = '';
      this.confirmPassword = '';
      this.confirmPasswordValid = false;
      this.showPassword = false;
      this.showConfirmPassword = false;
    }
  },
}
</script>


<style scoped>
.password-toggle {
  position: absolute;
  top: 55%;
  right: 13px;
  z-index: 10;
  transform: translateY(-50%);
  cursor: pointer;
}

/*.fas {
  font-size: 14px;
}*/

.text-danger {
  font-size: 0.8rem;
  margin-top: 5px;
}

img {
  width: 130px;
}

.reg {
  position: relative;
  bottom: 1.5rem;
}

.image {
  position: relative;
  bottom: 5px;
}

.grievance {
  position: relative;
  bottom: 2.1rem;
}

.content-top {
  opacity: 0;
  animation: slide 2s ease forwards;
}

@keyframes slide {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.alert-slide {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1050;
  animation: slide-fade 0.5s ease-in-out;
}

@keyframes slide-fade {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .mx-4 {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .CCard {
    width: 100% !important;
  }
}

/*.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper i {
  position: absolute;
  right: 10px;
  cursor: pointer;
}*/
</style>
