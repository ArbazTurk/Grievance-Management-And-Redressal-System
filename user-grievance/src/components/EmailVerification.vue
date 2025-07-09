<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <CCard style="width: 50rem;">
      <CCardBody>
        <div v-if="loading" class="text-center">
          <CSpinner color="primary" />
          <p class="mt-2">Verifying your email...</p>
        </div>
        <div v-if="!loading && successMessage" class="text-center text-success">
          <CIcon icon="cil-check-circle" size="4xl" />
          <h2 class="mt-3">Email Verified!</h2>
          <p>{{ successMessage }}</p>
          <CButton color="primary" @click="goToLogin">Go to Login</CButton>
        </div>
        <div v-if="!loading && errorMessage" class="text-center text-danger">
          <CIcon icon="cil-x-circle" size="4xl" />
          <h2 class="mt-3">Verification Failed</h2>
          <p>{{ errorMessage }}</p>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EmailVerification',
  data() {
    return {
      loading: true,
      successMessage: '',
      errorMessage: '',
    };
  },
  async mounted() {
    const token = this.$route.query.verifyToken;
    if (token) {
      try {
        const url = `${process.env.BASE_API}/verify-email`;
        const response = await axios.post(url,{token});
        if (response.data.success) {
          this.successMessage = response.data.message;
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        this.errorMessage = 'An error occurred during email verification.';
        console.error(error);
      }
      this.loading = false;
    }
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Member Login' });
    }
  }
};
</script>