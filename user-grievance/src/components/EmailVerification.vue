<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center pt-3">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :lg="8">
          <CCardGroup>
            <!-- ========= VERIFICATION STATUS CARD ========= -->
            <CCard class="p-4" style="min-height: 350px;">
              <CCardBody class="d-flex flex-column justify-content-center text-center">
                <!-- Loading State -->
                <div v-if="loading">
                  <CSpinner color="primary" style="width: 3rem; height: 3rem" />
                  <h4 class="mt-3 text-body-secondary">Verifying your email...</h4>
                  <p class="text-body-secondary">Please wait a moment.</p>
                </div>

                <!-- Success State -->
                <div v-if="!loading && successMessage">
                  <CIcon icon="cil-check-circle" class="text-success" width="64" height="64" />
                  <h2 class="mt-3">Email Verified!</h2>
                  <p class="text-body-secondary">{{ successMessage }}</p>
                  <div class="d-grid gap-2 col-6 mx-auto mt-3">
                    <CButton color="success" style="color: white" @click="goToLogin">
                      Proceed to Login
                    </CButton>
                  </div>
                </div>

                <!-- Error State -->
                <div v-if="!loading && errorMessage">
                  <CIcon icon="cil-x-circle" class="text-danger" width="64" height="64" />
                  <h2 class="mt-3">Verification Failed</h2>
                  <p class="text-body-secondary">
                    {{ errorMessage }}<br />
                    This link may be invalid or expired.
                  </p>
                  <div class="d-grid gap-2 col-6 mx-auto mt-3">
                    <CButton color="primary" variant="outline" @click="goToLogin">
                      Back to Login
                    </CButton>
                  </div>
                </div>
              </CCardBody>
            </CCard>

            <!-- ========= INFO CARD (for consistency) ========= -->
            <CCard class="text-white bg-dark pb-5">
              <div class="image d-flex justify-content-center">
                <img src="/RDLOGOBGREMOVED.png" alt="Logo" class="text-center" />
              </div>
              <CCardBody style="margin-top: -20px" class="text-center">
                <div>
                  <h2>A Secure Start</h2>
                  <p>
                    We verify every user's email to ensure the security and integrity of our community. Thank you for
                    completing this step.
                  </p>
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
    if (!token) {
      this.errorMessage = 'Verification token is missing. Please use the link from your email.';
      this.loading = false;
      return;
    }

    try {
      const url = `${import.meta.env.VITE_BASE_API}/verify-email`;
      const response = await axios.post(url, { token });
      if (response.data.success) {
        this.successMessage = response.data.message || 'Your account has been successfully verified.';
      } else {
        this.errorMessage = response.data.message || 'Could not verify your email.';
      }
    } catch (error) {
      this.errorMessage = error.response?.data?.message || 'An error occurred during verification.';
      console.error(error);
    } finally {
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

<style scoped>
/* Styles for consistency with your login/reset pages */
img {
  width: 130px;
}

.image {
  position: relative;
}

.wrapper {
  background-color: #f0f3f5;
  /* Or your preferred app background color */
}
</style>