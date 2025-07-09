<script setup>
import { onBeforeMount } from 'vue'
import { useColorModes } from '@coreui/vue'

import { useThemeStore } from '@/stores/theme.js'

const { isColorModeSet, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')
const themeStore = useThemeStore() // Pinia store का इंस्टेंस

onBeforeMount(() => {
  const urlParams = new URLSearchParams(window.location.href.split('?')[1])
  let theme = urlParams.get('theme')

  if (theme !== null && theme.match(/^[A-Za-z0-9\s]+/)) {
    theme = theme.match(/^[A-Za-z0-9\s]+/)[0]
  }

  // अगर localStorage में कोई थीम सेट है, तो उसे पढ़ें
  if (!theme && isColorModeSet()) {
    theme = localStorage.getItem('coreui-free-vue-admin-template-theme')
  }

  // अगर कोई थीम नहीं मिली, तो Pinia स्टोर की डिफ़ॉल्ट थीम का उपयोग करें
  if (!theme) {
    theme = themeStore.theme
  }

  // अंत में, दोनों सिस्टम को सिंक करें
  setColorMode(theme) // CoreUI को अपडेट करें
  themeStore.toggleTheme(theme) // Pinia स्टोर को अपडेट करें
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
