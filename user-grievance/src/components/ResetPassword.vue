<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <CCard style="width: 50rem;">
      <CCardBody>
        <h2 class="text-center">Reset Password</h2>
        <CForm @submit.prevent="resetPassword">
          <CInputGroup class="mb-4">
            <CInputGroupText>
              <CIcon icon="cil-lock-locked" />
            </CInputGroupText>
            <CFormInput type="password" placeholder="New Password" v-model="password" required />
          </CInputGroup>
          <CInputGroup class="mb-4">
            <CInputGroupText>
              <CIcon icon="cil-lock-locked" />
            </CInputGroupText>
            <CFormInput type="password" placeholder="Confirm New Password" v-model="confirmPassword" required />
          </CInputGroup>
          <div class="d-grid">
            <CButton color="primary" type="submit">Reset Password</CButton>
          </div>
        </CForm>
        <CAlert v-if="successMessage" color="success" class="mt-3">{{ successMessage }}</CAlert>
        <CAlert v-if="errorMessage" color="danger" class="mt-3">{{ errorMessage }}</CAlert>
      </CCardBody>
    </CCard>
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
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    async resetPassword() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }
      const token = this.$route.query.resetToken;
      console.log(token);
      try {
        const url = `${process.env.BASE_API}/reset-password`;
        const response = await axios.post(url, {
          token,
          newPassword: this.password,
        });
        if (response.data.success) {
          this.successMessage = response.data.message;
          this.errorMessage = '';
          setTimeout(() => this.$router.push({ name: 'Member Login' }), 3000);
        } else {
          this.errorMessage = response.data.message;
          this.successMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred while resetting the password.';
        this.successMessage = '';
        console.error(error);
      }
    },
  },
};
</script>