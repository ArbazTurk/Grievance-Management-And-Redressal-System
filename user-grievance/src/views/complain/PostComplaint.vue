<template>
  <CContainer class="CContainer">
    <CModal style="color: #d9534f;" :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>Verification Pending</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h6>Your account is not verified yet. Please wait for admin approval to access this feature.</h6>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">
          Close
        </CButton>
      </CModalFooter>
    </CModal>
    <CRow class="mb-4">
      <CCol>
        <h4>My Complaints List</h4>
      </CCol>
      <CCol sm="7" class="text-end">
        <!-- <CButton color="dark" @click="goToAddComplaint">
          Add Complaint ➕
        </CButton> -->
        <CButton class="CButton" :color="theme === 'light' ? 'dark' : 'light'" variant="outline"
          @click="goToAddComplaint">
          Add Complaint
          <CIcon icon="cil-plus" />
        </CButton>
      </CCol>
    </CRow>
    <CRow class="mb-4">
      <CInputGroup>
        <CFormInput class="ps-5" placeholder="Search by category, priority, complaint recipient or status"
          v-model="searchQuery" @input="fetchComplaints(true)" />
        <span class="search-icon">
          <CIcon icon="cil-search" />
        </span>
      </CInputGroup>
    </CRow>
    <div class="scroll">
      <CTable responsive class="my-0 bordered">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
            <CTableHeaderCell scope="col" style="width: 37%">Category</CTableHeaderCell>
            <CTableHeaderCell scope="col">Priority</CTableHeaderCell>
            <CTableHeaderCell scope="col" style="width: 30%">Complaint Recipient</CTableHeaderCell>
            <CTableHeaderCell scope="col" style="width: 25%">Raised At</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="(complaint, index) in complaints" :key="complaint._id">
            <CTableDataCell>{{ (currentPage - 1) * 10 + index + 1 }}</CTableDataCell>
            <CTableDataCell>{{ complaint.category }}</CTableDataCell>
            <CTableDataCell>
              <CBadge :color="priorityColor(complaint.priority)" class="p-2" style="width: 70px;">
                {{ complaint.priority }}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>{{ complaint.complaintRecipient?.firstName }} {{ complaint.complaintRecipient?.lastName }}
            </CTableDataCell>
            <!-- <CTableDataCell>
            <a :href="complaint.document" target="_blank" v-if="complaint.document">View Document</a>
            <span v-else> N/A </span>
          </CTableDataCell> -->
            <CTableDataCell>
              {{ convertDate(complaint.created_at) }}
            </CTableDataCell>
            <CTableDataCell>
              <CBadge :color="statusColor(complaint.complaintStatus)" class="p-2" style="width: 75px;">
                {{ complaint.complaintStatus }}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <div class="d-flex gap-2">
                <CButton class="px-2 py-1" :color="theme === 'light' ? 'dark' : 'light'" variant="outline" @click="goToEditComplaint(complaint)" title="Edit Complaint">
                  <CIcon icon="cil-pencil" />
                </CButton>
                <CButton class="px-2 py-1" :color="theme === 'light' ? 'dark' : 'light'" variant="outline" @click="viewComplaintDetails(complaint)"
                  title="View Complaint Details">
                  <font-awesome-icon icon='fa-regular fa-eye' />
                </CButton>
              </div>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </div>
    <CPagination v-if="totalPages > 1" style="cursor: pointer" aria-label="Page navigation example" align="center">
      <CPaginationItem v-if="currentPage > 1" @click="changePage(currentPage - 1)">Previous</CPaginationItem>
      <CPaginationItem v-for="page in totalPages" :key="page" @click="changePage(page)">
        {{ page }}
      </CPaginationItem>
      <CPaginationItem v-if="currentPage < totalPages" @click="changePage(currentPage + 1)">Next</CPaginationItem>
    </CPagination>
  </CContainer>
</template>

<script>
import axios from 'axios';
// import * as icon from '@coreui/icons';
import { mapState } from 'vuex';
import { mapState as piniaMapState } from 'pinia';
import { useThemeStore } from '@/stores/theme';

export default {
  name: 'PostComplaint',
  data() {
    return {
      complaints: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 0,
      showModal: false,
    };
  },
  computed: {
    ...mapState(['_id', 'isVerified', 'token']),
    ...piniaMapState(useThemeStore, ['theme']),
  },
  methods: {
    async fetchComplaints(resetPage = false) {
      if (resetPage) {
        this.currentPage = 1;
      }
      try {
        let url = import.meta.env.VITE_BASE_API + '/' + this._id + '/complaints'
        //const response = await axios.get(`http://localhost:3001/${this._id}/complaints`, {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          params: {
            type: 'user',
            page: this.currentPage,
            limit: 10,
            search: this.searchQuery,
          },
        });
        this.complaints = response.data.complaints;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error(error);
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchComplaints();
    },
    convertDate(date) {
      return new Date(date).toLocaleString()
    },
    goToAddComplaint() {
      if (this.isVerified === 'Verified') {
        this.$router.push({ name: 'Add Complaint' });
      } else {
        // window.alert('You Are Not Verified To Perform This Action')
        this.showModal = true;
      }
    },
    goToEditComplaint(complaint) {
      this.$router.push({ name: 'Edit Complaint', params: { id: complaint._id } });
    },
    viewComplaintDetails(complaint) {
      this.$router.push({ name: 'Complaint Details', params: { id: complaint._id } });
    },
    priorityColor(priority) {
      switch (priority) {
        case 'High':
          return 'danger';
        case 'Medium':
          return 'warning';
        case 'Low':
          return 'success';
        default:
          return 'secondary';
      }
    },
    statusColor(status) {
      switch (status) {
        case 'Pending':
          return 'warning';
        case 'Withdraw':
          return 'secondary';
        case 'Resolved':
          return 'success';
        default:
          return 'secondary';
      }
    },
  },
  watch: {
    searchQuery() {
      this.fetchComplaints(true);
    },
  },
  mounted() {
    this.fetchComplaints();
  },
};
</script>

<style scoped>
div.scroll {
  margin: 0px auto;
  margin-bottom: 1rem;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.6;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1.8rem;
  z-index: 10;
  transform: translateY(-50%);
}

@media (max-width: 576px) {
  .CContainer {
    padding: 0 0.3rem !important;
  }

  .CButton {
    padding: 4px 6px
  }

  .mb-4 {
    margin-bottom: 18px !important;
  }
}

/*.centered-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
}*/
</style>