<template>
  <CContainer>
    <CRow class="mb-3">
      <CCol>
        <h4>Add New Complaint</h4>
      </CCol>
    </CRow>
    <CForm @submit.prevent="handleSubmit" class="row g-3">
      <CCol md="12">
        <CFormLabel class="fw-medium" for="category">Category</CFormLabel>
        <CFormSelect class="mt-2" v-model="category" name="category" required>
          <option value="" disabled selected>Select a category</option>
          <option value="Grievance related to admission">Grievance related to Admission</option>
          <option value="Grievance related to victimization">Grievance related to Victimization</option>
          <option value="Grievance related to attendance">Grievance related to Attendance</option>
          <option value="Grievance related to charging of fees">Grievance related to charging of fees</option>
          <option value="Grievance regarding non-transparent or unfair evaluation process">
            Grievance regarding non-transparent or unfair evaluation process
          </option>
          <option value="Non-observation of AICTE norms and standards">Non-observation of AICTE norms and standards
          </option>
          <option value="Refusal to return documents such as certificates">Refusal to return documents such as
            certificates</option>
          <option value="Harassment by fellow students or teachers">Harassment by fellow students or teachers</option>
          <option
            value="Grievance related to provision of student amenities and quality education as promised or required to be provided">
            Grievance related to provision of student amenities and quality education as promised or required to be
            provided
          </option>
          <option value="Non-payment or delay in payment of scholarships">Non-payment or delay in payment of
            scholarships</option>
          <option value="Complaints on discrimination by students from SC/ST/Minority Women/Disabled Categories">
            Complaints on discrimination by students from SC/ST/Minority Women/Disabled Categories
          </option>
          <option value="Grievance related to timetable scheduling">Grievance related to timetable scheduling</option>
          <option value="Violation of lab/library rules">Violation of lab/library rules</option>
          <option value="Not understanding of a subject">Not understanding of a subject</option>
          <option value="Problem with faculty">Problem with faculty</option>
        </CFormSelect>
      </CCol>
      <CCol md="12">
        <CFormLabel class="fw-medium" for="complaintRecipient">To whom you want to complaint</CFormLabel>
        <CFormSelect class="mt-2" v-model="complaintRecipient" required>
          <option value="" disabled selected>Select a recipient</option>
          <option v-for="(member, index) in members" :key="index" :value="member._id">
            {{ member.firstName }} {{ member.lastName }}
          </option>
        </CFormSelect>
      </CCol>
      <CCol md="12">
        <CFormLabel class="fw-medium" for="description">Add Description</CFormLabel>
        <CFormTextarea id="description" class="mt-2" name="description" placeholder="Enter Complaint Description"
          v-model="description" rows="8" required />
      </CCol>
      <CCol md="12">
        <CFormLabel class="fw-medium" for="document">Select Document (if Any)</CFormLabel>
        <input type="file" class="form-control mt-2" ref="file" name="document" />
      </CCol>
      <CCol md="12">
        <CFormLabel class="fw-medium" for="priority">Priority</CFormLabel>
        <CFormSelect class="mt-2" v-model="priority" name="priority" required>
          <option value="" disabled selected>Select priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </CFormSelect>
      </CCol>
      <CCol md="12">
        <CFormLabel class="fw-medium" for="anonymous">Do you want to hide your identity ?</CFormLabel>
        <CFormCheck id="anonymous" label="Yes" class="mt-2" v-model="anonymous" style="font-size: 20px"/>
      </CCol>
      <CCol class="d-flex justify-content-center gap-4 my-5">
        <CButton class="px-3 text-white" type="button" color="danger" @click="cancelAdd">Cancel</CButton>
        <CButton class="px-3" type="submit" color="dark" :disabled="isSubmitting">Submit Complaint</CButton>
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

export default {
  name: 'AddComplaint',
  data() {
    return {
      category: '',
      complaintRecipient: '',
      description: '',
      members: [],
      document: '',
      priority: '',
      anonymous: false,
      successMessage: '',
      isSubmitting: false,
    };
  },
  computed: {
    ...mapState(['_id','token']),
  },
  methods: {
    async handleSubmit() {
      this.isSubmitting = true;
      try {
        const header = {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-Data',
          },
        };

        let data = new FormData();
        data.append('category', this.category);
        data.append('complaintRecipient', this.complaintRecipient);
        data.append('description', this.description);
        data.append('priority', this.priority);
        data.append('complaintBy', this._id);
        data.append('anonymous', this.anonymous);

        if (this.$refs.file.files[0]) {
          data.append('file', this.$refs.file.files[0]);
        } else {
          data.append('file', '');
        }

        // const response = await axios.post('http://localhost:3001/complaintAdd', data, header);
        let url = process.env.BASE_API + '/complaintAdd';
        const response = await axios.post(url, data, header);
        if (response.status === 200) {
          this.successMessage = `Complaint ${response.data.data.complaintId} added successfully!`;
        }

        this.category = '';
        this.complaintRecipient = '';
        this.description = '';
        this.priority = '';
        this.anonymous = false;

        setTimeout(() => {
          this.successMessage = '';
          this.$router.push({ name: 'Post Complaint' });
        }, 2000);
      } catch (error) {
        console.log('Error adding complaint:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    cancelAdd() {
      this.$router.push({ name: 'Post Complaint' });
    },
    async fetchMembers() {
      try {
        let url = process.env.BASE_API + '/get/grievance-members'
        // const response = await axios.get('http://localhost:3001/get/grievance-members');
        const response = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
        this.members = response.data.data;
      } catch (err) {
        console.log(err.message);
      }
    },
  },
  mounted() {
    this.fetchMembers();
  },
};
</script>

<style scoped>
/*.select-cat {
  font-weight: bold;
  font-size: 1.1rem;
}

.desc-box {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

button {
  color: white;
}*/

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
