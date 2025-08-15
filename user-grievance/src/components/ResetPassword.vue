<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center pt-3">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :lg="8">
          <CCardGroup>
            <!-- ========= RESET PASSWORD FORM CARD ========= -->
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="resetPassword">
                  <h1>Reset Password</h1>
                  <p class="text-body-secondary">Enter your new password</p>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput :type="showNewPassword ? 'text' : 'password'" placeholder="New Password"
                      v-model="password" required />
                    <span class="password-toggle">
                      <font-awesome-icon :icon="showNewPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'"
                        @click="togglePasswordVisibility('NewPassword')" />
                    </span>
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm New Password"
                      v-model="confirmPassword" required />
                    <span class="password-toggle">
                      <font-awesome-icon :icon="showConfirmPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'"
                        @click="togglePasswordVisibility('ConfirmPassword')" />
                    </span>
                  </CInputGroup>

                  <div class="d-grid">
                    <CButton color="info" style="color: white" type="submit" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm" role="status"
                        aria-hidden="true"></span>
                      <span v-if="loading"> Resetting...</span>
                      <span v-else>Reset Password</span>
                    </CButton>
                  </div>

                  <CAlert v-if="successMessage" color="success" class="mt-3">{{ successMessage }}</CAlert>
                  <CAlert v-if="errorMessage" color="danger" class="mt-3">{{ errorMessage }}</CAlert>
                </CForm>
              </CCardBody>
            </CCard>

            <!-- ========= INFO CARD ========= -->
            <CCard class="text-white bg-dark pb-5">
              <div class="image d-flex justify-content-center">
                <img src="/RDLOGOBGREMOVED.png" alt="Logo" class="text-center" />
              </div>
              <CCardBody style="margin-top: -20px" class="text-center">
                <div>
                  <h2>Password Secured</h2>
                  <p>
                    Choose a strong, new password to protect your account. Once you're done, you can log in again.
                  </p>
                  <CButton color="light" variant="outline" class="mt-3" @click="goToLogin" :disabled="loading">
                    Back to Login
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

export default {
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      confirmPassword: '',
      showNewPassword: false,
      showConfirmPassword: false,
      successMessage: '',
      errorMessage: '',
      loading: false,
    };
  },
  methods: {
    togglePasswordVisibility(fieldName) {
      // Toggles the visibility for the specified password field
      this[`show${fieldName}`] = !this[`show${fieldName}`];
    },

    goToLogin() {
      this.$router.push({ name: 'Member Login' });
    },

    async resetPassword() {
      // Clear previous messages
      this.errorMessage = '';
      this.successMessage = '';

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      this.loading = true;
      const token = this.$route.query.resetToken;

      if (!token) {
        this.errorMessage = 'Invalid or missing reset token.';
        this.loading = false;
        return;
      }

      try {
        const url = `${import.meta.env.VITE_BASE_API}/user/reset-password`;
        const response = await axios.post(url, {
          token,
          newPassword: this.password,
        });

        if (response.data.success) {
          this.successMessage = response.data.message;
          this.errorMessage = '';
          // Redirect to login page after 3 seconds
          setTimeout(() => this.$router.push({ name: 'Member Login' }), 3000);
        } else {
          this.errorMessage = response.data.message;
          this.successMessage = '';
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred while resetting the password.';
        this.successMessage = '';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Scoped styles from MemberLogin for consistency */
.password-toggle {
  position: absolute;
  /* Adjust based on your input field's height */
  top: 50%;
  right: 11px;
  z-index: 10;
  transform: translateY(-50%);
  cursor: pointer;
}

img {
  width: 130px;
}

.image {
  position: relative;
}

/* Ensure wrapper fills the screen */
.wrapper {
  background-color: #f0f3f5;
  /* Or your preferred background color */
}
</style>