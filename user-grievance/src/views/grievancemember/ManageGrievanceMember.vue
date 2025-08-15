<template>
  <CContainer class="CContainer">
    <CRow class="mb-4">
      <CCol>
        <h4>Manage Grievance Members</h4>
      </CCol>
      <CCol sm="7" class="text-end">
        <CButton class="CButton" :color="theme === 'light' ? 'dark' : 'light'" variant="outline"
          @click="goToAddMember">
          Add Member
          <CIcon icon="cil-plus" />
        </CButton>
      </CCol>
    </CRow>
    <CRow class="mb-4">
      <CInputGroup>
        <CFormInput class="ps-5" placeholder="Search by name, email, mobile no., profile or status"
          v-model="searchQuery" @input="fetchMembers(true)" />
        <span class="search-icon">
          <CIcon icon="cil-search" />
        </span>
      </CInputGroup>
      <!-- <CCol>
        <CFormInput placeholder="Search by name, email, mobile no., profile" v-model="searchQuery"
          @input="fetchMembers(true)" />
      </CCol> -->
    </CRow>
    <div class="scroll">
      <CTable responsive class="my-0 bordered">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobile No</CTableHeaderCell>
            <CTableHeaderCell scope="col">Profile</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="(member, index) in members" :key="member._id">
            <CTableDataCell>{{ (currentPage - 1) * 10 + index + 1 }}</CTableDataCell>
            <CTableDataCell>{{ member.firstName + ' ' + member.lastName }}</CTableDataCell>
            <CTableDataCell>{{ member.email }}</CTableDataCell>
            <CTableDataCell>{{ member.mobileNo }}</CTableDataCell>
            <CTableDataCell>{{ member.profile }}</CTableDataCell>
            <CTableDataCell>
              <CBadge :color="member.status === 'Active' ? 'success' : 'danger'" class="p-2" style="width: 70px;">{{
                member.status }}</CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton class="px-2 py-1" :color="theme === 'light' ? 'dark' : 'light'" variant="outline" @click="goToEditMember(member)" title="Edit Member">
                <CIcon name="cil-pencil" />
              </CButton>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </div>
    <!-- <CRow>
        <CCol>
          <table style="border: 2px solid grey" class="table table-hover table-striped">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Profile</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in members" :key="member._id">
                <td>{{ (currentPage - 1) * 7 + index + 1 }}</td>
                <td>{{ member.firstName +' '+ member.lastName}}</td>
                <td>{{ member.email }}</td>
                <td>{{ member.mobileNo }}</td>
                <td>{{ member.profile }}</td>
                <td>
                  <CBadge :color="member.status === 'Active' ? 'success' : 'danger'" class="p-2" style="width: 70px;">
                    {{ member.status }}
                  </CBadge>
                </td>
                <td>
                  <CButton class="px-3 py-1" color="dark" @click="goToEditMember(member)">
                    <CIcon name="cil-pencil" />
                  </CButton>
                </td>
              </tr>
            </tbody>
          </table>
        </CCol>
      </CRow> -->
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
import { mapState } from 'vuex';
import { mapState as piniaMapState } from 'pinia';
import { useThemeStore } from '@/stores/theme';

export default {
  name: 'ManageGrievanceMember',
  data() {
    return {
      members: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 0,
    };
  },
  computed: {
    ...mapState(['token']),
    ...piniaMapState(useThemeStore, ['theme']),
  },
  methods: {
    async fetchMembers(resetPage = false) {
      if (resetPage) {
        this.currentPage = 1;
      }
      try {
        let url = import.meta.env.VITE_BASE_API + '/admin/list/grievance-members';
        const response = await axios.get(url, {
          //const response = await axios.get('http://localhost:3001/admin/list/grievance-members', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            page: this.currentPage,
            limit: 10,
            search: this.searchQuery,
          },
        });
        this.members = response.data.users;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error(error);
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchMembers();
    },
    goToAddMember() {
      this.$router.push({ name: 'Add Grievance Member' });
    },
    goToEditMember(member) {
      this.$router.push({ name: 'Edit Grievance Member', params: { id: member._id } });
    },
  },
  watch: {
    searchQuery() {
      this.fetchMembers(true);
    },
  },
  mounted() {
    this.fetchMembers();
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
</style>