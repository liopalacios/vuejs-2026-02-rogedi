<template>
  <v-app>
    <!-- Header -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Sistema de Instalaciones</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ authStore.user?.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer app v-model="drawer">
      <v-list>
        <v-list-item
          v-for="(item, index) in menuStore.menu"
          :key="index"
          :to="item.to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido principal -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useMenuStore } from '../../store/menu';
import { useRouter } from 'vue-router';

const drawer = ref(true);
const authStore = useAuthStore();
const menuStore = useMenuStore();
const router = useRouter();

onMounted(() => {
  menuStore.loadMenu();
});

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
