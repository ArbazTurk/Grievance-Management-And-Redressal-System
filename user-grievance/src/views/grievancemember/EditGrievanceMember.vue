<template>
  <CContainer>
    <CRow class="mb-3">
      <CCol>
        <h4>Edit Grievance Member</h4>
      </CCol>
    </CRow>
    <CForm @submit.prevent="updateMember" class="row g-3">
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="firstName">First Name</CFormLabel>
        <CFormInput id="firstName" v-model="member.firstName" readonly disabled class="mt-2" />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="lasttName">Last Name</CFormLabel>
        <CFormInput id="lastName" v-model="member.lastName" readonly disabled class="mt-2" />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="email">Email</CFormLabel>
        <CFormInput id="email" v-model="member.email" readonly disabled class="mt-2" />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="profile">Profile</CFormLabel>
        <CFormInput id="profile" v-model="member.profile" readonly disabled class="mt-2" />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="status">Status</CFormLabel>
        <CFormSelect id="status" v-model="member.status" class="mt-2">
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </CFormSelect>
      </CCol>
      <CCol xs="12" class="d-flex justify-content-center gap-4 my-5">
        <CButton class="px-3 text-white" type="button" color="danger" @click="cancelEdit">Cancel</CButton>
        <CButton class="px-4" type="submit" color="dark">Save</CButton>
      </CCol>
    </CForm>
    <transition name="slide-fade">
      <CAlert v-if="successMessage" color="success" class="d-flex align-items-center mt-2 alert-slide">
        <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />
        {{ successMessage }}
      </CAlert>
    </transition>
    <!-- <CAlert v-if="successMessage" color="success" class="mt-1 p-2">
        {{ successMessage }}
      </CAlert> -->
  </CContainer>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'EditGrievanceMember',
  data() {
    return {
      member: {
        name: '',
        email: '',
        profile: '',
        status: '',
      },
      successMessage: '',
    };
  },
  computed: {
    ...mapState(['token']),
  },
  methods: {
    async fetchMember() {
      try {
        let url = process.env.BASE_API + '/get/grievance-member/' + this.$route.params.id
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        // const response = await axios.get(`http://localhost:3001/get/grievance-member/${this.$route.params.id}`);
        this.member = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async updateMember() {
      try {
        let url = process.env.BASE_API + '/update/grievance-member/' + this.$route.params.id
        const response = await axios.put(url, { status: this.member.status }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        // const response = await axios.put(`http://localhost:3001/update/grievance-member/${this.$route.params.id}`, { status: this.member.status });
        if (response.status === 200) {
          this.successMessage = 'Grievance member updated successfully!';
        }

        setTimeout(() => {
          this.successMessage = '';
          this.$router.push({ name: 'Manage Grievance Member' });
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    },
    cancelEdit() {
      this.$router.push({ name: 'Manage Grievance Member' });
    },
  },
  mounted() {
    this.fetchMember();
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