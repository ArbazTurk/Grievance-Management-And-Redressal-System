<template>
  <CContainer>
    <CRow class="mb-3">
      <CCol>
        <h4>Add Grievance Member</h4>
      </CCol>
    </CRow>
    <CForm @submit.prevent="handleSubmit" class="row g-3">
      <CCol md="12">
        <CFormLabel class="fw-medium" for="firstName">First Name</CFormLabel>
        <CFormInput class="mt-2" type="text" id="firstName" v-model="firstName" placeholder="Enter First Name"
          required />
      </CCol>
      <CCol md="12">
        <CFormLabel class="fw-medium" for="lastName">Last Name</CFormLabel>
        <CFormInput class="mt-2" type="text" id="lastName" v-model="lastName" placeholder="Enter Last Name" required />
      </CCol>
      <CCol md="12">
        <CFormLabel class="fw-medium" for="email">Email ID</CFormLabel>
        <CFormInput class="mt-2" type="email" id="email" v-model="email" placeholder="Enter email" required />
      </CCol>
      <CCol md="12">
        <CFormLabel class="fw-medium" for="mobileNo">Mobile No.</CFormLabel>
        <CFormInput class="mt-2" type="tel" id="mobileNo" v-model="mobileNo" placeholder="Enter Mobile Number"
          required />
      </CCol>
      <CCol md="12">
        <CFormLabel class="fw-medium" for="profile">Profile</CFormLabel>
        <CFormSelect class="mt-2" id="profile" v-model="profile" required>
          <option value="" disabled selected>Select a profile</option>
          <option value="Dean Academics">Dean Academics</option>
          <option value="Director">Director</option>
          <option value="Deputy Director">Deputy Director</option>
          <option value="President">President</option>
          <option value="Others">Others</option>
        </CFormSelect>
      </CCol>
      <CCol class="d-flex justify-content-center gap-4 my-5">
        <CButton class="px-3 text-white" type="button" color="danger" @click="cancelAdd">Cancel</CButton>
        <CButton class="px-3" type="submit" :color="theme === 'light' ? 'dark' : 'light'"
          variant="outline" >Add Member</CButton>
      </CCol>
    </CForm>
    <transition name="slide-fade">
      <CAlert v-if="successMessage" color="success" class="d-flex align-items-center mt-2 alert-slide">
        <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />
        {{ successMessage }}
      </CAlert>
    </transition>
    <!-- <CAlert v-if="successMessage" color="success" class="mt-2 p-2">
        {{ successMessage }}
      </CAlert> -->
  </CContainer>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { mapState as piniaMapState } from 'pinia';
import { useThemeStore } from '@/stores/theme';

export default {
  name: 'AddGrievanceMember',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      mobileNo: '',
      password: '123456',
      userType: 2,
      profile: '',
      successMessage: ''
    };
  },
  computed: {
    ...mapState(['token']),
    ...piniaMapState(useThemeStore, ['theme']),
  },
  methods: {
    async handleSubmit() {
      try {
        let url = import.meta.env.VITE_BASE_API + '/admin/add/grievance-member'
        //const response = await axios.post('http://localhost:3001/admin/add/grievance-member', {
        const response = await axios.post(url, {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          mobileNo: this.mobileNo,
          password: this.password,
          userType: this.userType,
          profile: this.profile
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        if (response.status === 201) {
          this.successMessage = 'Grievance member added successfully!';
        }

        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.mobileNo = '';
        this.profile = '';

        setTimeout(() => {
          this.successMessage = '';
          this.$router.push({ name: 'Manage Grievance Member' });
        }, 2000);
      } catch (error) {
        console.error('Error adding grievance member:', error);
      }
    },
    cancelAdd() {
      this.$router.push({ name: 'Manage Grievance Member' });
    }
  }
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
