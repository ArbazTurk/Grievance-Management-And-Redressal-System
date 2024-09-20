<script setup>
import avatar from '@/assets/images/avatars/default.png'


</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="profilePhotoUrl" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <!-- <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        Account
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-bell" /> Updates
        <CBadge color="info" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-envelope-open" /> Messages
        <CBadge color="success" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-task" /> Tasks
        <CBadge color="danger" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-comment-square" /> Comments
        <CBadge color="warning" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold my-2"
      >
        Settings
      </CDropdownHeader>
      <CDropdownItem @click="goToProfile" style="cursor: pointer;"> <CIcon icon="cil-user" /> Profile </CDropdownItem>
     
      <!-- <CDropdownItem>
        <CIcon icon="cil-file" /> Projects
        <CBadge color="primary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <CDropdownDivider />
      <CDropdownItem style="cursor: pointer;" @click="$router.push({ name: 'Change Password' });"> <CIcon icon="cil-sync" /> Change Password </CDropdownItem>
      <CDropdownItem style="cursor: pointer;" @click="logout()"> <CIcon icon="cil-account-logout"  /> Logout </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
<script>
import { mapState } from 'vuex';
 export default {
  computed: {
    ...mapState(['profilePhoto']),
    profilePhotoUrl() {
      return this.profilePhoto || avatar;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('clearUser');
      this.$router.push({ path: '/'} )
    },
    goToProfile() {
      this.$router.push({ name: 'View Profile' });
    },
  }
 }
</script>
