<template>
  <CContainer>
    <CRow class="mb-4">
      <CCol>
        <h4>Analytics Dashboard</h4>
      </CCol>
    </CRow>
    <CRow :xs="{ gutterX: 5 }">
      <CCol :xl="3" :md="6">
        <CWidgetStatsA class="mb-4 pb-5 pt-3" color="primary">
          <template #title>Complaints Received</template>
          <template #value>{{ complaintsReceived }}</template>
        </CWidgetStatsA>
      </CCol>
      <CCol :xl="3" :md="6">
        <CWidgetStatsA class="mb-4 pb-5 pt-3" color="success">
          <template #title>Complaints Resolved</template>
          <template #value>{{ complaintsResolved }}</template>
        </CWidgetStatsA>
      </CCol>
      <CCol :xl="3" :md="6">
        <CWidgetStatsA class="mb-4 pb-5 pt-3" color="warning">
          <template #title>Complaints In Progress</template>
          <template #value>{{ complaintsInProgress }}</template>
        </CWidgetStatsA>
      </CCol>
      <CCol :xl="3" :md="6">
        <CWidgetStatsA class="mb-4 pb-5 pt-3" color="danger">
          <template #title>Complaints Pending</template>
          <template #value>{{ complaintsPending }}</template>
        </CWidgetStatsA>
      </CCol>
      <!-- <CCol :xl="3" :md="6">
        <CWidgetStatsA class="mb-4 pb-5 pt-3" color="info">
          <template #title>Average Rating</template>
          <template v-if="ratedComplaints.length" #value>{{ averageRating.toFixed(1).replace(/\.0$/, '') }} <span
              style="color: #ffd700;">★</span></template>
          <template v-else #value>No Ratings Yet</template>
        </CWidgetStatsA>
      </CCol> -->
      <CCol :xl="3" :md="6">
        <CWidgetStatsA class="mb-4 pb-5 pt-3" color="info">
          <template #title>Average Rating</template>
          <template #value><span v-for="(index) in 5" :key="index"
              :class="[index <= Math.round(averageRating) ? 'star' : 'not']">★</span></template>
        </CWidgetStatsA>
      </CCol>
      <!-- <CCol :xl="3" :md="6">
        <CWidgetStatsA class="mb-4 pb-5 pt-3" color="secondary">
          <template #title>Complaints Withdrawn</template>
          <template #value>{{ complaintsWithdrawn }}</template>
        </CWidgetStatsA>
      </CCol> -->
    </CRow>
  </CContainer>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
export default {
  name: 'Analytics',
  data() {
    return {
      complaintsReceived: 0,
      complaintsResolved: 0,
      complaintsInProgress: 0,
      complaintsPending: 0,
      complaintsWithdrawn: 0,
      ratedComplaints: 0,
      totalRating: 0,
      averageRating: 0,
    }
  },
  computed: {
    ...mapState(['_id', 'token']),
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      let url = import.meta.env.VITE_BASE_API + '/complaint/' + this._id + '/complaint/analytics'
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
      const complaints = response.data
      this.complaintsReceived = complaints.length
      this.complaintsResolved = complaints.filter(complaint => complaint.complaintStatus === 'Resolved').length
      this.complaintsInProgress = complaints.filter(complaint => complaint.complaintStatus === 'InProgress').length
      this.complaintsPending = complaints.filter(complaint => complaint.complaintStatus === 'Pending').length
      this.complaintsWithdrawn = complaints.filter(complaint => complaint.complaintStatus === 'Withdraw').length
      this.ratedComplaints = complaints.filter(complaint => complaint.rating)
      if (this.ratedComplaints.length) {
        this.totalRating = this.ratedComplaints.reduce((acc, current) => acc + current.rating, 0)
        this.averageRating = this.totalRating / (this.ratedComplaints.length)
      }
    }
  }
}
</script>

<style scoped>
.star {
  font-size: 1.5rem;
  color: #ffd700;
  margin: 0 px;
}

.not {
  font-size: 1.5rem;
  color: #ccc;
  margin: 0 px;
}
</style>