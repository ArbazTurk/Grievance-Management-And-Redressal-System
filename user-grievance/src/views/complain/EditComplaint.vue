<template>
  <CContainer>
    <CRow class="mb-3">
      <CCol>
        <h4>Edit Complaint</h4>
      </CCol>
    </CRow>
    <CRow v-if="isResolved" class="mb-3">
      <CCol>
        <h5 style="color:green">Since this complain has been resolved therfore No fruther updation is allowed for this
          complaint</h5>
      </CCol>
    </CRow>
    <CForm class="row g-3">
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="category">Category</CFormLabel>
        <CFormSelect class="mt-2" id="category" v-model="complaint.category">
          <option value="" disabled>Select a category</option>
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
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="description">Description</CFormLabel>
        <CFormTextarea id="description" class="mt-2" name="description" placeholder="Enter Complaint Description"
          v-model="complaint.description[0]" rows="8" />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="priority">Priority</CFormLabel>
        <CFormSelect id="priority" class="mt-2" v-model="complaint.priority">
          <option value="" disabled>Select priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </CFormSelect>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="status">Status</CFormLabel>
        <CFormSelect id="status" class="mt-2" v-model="complaint.complaintStatus">
          <option value="Pending">Pending</option>
          <option value="InProgress">InProgress</option>
          <option value="Resolved">Resolved</option>
        </CFormSelect>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="document">Select Document (if Any)</CFormLabel>
        <input type="file" class="form-control mt-2" ref="file" name="document" />
      </CCol>
      <CCol v-if="!isResolved" xs="12" class="d-flex justify-content-center gap-4 my-5">
        <CButton class="px-3 text-white" type="button" color="danger" @click="cancelEdit">Cancel</CButton>
        <!-- <CButton class="px-3" type="submit" color="dark" :disabled="isSubmitting">Update</CButton> -->
        <CButton class="px-3" type="button" color="dark"
          @click="complaint.complaintStatus === 'Resolved' ? showModal = true : updateComplaint()">Update</CButton>
      </CCol>
      <CCol v-else xs="12" class="d-flex justify-content-center gap-4 my-5">
        <CButton class="px-3 text-white" type="button" color="danger" @click="cancelEdit">Cancel</CButton>
      </CCol>
    </CForm>
    <transition name="slide-fade">
      <CAlert v-if="successMessage" color="success" class="d-flex align-items-center mt-2 alert-slide">
        <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />
        {{ successMessage }}
      </CAlert>
    </transition>
    <CModal style="color: black;" :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>Ratings</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h6>Please give your rating for this complain based on its resolution</h6>
        <CRow>
          <CCol>
            <CFormInput type="number" label="Minimum Rating= 1, Maximum Rating= 5" v-model="rating"
              placeholder="Enter Rating" :min="1" :max="5" aria-label="default input example"
              :invalid="rating < 1 || rating > 5" />
            <CFormFeedback invalid>Rating must be between 1 and 5</CFormFeedback>
          </CCol>
        </CRow>
        <div class="d-grid gap-2 d-md-flex mt-3 justify-content-md-start">
          <CButton color="dark" @click="updateComplaint()" :disabled="rating < 1 || rating > 5">Proceed to update
          </CButton>
        </div>
      </CModalBody>
      <!-- <CModalFooter>
        <CButton color="secondary" @click="showModal = false">
          Close
        </CButton>
      </CModalFooter> -->
    </CModal>
  </CContainer>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'EditComplaint',
  data() {
    return {
      complaint: {
        category: '',
        description: [''],
        priority: '',
        complaintStatus: '',
        document: '',
      },
      successMessage: '',
      isSubmitting: false,
      rating: 1,
      showModal: false,
      isResolved: false
    };
  },
  computed: {
    ...mapState(['token']),
  },
  methods: {
    async fetchComplaint() {
      try {
        let url = process.env.BASE_API + '/get/complaint/' + this.$route.params.id
        const response = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
        //const response = await axios.get(`http://localhost:3001/get/complaint/${this.$route.params.id}`);
        this.complaint = response.data;
        if (response.data.complaintStatus === 'Resolved') {
          this.isResolved = true
        } else {
          this.isResolved = false
        }

      } catch (error) {
        console.error(error);
      }
    },
    async updateComplaint() {
      let response = '';
      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append('category', this.complaint.category);
        formData.append('description', this.complaint.description[0]);
        formData.append('priority', this.complaint.priority);
        formData.append('complaintStatus', this.complaint.complaintStatus);
        if (this.rating !== 1) {
          formData.append('rating', this.rating);
        }
        if (this.$refs.file.files[0]) {
          formData.append('file', this.$refs.file.files[0]);
        } else {
          formData.append('file', this.complaint.document);
        }
        let url = process.env.BASE_API + '/update/complaint/' + this.$route.params.id
        response = await axios.put(url, formData, {
          //const response = await axios.put(`http://localhost:3001/update/complaint/${this.$route.params.id}`, formData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.status === 200) {
          this.successMessage = `Complaint ${response.data.complaintId} updated successfully!`;
          setTimeout(() => {
            this.successMessage = '';
            this.$router.push({ name: 'Post Complaint' });
          }, 2000);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isSubmitting = false;
        this.showModal = false;
      }
    },
    cancelEdit() {
      this.$router.push({ name: 'Post Complaint' });
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


<!-- <template>
  <CContainer>
    <CRow class="mb-3">
      <CCol>
        <h4>Edit Complaint</h4>
      </CCol>
    </CRow>
    <CForm @submit.prevent="updateComplaint" class="row g-3">
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="category">Category</CFormLabel>
        <CFormSelect class="mt-2" id="category" v-model="complaint.category">
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
        </CFormSelect>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="description">Description</CFormLabel>
        <CFormTextarea
          id="description"
          class="mt-2"
          name="description"
          placeholder="Enter Complaint Description"
          v-model="complaint.description"
          rows="8"
        />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="priority">Priority</CFormLabel>
        <CFormSelect id="priority" class="mt-2" v-model="complaint.priority">
          <option value="" disabled>Select priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </CFormSelect>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="status">Status</CFormLabel>
        <CFormSelect id="status" class="mt-2" v-model="complaint.complaintStatus">
          <option value="Pending">Pending</option>
          <option value="Withdraw">Withdraw</option>
          <option value="Resolved">Resolved</option>
        </CFormSelect>
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="document">Select Document</CFormLabel>
        <input type="file" class="form-control mt-2" ref="file" name="document" />
      </CCol>
      <CCol xs="12" class="d-flex justify-content-center gap-4 my-5">
        <CButton class="px-3 text-white" type="button" color="danger" @click="cancelEdit">Cancel</CButton>
        <CButton class="px-3" type="submit" color="dark">Update</CButton>
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

export default {
  name: 'EditComplaint',
  data() {
    return {
      complaint: {
        category: '',
        description: '',
        priority: '',
        complaintStatus: '',
        document: '',
      },
      successMessage: '',
    };
  },
  methods: {
    async fetchComplaint() {
      try {
        const response = await axios.get(`http://localhost:3001/get/complaint/${this.$route.params.id}`);
        this.complaint = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async updateComplaint() {
      try {
        const formData = new FormData();
        formData.append('category', this.complaint.category);
        formData.append('description', this.complaint.description);
        formData.append('priority', this.complaint.priority);
        formData.append('complaintStatus', this.complaint.complaintStatus);

        if (this.$refs.file.files[0]) {
          formData.append('file', this.$refs.file.files[0]);
        } else {
          formData.append('file', this.complaint.document);
        }

        const response = await axios.put(`http://localhost:3001/update/complaint/${this.$route.params.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          this.successMessage = `Complaint ${response.data.complaintId} updated successfully!`;
          setTimeout(() => {
            this.successMessage = '';
            this.$router.push({ name: 'Post Complaint' });
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    },
    cancelEdit() {
      this.$router.push({ name: 'Post Complaint' });
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
</style> -->
