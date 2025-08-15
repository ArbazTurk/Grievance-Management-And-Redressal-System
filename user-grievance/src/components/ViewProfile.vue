<template>
  <CContainer>
    <CRow class="mb-4">
      <CCol>
        <h4>My Profile</h4>
      </CCol>
    </CRow>
    <CCol class="mb-5 d-flex justify-content-center">
      <div class="profile-photo-container">
        <img :src="profilePhotoUrl" class="rounded-circle profile-photo" alt="Profile Photo" />
        <CButton class="px-2 py-1 edit-icon" :color="theme === 'light' ? 'dark' : 'light'" @click="$refs.file.click()"
          title="Select Image">
          <CIcon icon="cil-camera" />
        </CButton>
      </div>
      <input type="file" ref="file" @change="previewProfilePhoto" class="form-control mt-3 d-none" />
    </CCol>
    <!-- <CRow class="mb-4 justify-content-center">
      <CCol md="4" class="text-center">
        <img :src="profilePhotoUrl" class="rounded-circle profile-photo" alt="Profile Photo" />
        <input type="file" ref="file" @change="previewProfilePhoto" class="form-control mt-3" />
      </CCol>
    </CRow> -->
    <CForm @submit.prevent="updateProfile" class="row g-4">
      <CCol xs="6">
        <CFormLabel class="fw-medium" for="firstName">First Name</CFormLabel>
        <CFormInput class="mt-2" type="text" id="firstName" v-model="user.firstName" required />
      </CCol>
      <CCol xs="6">
        <CFormLabel class="fw-medium" for="lastName">Last Name</CFormLabel>
        <CFormInput class="mt-2" type="text" id="lastName" v-model="user.lastName" required />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="email">Email</CFormLabel>
        <CFormInput class="mt-2 w-80" type="email" disabled id="email" v-model="user.email" required />
      </CCol>
      <CCol xs="12">
        <CFormLabel class="fw-medium" for="mobileNo">Mobile No.</CFormLabel>
        <CFormInput class="mt-2" type="tel" id="mobileNo" v-model="user.mobileNo" required />
      </CCol>
      <CCol class="d-flex justify-content-center mt-4">
        <CButton class="px-3 py-1" type="submit" :color="theme === 'light' ? 'dark' : 'light'" :disabled="isSaving"
          variant="outline" title="Save Changes">
          Save
          <!-- <CIcon icon="cil-save"/> -->
        </CButton>
      </CCol>
    </CForm>
    <transition name="slide-fade">
      <CAlert v-if="successMessage" color="success" class="d-flex align-items-center mt-2 p-2 alert-slide">
        <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />
        {{ successMessage }}
      </CAlert>
    </transition>
  </CContainer>
</template>

<script>

import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import { mapState as piniaMapState } from 'pinia'; 
import { useThemeStore } from '@/stores/theme';
import avatar from '@/assets/images/avatars/default.png'

export default {
  name: 'ViewProfile',
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        profilePhoto: '',
      },
      successMessage: '',
      profilePhotoUrl: '',
      isSaving : false,
    };
  },
  computed: {
    ...mapState(['_id','token']),
    
    ...piniaMapState(useThemeStore, ['theme']),
  },
  methods: {
    ...mapActions(['setProfilePhoto','setUserName']),
    
    async fetchUserProfile() {
      try {
        let url = import.meta.env.VITE_BASE_API + '/user/get/user/' + this._id
        const response = await axios.get(url,{
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.user = response.data;
        this.profilePhotoUrl = this.user.profilePhoto || avatar;
      } catch (error) {
        console.error(error);
      }
    },
    
    previewProfilePhoto(event) {
      const file = event.target.files[0];
      if (file) {
        this.user.profilePhoto = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profilePhotoUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async updateProfile() {
      this.isSaving = true;
      try {
        const formData = new FormData();
        formData.append('firstName', this.user.firstName);
        formData.append('lastName', this.user.lastName);
        formData.append('email', this.user.email);
        formData.append('mobileNo', this.user.mobileNo);

        if (this.$refs.file.files[0]) {
          formData.append('file', this.$refs.file.files[0]);
        }

        let url = import.meta.env.VITE_BASE_API + `/user/edit/user-profile/${this._id}`;
        const response = await axios.put(url, formData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          const fullName = `${this.user.firstName} ${this.user.lastName}`;
          this.setUserName(fullName);
          this.setProfilePhoto(response.data.profilePhoto);
          this.profilePhotoUrl = response.data.profilePhoto;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isSaving = false;
      }
    },
  },
  mounted() {
    this.fetchUserProfile();
  },
};
</script>

<style scoped>
.profile-photo-container {
  position: relative;
  width: 150px;
  height: 150px;
}

.edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
</style>
