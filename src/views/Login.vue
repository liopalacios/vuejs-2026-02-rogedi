<template>
  <v-container
    class="d-flex align-center justify-center login-background"    
    fluid
  >
    <v-card
      class="pa-6 text-center login-card"
      width="420"
      elevation="12"
    >
      <v-avatar size="80" class="mb-4" color="primary">
        <v-icon icon="mdi-wifi" size="50" color="white"></v-icon>
      </v-avatar>

      <h2 class="mb-6 font-weight-bold">Bienvenido</h2>

      <v-text-field
        label="Usuario"
        v-model="username"
        variant="outlined"
        color="primary"
        prepend-inner-icon="mdi-account"
      ></v-text-field>

      <v-text-field
        label="Contraseña"
        type="password"
        v-model="password"
        variant="outlined"
        color="primary"
        prepend-inner-icon="mdi-lock"
      ></v-text-field>

      <v-btn
        class="mt-4 login-btn"
        block
        size="large"
        @click="doLogin"
      >
        Ingresar
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const username = ref('');
const password = ref('');

function doLogin() {
  authStore.login('fake-token', { name: username.value, roles: ['ADMIN'] });
  router.push('/');
}
</script>

<style scoped>
/* Fondo degradado animado */
.login-background {
  background: linear-gradient(-45deg, #2196f3, #21cbf3, #673ab7, #512da8);
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
  height: 100vh;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Card estilizada */
.login-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
}

/* Botón con degradado */
.login-btn {
  background: linear-gradient(45deg, #2196f3, #21cbf3);
  color: white;
  font-weight: bold;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(33, 203, 243, 0.4);
}
</style>
