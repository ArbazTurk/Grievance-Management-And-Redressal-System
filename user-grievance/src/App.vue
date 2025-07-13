<script setup>
import { onBeforeMount } from 'vue'
import { useColorModes } from '@coreui/vue'

import { useThemeStore } from '@/stores/theme.js'

const { isColorModeSet, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')
const themeStore = useThemeStore()

onBeforeMount(() => {
  const urlParams = new URLSearchParams(window.location.href.split('?')[1])
  let theme = urlParams.get('theme')

  if (theme !== null && theme.match(/^[A-Za-z0-9\s]+/)) {
    theme = theme.match(/^[A-Za-z0-9\s]+/)[0]
  }

  if (!theme && isColorModeSet()) {
    theme = localStorage.getItem('coreui-free-vue-admin-template-theme')
  }

  if (!theme) {
    theme = themeStore.theme
  }

  setColorMode(theme)
  themeStore.toggleTheme(theme)
})
// const { isColorModeSet, setColorMode } = useColorModes(
//   'coreui-free-vue-admin-template-theme',
// )
// const currentTheme = useThemeStore()

// onBeforeMount(() => {
//   const urlParams = new URLSearchParams(window.location.href.split('?')[1])
//   let theme = urlParams.get('theme')

//   if (theme !== null && theme.match(/^[A-Za-z0-9\s]+/)) {
//     theme = theme.match(/^[A-Za-z0-9\s]+/)[0]
//   }

//   if (theme) {
//     setColorMode(theme)
//     return
//   }

//   if (isColorModeSet()) {
//     return
//   }

//   setColorMode(currentTheme.theme)
// })
</script>

<template>
  <router-view />
</template>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
// We use those styles to show code examples, you should remove them in your application.
@import 'styles/examples';
</style>
