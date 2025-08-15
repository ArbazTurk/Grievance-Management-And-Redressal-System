<template>
  <CContainer>
    <CRow class="mb-3">
      <CCol>
        <h4>Resolve Complaint</h4>
      </CCol>
    </CRow>
    <CForm @submit.prevent="updateComplaint" class="row g-3">
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="category">Category</CFormLabel>
        <CFormInput class="mt-2" id="category" v-model="complaint.category" readonly disabled/>
        <!-- <CFormSelect class="mt-2" id="category" v-model="complaint.category" readonly>
          <option value="" disabled>Select a category</option>
          <option value="Grievance related to admission">Grievance related to Admission</option>
          <option value="Grievance related to victimization">Grievance related to Victimization</option>
          <option value="Grievance related to attendance">Grievance related to Attendance</option>
          <option value="Grievance related to charging of fees">Grievance related to charging of fees</option>
          <option value="Grievance regarding non-transparent or unfair evaluation process">
            Grievance regarding non-transparent or unfair evaluation process
          </option>
          <option value="Non-observation of AICTE norms and standards">Non-observation of AICTE norms and standards</option>
          <option value="Refusal to return documents such as certificates">Refusal to return documents such as certificates</option>
          <option value="Harassment by fellow students or teachers">Harassment by fellow students or teachers</option>
          <option value="Grievance related to provision of student amenities and quality education as promised or required to be provided">
            Grievance related to provision of student amenities and quality education as promised or required to be provided
          </option>
          <option value="Non-payment or delay in payment of scholarships">Non-payment or delay in payment of scholarships</option>
          <option value="Complaints on discrimination by students from SC/ST/Minority Women/Disabled Categories">
            Complaints on discrimination by students from SC/ST/Minority Women/Disabled Categories
          </option>
          <option value="Grievance related to timetable scheduling">Grievance related to timetable scheduling</option>
          <option value="Violation of lab/library rules">Violation of lab/library rules</option>
        </CFormSelect> -->
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="priority">Priority</CFormLabel>
        <CFormInput class="mt-2" id="priority" v-model="complaint.priority" readonly disabled/>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="document">Supporting Document</CFormLabel>
        <CLink class="d-block mt-2 px-3" :href="complaint.document" target="_blank" v-if="complaint.document">
          View Document
        </CLink>
        <span class="d-block mt-2 px-3" v-else>N/A</span>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="status">Status</CFormLabel>
        <CFormInput class="mt-2" id="status" v-model="complaint.complaintStatus" readonly disabled/>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="description">Complaint Description</CFormLabel>
        <CFormTextarea id="description" class="mt-2" name="description"
          v-model="complaint.description[0]" rows="8" readonly disabled/>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="remarks">Add Your Remarks</CFormLabel>
        <CFormTextarea id="remarks" class="mt-2" name="remarks" placeholder="Enter your remarks here"
          v-model="complaint.remarks[0]" rows="8" required/>
      </CCol>
      <CCol xs="12" class="d-flex justify-content-center gap-4 my-5">
        <CButton class="px-3 text-white" type="button" color="danger" @click="cancelEdit">Cancel</CButton>
        <CButton class="px-3" type="submit" :color="theme === 'light' ? 'dark' : 'light'" variant="outline">Update</CButton>
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
import { mapState as piniaMapState } from 'pinia';
import { useThemeStore } from '@/stores/theme';

export default {
  name: 'ResolveComplaint',
  computed: {
    ...piniaMapState(useThemeStore, ['theme']),
  },
  data() {
    return {
      complaint: {
        category: '',
        description: '',
        priority: '',
        complaintStatus: '',
        remarks: '',
        document: '',
      },
      successMessage: '',
    };
  },
  methods: {
    async fetchComplaint() {
      try {
        let url = import.meta.env.VITE_BASE_API + '/complaint/get/complaint/' + this.$route.params.id
        // const response = await axios.get(`http://localhost:3001/complaint/get/complaint/${this.$route.params.id}`);
        const response = await axios.get(url);
        this.complaint = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async updateComplaint() {
      try {
        // const formData = new FormData();
        // formData.append('category', this.complaint.category);
        // formData.append('description', this.complaint.description);
        // formData.append('priority', this.complaint.priority);
        // formData.append('complaintStatus', this.complaint.complaintStatus);
        // formData.append('remarks', this.complaint.remarks);
        // formData.append('document', this.complaint.document);

        // const response = await axios.put(`http://localhost:3001/complaint/update/complaint/${this.$route.params.id}`, formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // });
        let url = import.meta.env.VITE_BASE_API + '/complaint/update/complaint/' + this.$route.params.id
        // const response = await axios.put(`http://localhost:3001/complaint/update/complaint/${this.$route.params.id}`, {remarks:this.complaint.remarks[0]});
        const response = await axios.put(url, {remarks:this.complaint.remarks[0]});
        if (response.status === 200) {
          this.successMessage = `Complaint ${response.data.complaintId} updated successfully!`;
          setTimeout(() => {
            this.successMessage = '';
            this.$router.push({ name: 'View Complaints' });
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    },
    cancelEdit() {
      this.$router.push({ name: 'View Complaints' });
    },
  },
  mounted() {
    this.fetchComplaint();
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
