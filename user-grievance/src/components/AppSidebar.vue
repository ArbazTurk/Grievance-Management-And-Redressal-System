<script setup>
// import { RouterLink } from 'vue-router'

// import { logo } from '@/assets/brand/logo'
// import { sygnet } from '@/assets/brand/sygnet'
import { AppSidebarNav } from '@/components/AppSidebarNav.js'
import { useSidebarStore } from '@/stores/sidebar.js'

const sidebar = useSidebarStore()
</script>

<template>
  <CSidebar class="border-end" colorScheme="dark" position="fixed" :unfoldable="sidebar.unfoldable"
    :visible="sidebar.visible" @visible-change="(value) => sidebar.toggleVisible(value)">
    <CSidebarHeader class="border-bottom p-0 d-flex justify-content-between">
      <div class="d-flex justify-content-center align-items-center">
        <img src="/RDLOGOBGREMOVED.png" alt="Searching..." />
        <h4 class="mb-0">R.D. GMS</h4>
      </div>
      <!-- <RouterLink custom to="/" v-slot="{ href, navigate }">
        <CSidebarBrand v-bind="$attrs" as="a" :href="href" @click="navigate">
          <CIcon custom-class-name="sidebar-brand-full" :icon="logo" :height="32" />
          <CIcon custom-class-name="sidebar-brand-narrow" :icon="sygnet" :height="32" />
        </CSidebarBrand>
      </RouterLink> -->
      <CCloseButton class="d-lg-none me-2" dark @click="sidebar.toggleVisible()" />
    </CSidebarHeader>
    <AppSidebarNav />
    <CSidebarFooter class="border-top d-flex justify-content-end  CSidebarFooter">
      <div class="text-center fst-italic monospaced">Developed by Arbaz Khan</div>
      <!-- <CSidebarToggler @click="sidebar.toggleUnfoldable()" /> -->
    </CSidebarFooter>
  </CSidebar>
</template>

<style scoped>
img {
  width: 64px;
}

.monospaced {
  font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
  font-size: small;
  color: #ccc;
}
</style>