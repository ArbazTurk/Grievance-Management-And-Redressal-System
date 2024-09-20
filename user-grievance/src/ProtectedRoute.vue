<template>
  <div v-if="isAuthenticated">
    <DefaultLayout/>
  </div>
  <div v-else>
    {{ $router.push({ path: '/' }) }}
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue'

export default {
  name: 'ProtectedRoute',
  components: {
    DefaultLayout,
  },
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.state.token);
    const router = useRouter();
    return {
      isAuthenticated,
      router,
    };
  },
};
</script>