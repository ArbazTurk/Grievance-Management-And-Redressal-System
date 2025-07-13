<template>
  <CContainer class="CContainer">
    <CModal style="color: #d9534f;" :visible="deleteModalVisible" @close="deleteModalVisible = false">
      <CModalHeader>
        <CModalTitle>Delete Complaint</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h6>Are you sure you want to delete this Complaint?</h6>
      </CModalBody>
      <CModalFooter>
        <CButton :color="theme === 'light' ? 'danger' : 'light'" variant="outline" class="text-white" @click="confirmDeleteComplaint">
          Delete
        </CButton>
        <CButton :color="theme === 'light' ? 'secondary' : 'light'" variant="outline" @click="deleteModalVisible = false">
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
    <CModal style="color: #d9534f;" :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>Cannot Delete Resolved Complaint</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h6>You cannot delete this complaint because it has already been resolved.</h6>
      </CModalBody>
      <CModalFooter>
        <CButton :color="theme === 'light' ? 'secondary' : 'light'" variant="outline" @click="showModal = false">
          Close
        </CButton>
      </CModalFooter>
    </CModal>
    <CRow class="mb-4">
      <CCol>
        <h4>Complaints List</h4>
      </CCol>
    </CRow>
    <CRow class="mb-4">
      <CInputGroup>
        <CFormInput class="ps-5" placeholder="Search by category, priority, complaint recipient, raised by or status"
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
            <CTableHeaderCell scope="col">Category</CTableHeaderCell>
            <CTableHeaderCell scope="col">Priority</CTableHeaderCell>
            <CTableHeaderCell scope="col">Complaint Recipient</CTableHeaderCell>
            <CTableHeaderCell scope="col">Raised By</CTableHeaderCell>
            <CTableHeaderCell scope="col">Complaint Status</CTableHeaderCell>
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
            <CTableDataCell>{{ complaint.complaintRecipient.firstName }} {{ complaint.complaintRecipient.lastName }}
            </CTableDataCell>
            <CTableDataCell>
              {{ complaint.complaintBy.firstName }} {{ complaint.complaintBy.lastName }}
              <!-- <a :href="complaint.document" target="_blank" v-if="complaint.document">View Document</a>
            <span v-else> N/A </span> -->
            </CTableDataCell>
            <CTableDataCell>
              <CBadge :color="statusColor(complaint.complaintStatus)" class="p-2" style="width: 70px;">
                {{ complaint.complaintStatus }}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton class="px-2 py-1" :color="theme === 'light' ? 'dark' : 'light'" variant="outline" @click="deleteComplaint(complaint)" title="Delete Complaint">
                <CIcon icon="cil-trash" />
              </CButton>
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
// import * as icon from '@coreui/icons';

export default {
  name: 'ManageComplaint',
  data() {
    return {
      complaints: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 0,
      showModal: false,
      deleteModalVisible: false,
      complaintIdToDelete: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapState(['token']),
    ...piniaMapState(useThemeStore, ['theme']),
  },
  methods: {
    async fetchComplaints(resetPage = false) {
      if (resetPage) {
        this.currentPage = 1;
      }
      try {
        let url = import.meta.env.VITE_BASE_API + '/get/complaints'
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
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
    deleteComplaint(complaint) {
      if (complaint.complaintStatus == 'Resolved') {
        this.showModal = true;

      } else {
        try {
          this.complaintIdToDelete = complaint._id;
          this.deleteModalVisible = true;
        } catch (error) {
          console.error(error);
        }
      }
    },
    async confirmDeleteComplaint() {
      try {
        let url = import.meta.env.VITE_BASE_API + '/delete/complaint/' + this.complaintIdToDelete;
        const response = await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.fetchComplaints(true);
        this.deleteModalVisible = false;
        if (response.status === 200) {
          this.successMessage = `Complaint ${response.data.complaintId} deleted successfully!`;
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // deleteComplaint(complaint) {
    //   if (complaint.complaintStatus == 'Resolved') {
    //     this.showModal = true;

    //   } else {
    //     try {
    //       let url = process.env.BASE_API + '/delete/complaint/' + complaint._id
    //       axios.delete(url)
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
    // },
    changePage(page) {
      this.currentPage = page;
      this.fetchComplaints();
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

@media (max-width: 576px) {
  .CContainer {
    padding: 0 0.3rem !important;
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