<template>
  <CContainer>
    <CRow class="mb-3">
      <CCol>
        <h4>Edit User</h4>
      </CCol>
    </CRow>
    <CForm @submit.prevent="updateUser" class="row g-3">
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="firstName">First Name</CFormLabel>
        <CFormInput id="firstName" v-model="user.firstName" readonly disabled class="mt-2" />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="lastName">Last Name</CFormLabel>
        <CFormInput id="lastName" v-model="user.lastName" readonly disabled class="mt-2" />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="email">Email</CFormLabel>
        <CFormInput id="email" v-model="user.email" readonly disabled class="mt-2" />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="mobileNo">Mobile No</CFormLabel>
        <CFormInput id="mobileNo" v-model="user.mobileNo" readonly disabled class="mt-2" />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="status">Status</CFormLabel>
        <CFormSelect id="status" v-model="user.status" class="mt-2">
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </CFormSelect>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="isVerified">Verification Status</CFormLabel>
        <CFormSelect id="isVerified" v-model="user.isVerified" class="mt-2">
          <option value='Verified'>Verified</option>
          <option value='Not Verified'>Not Verified</option>
        </CFormSelect>
        <!-- <CFormSwitch id="isVerified" v-model="user.isVerified" class="mt-2" /> -->
      </CCol>
      <CCol xs="12" class="d-flex justify-content-center gap-4 my-5">
        <CButton class="px-3 text-white" type="button" color="danger" @click="cancelEdit">Cancel</CButton>
        <CButton class="px-4" type="submit" :color="theme === 'light' ? 'dark' : 'light'" variant="outline">Save</CButton>
      </CCol>
    </CForm>
    <transition name="slide-fade">
      <CAlert v-if="successMessage" color="success" class="d-flex align-items-center mt-2 alert-slide">
        <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />
        {{ successMessage }}
      </CAlert>
    </transition>
  </CContainer>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { mapState as piniaMapState } from 'pinia';
import { useThemeStore } from '@/stores/theme';

export default {
  name: 'EditUser',
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        status: '',
        isVerified: '',
      },
      successMessage: '',
    };
  },
  computed: {
    ...mapState(['token']),
    ...piniaMapState(useThemeStore, ['theme']),
  },
  methods: {
    async fetchUser() {
      try {
        let url = import.meta.env.VITE_BASE_API + '/get/user/' + this.$route.params.id
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        // const response = await axios.get(`http://localhost:3001/get/user/${this.$route.params.id}`);
        this.user = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async updateUser() {
      try {
        let url = import.meta.env.VITE_BASE_API + '/update/user/' + this.$route.params.id
        const response = await axios.put(url, {
          status: this.user.status,
          // const response = await axios.put(`http://localhost:3001/update/user/${this.$route.params.id}`, { status: this.user.status,
          isVerified: this.user.isVerified,
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        if (response.status === 200) {
          this.successMessage = 'User updated successfully!';
        }

        setTimeout(() => {
          this.successMessage = '';
          this.$router.push({ name: 'Manage User' });
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    },
    cancelEdit() {
      this.$router.push({ name: 'Manage User' });
    },
  },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style scoped>
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