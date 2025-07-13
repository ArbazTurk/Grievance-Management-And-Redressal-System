<template>
  <CContainer>
    <CModal style="color: #d9534f;" :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>Password Mismatch Error</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h6>The new password and confirm password do not match. Please try again.</h6>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">
          Close
        </CButton>
      </CModalFooter>
    </CModal>
    <CRow class="mb-4">
      <CCol>
        <h4>Change Password</h4>
      </CCol>
    </CRow>
    <CForm @submit.prevent="changePassword">
      <CRow class="my-3">
        <CCol xs="12">
          <CFormLabel class="fw-medium" for="currentPassword">Current Password</CFormLabel>
          <div class="password-input-container">
            <CFormInput :type="showCurrentPassword ? 'text' : 'password'" class="mt-2 p-2" id="currentPassword"
              v-model="formData.currentPassword" required />
            <span class="password-toggle">
              <font-awesome-icon :icon="showCurrentPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'"
                @click="togglePasswordVisibility('CurrentPassword')" />
            </span>
          </div>
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol xs="12">
          <CFormLabel class="fw-medium" for="newPassword">New Password</CFormLabel>
          <div class="password-input-container">
            <CFormInput :type="showNewPassword ? 'text' : 'password'" class="mt-2 p-2" id="newPassword"
              v-model="formData.newPassword" required minlength="6" />
            <span class="password-toggle">
              <font-awesome-icon :icon="showNewPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'"
                @click="togglePasswordVisibility('NewPassword')" />
            </span>
          </div>
          <p class="text-danger">Password must be at least 6 characters long.</p>
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol xs="12">
          <CFormLabel class="fw-medium" for="confirmPassword">Confirm New Password</CFormLabel>
          <div class="password-input-container">
            <CFormInput :type="showConfirmPassword ? 'text' : 'password'" class="mt-2 p-2" id="confirmPassword"
              v-model="formData.confirmPassword" required />
            <span class="password-toggle">
              <font-awesome-icon :icon="showConfirmPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'"
                @click="togglePasswordVisibility('ConfirmPassword')" />
            </span>
          </div>
          <p class="text-danger">Passwords must match.</p>
        </CCol>
      </CRow>
      <CRow class="my-3">
        <CCol xs="12" class="text-end">
          <CButton type="submit" :color="theme === 'light' ? 'dark' : 'light'" variant="outline" >Change Password
          </CButton>
        </CCol>
      </CRow>
      <transition name="slide-fade">
        <CAlert v-if="successMessage" color="success" class="d-flex align-items-center mt-2 p-2 alert-slide">
          <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />
          {{ successMessage }}
        </CAlert>
      </transition>
      <transition name="slide-fade">
        <CAlert v-if="errorMessage" color="danger" class="d-flex align-items-center mt-2 p-2 alert-slide">
          <CIcon icon="cil-x-circle" class="flex-shrink-0 me-2" width="24" height="24" />
          {{ errorMessage }}
        </CAlert>
      </transition>
    </CForm>
  </CContainer>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { mapState as piniaMapState } from 'pinia';
import { useThemeStore } from '@/stores/theme';
export default {
  name: 'ChangePassword',
  data() {
    return {
      formData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      //newPasswordValid: false,
      confirmPasswordValid: false,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      successMessage: '',
      errorMessage: '',
      showModal: false,
    };
  },
  computed: {
    ...mapState(['_id', 'token']),
    ...piniaMapState(useThemeStore, ['theme']),
  },
  methods: {
    togglePasswordVisibility(fieldName) {
      this[`show${fieldName}`] = !this[`show${fieldName}`];
    },
    changePassword() {
      // this.newPasswordValid = this.formData.newPassword.length >= 6;
      this.confirmPasswordValid = this.formData.newPassword === this.formData.confirmPassword;
      let url = import.meta.env.VITE_BASE_API + '/change/password/' + this._id
      //axios.put(`http://localhost:3001/change/password/${this._id}`, this.formData)
      if (this.confirmPasswordValid) {
        axios.put(url, this.formData, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
          .then((response) => {
            this.successMessage = response.data.message;
            this.formData = {
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            };
            // this.newPasswordValid = false;
            this.confirmPasswordValid = false;
            setTimeout(() => {
              this.successMessage = '';
            }, 2000);
          })
          .catch((error) => {
            this.errorMessage = error.response.data.message;
            setTimeout(() => {
              this.errorMessage = '';
            }, 2000);
            console.error('Error:', error);
          });
      } else {
        this.showModal = true;
      }
    },
  },
};
</script>

<style scoped>
.password-input-container {
  position: relative;
  display: flex;
}

.password-toggle {
  position: absolute;
  top: 55%;
  right: 14px;
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
</style>
