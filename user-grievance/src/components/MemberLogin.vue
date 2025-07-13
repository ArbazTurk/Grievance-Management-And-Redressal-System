<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center pt-3">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :lg="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <!-- ========= LOGIN FORM (v-if) ========= -->
                <CForm v-if="!showForgotPassword" @submit.prevent="doLogin">
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput type="email" v-model="email" placeholder="Email" autocomplete="email" required/>
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput :type="showPassword ? 'text' : 'password'" placeholder="Password"
                      autocomplete="current-password" id="password" v-model="password" minlength="6" required />
                    <span class="password-toggle">
                      <font-awesome-icon :icon="showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'"
                        @click="togglePasswordVisibility('Password')" />
                    </span>
                  </CInputGroup>

                  <CRow>
                    <CCol :xs="6">
                      <CButton type="submit" :color="theme === 'light' ? 'dark' : 'light'" variant="outline"
                        class="px-4" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm" role="status"
                          aria-hidden="true"></span>
                        <span v-if="loading"> Logging in...</span>
                        <span v-else>Login</span>
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0" @click="showForgotPassword = true" :disabled="loading">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>

                  <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
                  <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
                </CForm>
                <!-- ========= FORGOT PASSWORD FORM (v-else) ========= -->
                <CForm v-else @submit.prevent="forgotPassword">
                  <h2>Forgot Password?</h2>
                  <p class="text-body-secondary my-2">Enter your email to receive a reset link</p>

                  <CInputGroup class="mb-5 mt-4">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput type="email" v-model="email" placeholder="Email" autocomplete="email" required />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton type="submit" :color="theme === 'light' ? 'dark' : 'light'" variant="outline"
                        class="px-4" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm" role="status"
                          aria-hidden="true"></span>
                        <span v-if="loading"> Requesting...</span>
                        <span v-else>Request</span>
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0" @click="showForgotPassword = false" :disabled="loading">
                        Back to Login
                      </CButton>
                    </CCol>
                  </CRow>
                  <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
                  <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-dark pb-5">
              <div class="image d-flex justify-content-center">
                <img src="/RDLOGOBGREMOVED.png" alt="Searching..." class="text-center" />
              </div>
              <CCardBody style="margin-top: -20px;" class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    Your Voice, Our Priority<br>Welcome To Grievance Management System
                    <!-- Now you can write your issues, ideads to the higher authorities. plaease move ahead..... -->
                    <!-- Your Voice, Our Priority<br>- R.D. Engineering College Grievance Redressal System -->
                    <!-- Speak Up, We Listen - R.D. Engineering College Grievance Management Portal -->
                    <!-- Empowering Voices, Ensuring Justice - R.D. Engineering College Grievance Management System -->
                  </p>
                  <CButton color="light" variant="outline" class="mt-3" @click="doSignUp" :disabled="loading">
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
import axios from 'axios';
import { mapActions } from 'vuex';
// import router from '@/router';
import { mapState } from 'pinia' // <-- 1. Import mapState from Pinia
import { useThemeStore } from '@/stores/theme' // <-- 2. Import your Pinia theme store (adjust path if needed)

export default {
  name: 'MemberLogin',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      errorMessage: '',
      successMessage: '',
      showForgotPassword: false,
      loading: false,
    };
  },
  computed: {
    ...mapState(useThemeStore, ['theme']), // This makes 'theme' available in your template
  },
  methods: {
    ...mapActions(['setUserId', 'setUserType', 'setIsVerified', 'setProfilePhoto', 'setUserName', 'setToken']),

    clearMessages() {
      setTimeout(() => {
        this.errorMessage = '';
        this.successMessage = '';
      }, 5000); // Messages will disappear after 5 seconds
    },

    togglePasswordVisibility(fieldName) {
      this[`show${fieldName}`] = !this[`show${fieldName}`];
    },

    async doLogin() {
      this.loading = true;
      this.errorMessage = ''; // Clear previous error messages
      try {
        const data = {
          email: this.email,
          password: this.password,
        };
        let url = import.meta.env.VITE_BASE_API + '/login';
        // console.log(url, 'url')

        // const response = await axios.post('http://localhost:3001/login', data);
        const response = await axios.post(url, data);
        if (response.data.success) {
          const userId = response.data.user._id;
          const userType = response.data.user.userType;
          const isVerified = response.data.user.isVerified;
          const profilePhoto = response.data.user.profilePhoto;
          const userName = response.data.user.firstName + ' ' + response.data.user.lastName;
          const token = response.data.token;
          // sessionStorage.setItem('token',token);
          this.setUserId(userId);
          this.setUserType(userType);
          this.setIsVerified(isVerified);
          this.setProfilePhoto(profilePhoto);
          this.setUserName(userName);
          this.setToken(token);
          // sessionStorage.setItem('_id', response.data.user._id);
          // sessionStorage.setItem('userType', response.data.user.userType);
          // sessionStorage.setItem('isVerified', response.data.user.isVerified);
          if (userType == 1) {
            this.$router.push({ name: 'Post Complaint' });
          } else if (userType == 2) {
            this.$router.push({ name: 'View Complaints' });
          } else {
            this.$router.push({ name: 'Manage Grievance Member' });
          }
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred during login';
      } finally {
        this.loading = false;
        this.clearMessages();
      }
    },
    doSignUp() {
      this.$router.push({ name: 'Sign Up' });
    },
    async forgotPassword() {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const data = { email: this.email };
        let url = import.meta.env.VITE_BASE_API + '/forgot-password';
        const response = await axios.post(url, data);

        if (response.data.success) {
          this.successMessage = 'A password reset link has been sent to your email.';
          this.email = ''; // Clear email field on success
        } else {
          // Use the message from the backend if available, otherwise a generic one
          this.errorMessage = response.data.message || 'Could not process request. Please try again.';
        }
      } catch (error) {
        // Use the error message from the backend if available
        this.errorMessage = error.response?.data?.message || 'An error occurred.';
      } finally {
        this.loading = false;
        this.clearMessages(); // Call clearMessages in the finally block to ensure it always runs.
      }
    }
  },
};
</script>

<style scoped>
.password-toggle {
  position: absolute;
  top: 55%;
  right: 11px;
  z-index: 10;
  transform: translateY(-50%);
  cursor: pointer;
}

/*.fas {
  font-size: 14px;
}*/

img {
  width: 130px;
}

.image {
  position: relative;
}
</style>