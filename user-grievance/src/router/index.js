//import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ProtectedRoute from '../ProtectedRoute.vue';

// import DefaultLayout from '@/layouts/DefaultLayout'
import MemberLogin from '../components/MemberLogin'
import SignUp from '../components/SignUp'
// import AddComplaint from '../views/dashboard/AddComplaint.vue'
// import PostComplaint from "../views/postComplaint.vue";

const routes = [
  {
    path: '/',
    name: 'Member Login',
    component: MemberLogin
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: SignUp
  },
  {
    path: '/dashboard',
    name: 'Home',
    component: ProtectedRoute,
    redirect: '/dashboard',
    children: [
      // {
      //   path: '/dashboard',
      //   name: 'Dashboard',
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "dashboard" */ '@/views/grievancemember/ManageGrievanceMember.vue'
            
      //     ),
      // },
      {
        path: '/profile',
        name: 'View Profile',
        component: () => import('@/components/ViewProfile.vue'),
      },
      {
        path: '/change-password',
        name: 'Change Password',
        component: () => import('@/components/ChangePassword.vue'),
      },
      {
        path: '/post/complaint',
        name: 'Post Complaint',
        component: () => import('@/views/complain/PostComplaint.vue'),
      },
      {
        path : '/add/complaint',
        name : 'Add Complaint',
        component :  () =>import('@/views/complain/AddComplaint.vue')
      },
      {
        path: '/view/complaints',
        name: 'View Complaints',
        component: () => import('@/views/complain/ViewComplaints.vue'),
      },
      {
        path: '/analytics',
        name: 'Analytics',
        component: () => import('@/views/complain/Analytics.vue'),
      },
      {
        path: '/complaint-details/:id',
        name: 'Complaint Details',
        component: () => import('@/views/complain/ComplaintDetails.vue'),
      },
      {
        path: '/grievance-member/complaint-details/:id',
        name: 'Complaint Details GM',
        component: () => import('@/views/complain/ComplaintDetailsGM.vue'),
      },
      {
        path: '/edit-complaint/:id',
        name: 'Edit Complaint',
        component: () => import('@/views/complain/EditComplaint.vue'),
        props: true,
      },
      {
        path: '/resolve-complaint/:id',
        name: 'Resolve Complaint',
        component: () => import('@/views/complain/ResolveComplaint.vue'),
        props: true,
      },
      {
        path: '/manage/grievance-member',
        name: 'Manage Grievance Member',
        component: () => import('@/views/grievancemember/ManageGrievanceMember.vue'),
      },
      {
        path: '/edit/grievance-member/:id',
        name: 'Edit Grievance Member',
        component: () => import('@/views/grievancemember/EditGrievanceMember.vue'),
        props: true,
      },
      {
        path: '/add/grievance-member',
        name: 'Add Grievance Member',
        component: () => import('@/views/grievancemember/AddGrievanceMember.vue'),

        props: true,
      },
      {
        path: '/manage/user',
        name: 'Manage User',
        component: () => import('@/views/grievancemember/ManageUser.vue'),
      },
      {
        path: '/edit/user/:id',
        name: 'Edit User',
        component: () => import('@/views/grievancemember/EditUser.vue'),
        props: true,
      },
      {
        path: '/manage/complaint',
        name: 'Manage Complaint',
        component: () => import('@/views/grievancemember/ManageComplaint.vue'),
      },
    ],
  },
]

const router = createRouter({
  //history: createWebHashHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
