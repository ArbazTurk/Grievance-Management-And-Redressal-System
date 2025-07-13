<template>
  <CContainer>
    <CModal style="color: #d9534f;" :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>No New Appeals</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h6>No new appeals to reply to. Please wait for a new appeal to be submitted.</h6>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">
          Close
        </CButton>
      </CModalFooter>
    </CModal>
    <CRow class="mb-3">
      <CCol>
        <h4>Complaint Details</h4>
      </CCol>
      <CCol class="text-end">
        <CButton :color="theme === 'light' ? 'dark' : 'light'" variant="outline" @click="goBack">
          <CIcon icon="cil-chevron-circle-left-alt" />
          <span style="padding: 0 5px">Back</span>
        </CButton>
      </CCol>
    </CRow>

    <CRow class="mb-3">
      <CFormLabel for="complainRaisedBy" class="col-sm-3 col-form-label fw-medium">Complain Raised By:</CFormLabel>
      <CCol class="col-sm">
        <CFormInput 
          type="text" 
          readonly 
          class="form-control-plaintext fw-medium" 
          id="complainRaisedBy" 
          :value="!complaint.anonymous ? complaint.complaintBy.firstName + ' ' + complaint.complaintBy.lastName : '******'" 
        />
      </CCol>
    </CRow>
    
    <CRow class="mb-3">
      <CFormLabel for="complaintCategory" class="col-sm-3 col-form-label fw-medium">Complaint Category:</CFormLabel>
      <CCol class="col-sm">
        <CFormInput type="text" readonly class="form-control-plaintext" id="complaintCategory" v-model="complaint.category" />
      </CCol>
    </CRow>
    
    <CRow class="mb-3">
      <CFormLabel for="complaintPriority" class="col-sm-3 col-form-label fw-medium">Complaint Priority:</CFormLabel>
      <CCol class="col-sm">
        <CFormInput type="text" readonly class="form-control-plaintext" id="complaintPriority" v-model="complaint.priority" />
      </CCol>
    </CRow>
    
    <CRow class="mb-3">
      <CFormLabel for="complaintStatus" class="col-sm-3 col-form-label fw-medium">Complaint Status:</CFormLabel>
      <CCol class="col-sm">
        <CFormInput type="text" readonly class="form-control-plaintext" id="complaintStatus" v-model="complaint.complaintStatus"/>
      </CCol>
    </CRow>
    
    <CRow class="mb-3">
      <CFormLabel for="document" class="col-sm-3 col-form-label fw-medium">Document:</CFormLabel>
      <CCol class="col-sm">
        <p readonly class="form-control-plaintext" id="document">
          <a :href="complaint.document" target="_blank" v-if="complaint.document">View Document</a>
          <span v-else>N/A</span>
        </p>
      </CCol>
    </CRow>
    
    <CRow class="mb-3" v-if="(complaint.communicationTimeStamps.length && complaint.communicationTimeStamps[0])">
      <CFormLabel for="complaintInitiatedAt" class="col-sm-3 col-form-label fw-medium">Complaint Initiated At:</CFormLabel>
      <CCol class="col-sm">
        <CFormInput type="text" readonly class="form-control-plaintext text-justify fw-medium" id="complaintInitiatedAt" :value="convertDate(complaint.communicationTimeStamps[0])" />
      </CCol>
    </CRow>
    
    <CRow class="mb-3">
      <CFormLabel for="complaintDescription" class="col-sm-3 col-form-label fw-medium">Complaint Description:</CFormLabel>
      <CCol class="col-sm">
        <p readonly class="form-control-plaintext text-justify" id="complaintDescription">{{ complaint.description[0] }}</p>
      </CCol>
    </CRow>
    
    <CRow class="mb-3">
      <CFormLabel for="complaintRecipient" class="col-sm-3 col-form-label fw-medium">Complaint Recipient:</CFormLabel>
      <CCol class="col-sm">
        <CFormInput 
          type="text" 
          readonly 
          class="form-control-plaintext" 
          id="complaintRecipient" 
          :value="complaint.complaintRecipient.firstName + ' ' + complaint.complaintRecipient.lastName" 
        />
      </CCol>
    </CRow>
    
    <CRow class="mb-3">
      <CFormLabel for="response" class="col-sm-3 col-form-label fw-medium">Response:</CFormLabel>
      <CCol class="col-sm">
        <CFormInput 
          type="text" 
          readonly 
          class="form-control-plaintext" 
          id="response" 
          :value="complaint.remarks[0] || 'Not Received Yet'" 
        />
      </CCol>
    </CRow>

    <CRow class="mb-3" v-if="(complaint.remarks.length && complaint.communicationTimeStamps.length && complaint.communicationTimeStamps[0])">
      <CFormLabel for="firstResponseAt" class="col-sm-3 col-form-label fw-medium">First Response At:</CFormLabel>
      <CCol class="col-sm">
        <CFormInput 
          type="text" 
          readonly 
          class="form-control-plaintext fw-medium" 
          id="firstResponseAt"
          :value="convertDate(complaint.communicationTimeStamps[1])" 
        />
      </CCol>
    </CRow>
    
    <CRow class="mb-3" v-if="!complaint.remarks.length">
      <CFormLabel for="yourRemarks" class="col-sm-3 col-form-label fw-medium">Your Remarks:</CFormLabel>
      <CCol class="col-sm">
        <CFormTextarea 
          rows="6" 
          placeholder="Enter your reply message" 
          class="mb-4 mr-0"
          v-model="replyMessage" 
          required 
        />
      </CCol>
      <CCol class="col-sm-1">
        <CButton 
          type="button" 
          :color="theme === 'light' ? 'dark' : 'light'" 
          variant="outline" 
          :disabled="!replyMessage" 
          @click="sendReply()"
        >Send Reply</CButton>
      </CCol>
    </CRow>

    <!-- <CRow class="gap-5">
      <CCol xs="3" class="align-items-start">
        <CFormLabel class="fw-medium">Complain Raised By:</CFormLabel>
      </CCol>
      <CCol xs="7">
        <p style="font-weight:bold">{{ !complaint.anonymous ? complaint.complaintBy.firstName + ' ' +
          complaint.complaintBy.lastName : ' ******' }}</p>
      </CCol>
    </CRow>
    <CRow class="gap-5">
      <CCol xs="3" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint Category:</CFormLabel>
      </CCol>
      <CCol xs="7">
        <p>{{ complaint.category }}</p>
      </CCol>
    </CRow>

    <CRow class="gap-5">
      <CCol xs="3" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint Priority:</CFormLabel>
      </CCol>
      <CCol xs="7">
        <p>{{ complaint.priority }}</p>
      </CCol>
    </CRow>

    <CRow class="gap-5">
      <CCol xs="3" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint Status:</CFormLabel>
      </CCol>
      <CCol xs="7">
        <p>{{ complaint.complaintStatus }}</p>
      </CCol>
    </CRow>

    <CRow class="gap-5">
      <CCol xs="3" class="align-items-start">
        <CFormLabel class="fw-medium">Document:</CFormLabel>
      </CCol>
      <CCol xs="7">
        <p>
          <a :href="complaint.document" target="_blank" v-if="complaint.document">View Document</a>
          <span v-else>N/A</span>
        </p>
      </CCol>
    </CRow>
    <CRow v-if="(complaint.communicationTimeStamps.length && complaint.communicationTimeStamps[0])" class="gap-5">
      <CCol xs="3" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint Initiated At:</CFormLabel>
      </CCol>
      <CCol xs="7">
        <p style="text-align: justify;font-weight: bold">{{ convertDate(complaint.communicationTimeStamps[0]) }} </p>
      </CCol>
    </CRow>
    <CRow class="gap-5">
      <CCol xs="3" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint Description:</CFormLabel>
      </CCol>
      <CCol xs="7">
        <p style="text-align: justify;">{{ complaint.description[0] }} </p>
      </CCol>
    </CRow>


    <CRow class="gap-5">
      <CCol xs="3" class="align-items-start">
        <CFormLabel class="fw-medium">Your Remarks:</CFormLabel>
      </CCol>
      <CCol v-if="complaint.remarks.length" xs="7">
        <p>{{ complaint.remarks[0] }} </p>
      </CCol>

    </CRow>
    <CRow v-if="!complaint.remarks.length" class="gap-5">
      <CCol xs="7" class="align-items-start">
        <CFormTextarea v-model="replyMessage" rows="6" placeholder="Enter your reply message" class="mb-4 mr-0"
          required />
      </CCol>
      <CCol xs="3" class="text-start">
        <CButton type="button" color="dark" :disabled="!replyMessage" @click="sendReply()">Send Reply</CButton>
      </CCol>
    </CRow>
    <CRow
      v-if="(complaint.remarks.length && complaint.communicationTimeStamps.length && complaint.communicationTimeStamps[0])"
      class="gap-5">
      <CCol xs="3" class="align-items-start">
        <CFormLabel class="fw-medium">First Response At:</CFormLabel>
      </CCol>
      <CCol xs="7">
        <p style="text-align: justify;font-weight: bold">{{ convertDate(complaint.communicationTimeStamps[1]) }} </p>
      </CCol>
    </CRow> -->
    <CRow v-if="complaint.description[1]">
      <CCol>
        <h4>Further Communication</h4>
        <CRow class="border mt-3 pt-3">
          <CCol>
            <div v-for="(message, index) in combined" :key="index">
              <p>
                <span class="text-secondary fw-bold">{{ !complaint.anonymous ? complaint.complaintBy.firstName + ' ' +
                  complaint.complaintBy.lastName : ' *****' }} [{{ '[' +
                    complainerTimeStamps[index] ? convertDate(complainerTimeStamps[index]) : '' + ']' }} ]:</span> {{
                    message.description }}
              </p>
              <p v-if="message.remark">
                <span class="text-primary fw-bold">You [{{ '[' +
                  complaineeTimeStamps[index] ? convertDate(complaineeTimeStamps[index]) : '' + ']' }} ]:</span> {{
                    message.remark }}
              </p>
            </div>
          </CCol>
        </CRow>

        <!-- <CRow class="border mt-3 pt-3">
          <CCol class="mt-3">
            <p v-for="(remark, index) in complaint.remarks.slice(1)" :key="index">
              <span class="text-primary fw-bold">You:</span> {{ remark }}
            </p>
          </CCol>
          <CCol>
            <p v-for="(message, index) in complaint.description.slice(1)" :key="index">
              <span class="text-secondary fw-bold">{{ complaint.complaintBy.firstName + ' ' + complaint.complaintBy.lastName }}:</span>  {{ message }}
            </p>
          </CCol>
        </CRow> -->

        <!-- <CRow class="mt-4">
          <CCol xs="9" class="align-items-start">
            <p class="text-danger fw-medium">
              If your complaint has been resolved, you can edit it and update the status to "Resolved".
            </p>
          </CCol>
          <CCol xs="1">
            <CButton class="px-2 py-1" style="width: 50px;" color="dark" @click="goToEditComplaint(complaint)"
              title="Edit Complaint">
              <CIcon icon="cil-pencil" />
            </CButton>
          </CCol>
        </CRow> -->

        <CRow v-if="complaint.complaintStatus !== 'Resolved'" class="mb-3 mt-4">
          <CCol xs="9" class="align-items-start">
            <p class="text-danger fw-medium">
              If you want to reply to this appeal, click "Yes".
            </p>
          </CCol>
          <CCol xs="1">
            <CButton class="px-2 py-1" style="width: 50px;" :color="theme === 'light' ? 'dark' : 'light'" variant="outline" @click="manageAlert" title="Reply Form">
              Yes
            </CButton>
          </CCol>
        </CRow>
        <CRow v-else class="mb-3 mt-4">
          <CCol xs="9" class="align-items-start">
            <p class="text-success fw-medium">
              This Complain has been resolved
            </p>
          </CCol>
        </CRow>
        <div ref="replyForm" v-if="showReplyForm">
          <CForm @submit.prevent="sendReply">
            <CRow>
              <CCol xs="8" class="align-items-start">
                <CFormTextarea v-model="replyMessage" rows="4" placeholder="Enter your reply message" class="mb-4"
                  required />
              </CCol>
              <CCol xs="2" class="text-end">
                <CButton type="submit" :color="theme === 'light' ? 'dark' : 'light'" variant="outline" :disabled="!replyMessage">Send Reply</CButton>
              </CCol>
            </CRow>
          </CForm>
        </div>
      </CCol>
      <!-- <CCol>
        <h4>Further Communication</h4>
        <CRow>
          <CCol>
            <p v-for="(message, index) in complaint.description.slice(1)" :key="index">You: {{ message }}</p>
            <p v-for="(remark, index) in complaint.remarks.slice(1)" :key="index">{{ complaint.complaintRecipient.firstName }}: {{ remark }}</p>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="9" class="align-items-start">
            <p class="text-danger fw-medium">If you feel that your complaint has been resolved, you can click the Edit button and update the status to 'Resolved'.</p>
          </CCol>
          <CCol xs="1">
            <CButton class="px-2 py-1" style="width: 50px;" color="dark" @click="goToEditComplaint(complaint)" title="Edit Complaint">
              <CIcon icon="cil-pencil"/>
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="9" class="align-items-start">
            <p class="text-danger fw-medium">If you feel that your complaint has not been resolved and you want to send an appeal message, click Yes.</p>
          </CCol>
          <CCol xs="1">
            <CButton class="px-2 py-1" style="width: 50px;" color="dark" @click="showAppealForm=true">
              Yes
            </CButton>
          </CCol>
        </CRow>
        <CForm v-if="showAppealForm" @submit.prevent="sendAppeal">
          <CFormTextarea v-model="appealMessage" rows="4" placeholder="Enter your appeal message"></CFormTextarea>
          <CButton type="submit" color="dark">Send Appeal</CButton>
        </CForm>
      </CCol> -->
    </CRow>
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

export default {
  name: 'ComplaintDetails',
  data() {
    return {
      complaint: {
        category: '',
        description: [],
        priority: '',
        complaintStatus: '',
        document: '',
        remarks: [],
        complaintBy: {},
        communicationTimeStamps: []
      },
      replyMessage: '',
      showReplyForm: false,
      successMessage: '',
      combined: [],
      complainerTimeStamps: [],
      complaineeTimeStamps: [],
      showModal: false,
    };
  },
  computed: {
    ...mapState(['token']),
    ...piniaMapState(useThemeStore, ['theme']),
  },
  methods: {
    async fetchComplaint() {
      try {
        let url = import.meta.env.VITE_BASE_API + '/get/complaint/' + this.$route.params.id
        // const response = await axios.get(`http://localhost:3001/get/complaint/${this.$route.params.id}`);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.complaint = response.data;
        // console.log(new Date(this.complaint.communicationTimeStamps[0]).toLocaleString())
        for (let i = 0; i < this.complaint.description.length - 1; i++) {
          this.combined.push({
            description: this.complaint.description[i + 1] || '',
            remark: this.complaint.remarks[i + 1] || '',
          });
        }
        for (let j = 2; j < this.complaint.communicationTimeStamps.length; j++) {
          this.complainerTimeStamps.push(this.complaint.communicationTimeStamps[j])
          j++;
          if (j < this.complaint.communicationTimeStamps.length) {
            this.complaineeTimeStamps.push(this.complaint.communicationTimeStamps[j])
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async sendReply() {
      try {
        this.showReplyForm = false;
        let url = import.meta.env.VITE_BASE_API + '/update/complaint/' + this.$route.params.id + '/reply'
        const response = await axios.put(url, {
          // const response = await axios.put(`http://localhost:3001/update/complaint/${this.$route.params.id}/reply`, {
          replyMessage: this.replyMessage
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        if (response.status === 200) {
          this.combined = []
          this.successMessage = 'Reply message sent successfully!';
          this.replyMessage = '';
          this.fetchComplaint();
        }
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    },
    convertDate(date) {
      return new Date(date).toLocaleString()
    },
    goBack() {
      this.$router.push({ name: 'View Complaints' });
    },

    manageAlert() {
      if (this.complaint.description.length !== this.complaint.remarks.length) {
        this.showReplyForm = true;
        this.$nextTick(() => {
          this.$refs.replyForm.scrollIntoView({ behavior: 'smooth' });
        });
      } else {
        this.showModal = true;
      }
      // window.alert('No new appeals to reply to. Please wait for a new appeal to be submitted.');
    }
  },
  created() {
    this.fetchComplaint();
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

<!-- <template>
  <CContainer>
    <CRow class="mb-3">
      <CCol>
        <h4>Complaint Details</h4>
      </CCol>
      <CCol class="text-end">
        <CButton color="dark" @click="goBack">
          <CIcon icon="cil-chevron-circle-left-alt" />
          <span style="padding: 0 5px">Back</span>
        </CButton>
      </CCol>
    </CRow>

    <CRow>
      <CCol md="2" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint Category:</CFormLabel>
      </CCol>
      <CCol md="8">
        <p>{{ complaint.category }}</p>
      </CCol>
    </CRow>

    <CRow>
      <CCol md="2" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint Priority:</CFormLabel>
      </CCol>
      <CCol md="8">
        <p>{{ complaint.priority }}</p>
      </CCol>
    </CRow>
    
    <CRow>
      <CCol md="2" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint Status:</CFormLabel>
      </CCol>
      <CCol md="8">
        <p>{{ complaint.complaintStatus }}</p>
      </CCol>
    </CRow>

    <CRow>
      <CCol md="2" class="align-items-start">
        <CFormLabel class="fw-medium">Document:</CFormLabel>
      </CCol>
      <CCol md="8">
        <p>
          <a :href="complaint.document" target="_blank" v-if="complaint.document">View Document</a>
          <span v-else>N/A</span>
        </p>
      </CCol>
    </CRow>
    
    <CRow>
      <CCol md="2" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint Description:</CFormLabel>
      </CCol>
      <CCol md="8">
        <p>{{ complaint.description[0] }}</p>
      </CCol>
    </CRow>

    <CRow>
      <CCol md="2" class="align-items-start">
        <CFormLabel class="fw-medium">Complaint By:</CFormLabel>
      </CCol>
      <CCol md="8">
        <p>{{ complaint.complaintBy.firstName +' '+ complaint.complaintBy.lastName}}</p>
      </CCol>
    </CRow>

    <CRow>
      <CCol md="2" class="align-items-start">
        <CFormLabel class="fw-medium">Your Remarks:</CFormLabel>
      </CCol>
      <CCol md="8">
        <p>{{ complaint.remarks[0] }}</p>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <h4>Communication Channel and Appeal Mechanism</h4>
        <CRow>
          <CCol>
            <h5>Conversation</h5>
            <p v-for="(message, index) in complaint.description.slice(1)" :key="index">You: {{ message }}</p>
            <p v-for="(remark, index) in complaint.remarks.slice(1)" :key="index">{{ complaint.complaintRecipient.firstName }}: {{ remark }}</p>
          </CCol>
        </CRow>
        <p>If you feel that your complaint has been resolved, you can click the Edit button and update the status to 'Resolved'</p>
        <CButton color="dark" @click="goToEditComplaint">Edit Complaint</CButton>
        <p>If you feel that your complaint has not been resolved, you can send an appeal message below.</p>
        <CForm @submit.prevent="sendAppeal">
          <CFormTextarea v-model="appealMessage" rows="4" placeholder="Enter your appeal message"></CFormTextarea>
          <CButton type="submit" color="dark">Send Appeal</CButton>
        </CForm>
      </CCol>
    </CRow>
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
  name: 'ComplaintDetails',
  data() {
    return {
      complaint: {
        category: '',
        description: [],
        priority: '',
        complaintStatus: '',
        document: '',
        remarks: [],
        complaintBy: {}
      },
      appealMessage: '',
      successMessage: ''
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
    async sendAppeal() {
      try {
        const response = await axios.put(`http://localhost:3001/update/complaint/${this.$route.params.id}/appeal`, {
          appealMessage: this.appealMessage
        });
        if (response.status === 200) {
          this.successMessage = 'Appeal message sent successfully!';
          this.appealMessage = '';
          this.fetchComplaint();
        }
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    },

    goBack() {
      this.$router.push({ name: 'Post Complaint' });
    },
    
    goToEditComplaint() {
      this.$router.push({ name: 'Edit Complaint', params: { id: this.complaint._id } });
    }
  },
  mounted() {
    this.fetchComplaint();
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
</style> -->
