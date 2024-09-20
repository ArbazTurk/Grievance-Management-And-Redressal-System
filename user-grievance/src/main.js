import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import CoreuiVue from '@coreui/vue'
// import CIcon from '@coreui/icons-vue';
// import { iconsSet as icons } from '@/assets/icons';
import { CIcon } from '@coreui/icons-vue'
import {
  cilArrowBottom,
  cilArrowRight,
  cilChevronCircleLeftAlt,
  cilPlus,
  cilPencil,
  cilShieldAlt,
  cilLockLocked,
  cilAccountLogout,
  cilViewModule,
  cilSearch,
  cilArrowTop,
  cilUser,
  cilSync,
  cilCheckCircle,
  cilXCircle,
  cilPhone,
  cilMenu,
  cilCamera,
  cilSave,
  cilMoon,
  cilSun,
  cilContrast,
  cilDescription,
  cilDrop,
  cilCircle,
  cilTrash,
  cilSpeedometer,
} from '@coreui/icons'

const icons = {
  cilSpeedometer,
  cilTrash,
  cilMoon,
  cilDescription,
  cilDrop,
  cilCircle,
  cilSun,
  cilContrast,
  cilSave,
  cilCamera,
  cilMenu,
  cilPhone,
  cilArrowBottom,
  cilArrowRight,
  cilChevronCircleLeftAlt,
  cilPlus,
  cilPencil,
  cilShieldAlt,
  cilLockLocked,
  cilAccountLogout,
  cilViewModule,
  cilSearch,
  cilArrowTop,
  cilUser,
  cilSync,
  cilCheckCircle,
  cilXCircle,
}

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(faEye, faEyeSlash)

// Vuex store
const store = createStore({
  state: {
    _id: sessionStorage.getItem('_id') || null,
    userType: sessionStorage.getItem('userType') || null,
    isVerified: sessionStorage.getItem('isVerified') || false,
    userProfile: sessionStorage.getItem('profilePhoto') || null,
    userName: sessionStorage.getItem('userName') || null,
    token: sessionStorage.getItem('token') || null,
  },
  mutations: {
    setUserId(state, userId) {
      state._id = userId
    },
    setUserType(state, userType) {
      state.userType = userType
    },
    setIsVerified(state, isVerified) {
      state.isVerified = isVerified
    },
    setProfilePhoto(state, profilePhoto) {
      state.profilePhoto = profilePhoto
    },
    setUserName(state, userName) {
      state.userName = userName
    },
    setToken(state, token) {
      state.token = token
    },
    clearUser(state) {
      state._id = null
      state.userType = null
      state.isVerified = false
      state.profilePhoto = null
      state.userName = null
      state.token = null
    },
  },
  actions: {
    setUserId({ commit }, userId) {
      sessionStorage.setItem('_id', userId)
      commit('setUserId', userId)
    },
    setUserType({ commit }, userType) {
      sessionStorage.setItem('userType', userType)
      commit('setUserType', userType)
    },
    setIsVerified({ commit }, isVerified) {
      sessionStorage.setItem('isVerified', isVerified)
      commit('setIsVerified', isVerified)
    },
    setProfilePhoto({ commit }, profilePhoto) {
      sessionStorage.setItem('profilePhoto', profilePhoto)
      commit('setProfilePhoto', profilePhoto)
    },
    setUserName({ commit }, userName) {
      sessionStorage.setItem('userName', userName)
      commit('setUserName', userName)
    },
    setToken({ commit }, token) {
      sessionStorage.setItem('token', token)
      commit('setToken', token)
    },
    clearUser({ commit }) {
      sessionStorage.removeItem('_id')
      sessionStorage.removeItem('userType')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('isVerified')
      sessionStorage.removeItem('profilePhoto')
      sessionStorage.removeItem('userName')
      sessionStorage.removeItem('token')
      commit('clearUser')
    },
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.provide('icons', icons)
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('CIcon', CIcon)
app.mount('#app')
