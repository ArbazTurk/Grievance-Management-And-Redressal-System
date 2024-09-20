<template>
  <CContainer class="CContainer">
    <CRow class="mb-4">
      <CCol>
        <h4>Manage Users</h4>
      </CCol>
    </CRow>
    <CRow class="mb-4">
      <CInputGroup>
        <CFormInput class="ps-5" placeholder="Search by name, email, mobile no., status or verification status"
          v-model="searchQuery" @input="fetchUsers(true)" />
        <span class="search-icon">
          <CIcon icon="cil-search" />
        </span>
      </CInputGroup>
      <!-- <CCol>
        <CFormInput
          placeholder="Search by name, email, mobile no."
          v-model="searchQuery"
          @input="fetchUsers(true)"
        />
      </CCol> -->
    </CRow>
    <div class="scroll">
      <CTable responsive class="my-0 bordered">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">S.No.</CTableHeaderCell>
            <CTableHeaderCell scope="col">First Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Last Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobile No</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Verification Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="(user, index) in users" :key="user._id">
            <CTableDataCell>{{ (currentPage - 1) * 10 + index + 1 }}</CTableDataCell>
            <CTableDataCell>{{ user.firstName }}</CTableDataCell>
            <CTableDataCell>{{ user.lastName }}</CTableDataCell>
            <CTableDataCell>{{ user.email }}</CTableDataCell>
            <CTableDataCell>{{ user.mobileNo }}</CTableDataCell>
            <CTableDataCell>
              <CBadge :color="user.status === 'Active' ? 'success' : 'danger'" class="p-2" style="width: 70px;">
                {{ user.status }}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CBadge :color="user.isVerified === 'Verified' ? 'success' : 'warning'" class="p-2" style="width: 100px;">
                {{ user.isVerified }}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton class="px-2 py-1" color="dark" @click="goToEditUser(user)" title="Edit User">
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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user._id">
              <td>{{ (currentPage - 1) * 7 + index + 1 }}</td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.mobileNo }}</td>
              <td>
                <CBadge :color="user.status === 'Active' ? 'success' : 'danger'" class="p-2" style="width: 70px;">
                  {{ user.status }}
                </CBadge>
              </td>
              <td>
                <CButton class="px-3 py-1" color="dark" @click="goToEditUser(user)">
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

export default {
  name: 'ManageUser',
  data() {
    return {
      users: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 0,
    };
  },
  computed: {
    ...mapState(['token']),
  },
  methods: {
    async fetchUsers(resetPage = false) {
      if (resetPage) {
        this.currentPage = 1;
      }
      try {
        let url = process.env.BASE_API + '/users'
        //const response = await axios.get('http://localhost:3001/users', {
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
        this.users = response.data.users;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error(error);
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchUsers();
    },
    goToEditUser(user) {
      this.$router.push({ name: 'Edit User', params: { id: user._id } });
    },
  },
  watch: {
    searchQuery() {
      this.fetchUsers(true);
    },
  },
  mounted() {
    this.fetchUsers();
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

  .mb-4 {
    margin-bottom: 18px !important;
  }
}
</style>