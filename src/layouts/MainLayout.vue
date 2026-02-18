<template>
  <v-app>
    

    <!-- Menú lateral -->
    <SlideMenu />

    <!-- Barra superior -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Panel de Gestión Rogedi</v-toolbar-title>
      <v-spacer />
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="white"><v-icon color="primary">mdi-account</v-icon></v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ authStore.user?.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="logout">
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <transition name="fade-up" mode="out-in">
          <router-view /> 
        </transition>
        
      </v-container>
    </v-main>
  </v-app>

   
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useMenuStore } from '../store/menu';
import SlideMenu from '../components/SlideMenu.vue';
const drawer = ref(true);
const authStore = useAuthStore();
const menuStore = useMenuStore();
const router = useRouter();

// objeto reactivo para controlar cada grupo (open/closed)
const openGroups = reactive({});

// inicializamos las claves en false para cada grupo
onMounted(() => {
    if (authStore.user?.roles?.[0]) {
        menuStore.loadMenuFromApi(authStore.user.roles[0]);
    }
});
function goTo(route) {
  if (route) router.push(route);
}
// cerrar sesión
function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
<style scoped>
.fade-up-enter-active {
  transition: all 0.5s ease-out;
}
.fade-up-leave-active {
  transition: all 0.4s ease-in;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(50px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

</style>