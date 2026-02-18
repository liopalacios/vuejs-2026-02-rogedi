<template>
  <v-navigation-drawer v-model="drawer" app>
    <div class="d-flex flex-column align-center py-4">
      <v-img
        src="/logorogedi.png"
        width="70%"
        height="auto"
        class="fade-edges"
        contain
      />
    </div>
    <v-list>
      <template v-for="(item, i) in menuStore.menu" :key="i">
        <!-- Padre con hijos -->
        <v-list-group
          v-if="item.children"
          prepend-icon=""
          v-model="openGroups[`parent-${i}`]"
        >
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title class="d-flex align-center">
                <v-icon start class="me-2">{{ item.icon }}</v-icon>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </template>

          <!-- Hijos -->
          <template v-for="(child, j) in item.children" :key="`${i}-${j}`">
            <v-list-group
              v-if="child.children"
              prepend-icon=""
              no-action
              v-model="openGroups[`child-${i}-${j}`]"
            >
              <template #activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-title class="d-flex align-center">
                    <v-icon start class="me-2">{{ child.icon }}</v-icon>
                    {{ child.title }}
                  </v-list-item-title>
                </v-list-item>
              </template>

              <!-- Nietos -->
              <v-list-item
                v-for="(grand, k) in child.children"
                :key="`${i}-${j}-${k}`"
                link
                @click="goTo(grand.route)"
              >
                <v-list-item-title class="d-flex align-center">
                  <v-icon start class="me-2">{{ grand.icon }}</v-icon>
                  {{ grand.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list-group>

            <!-- Hijos sin nietos -->
            <v-list-item
              v-else
              link
              @click="goTo(child.route)"
            >
              <v-list-item-title  class="d-flex align-center">
                <v-icon start class="me-2">{{ child.icon }}</v-icon>
                {{ child.title }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-group>

        <!-- Padre sin hijos -->
        <v-list-item
          v-else
          link
          @click="goTo(item.route)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../store/menu';
const drawer = ref(true);
const router = useRouter();
const menuStore = useMenuStore();
const openGroups = reactive({});
onMounted(() => {
  menuStore.loadMenuFromApi(); // simulado
});

function goTo(route) {
  if (route) router.push(route);
}
</script>
<style scoped>
.fade-edges {
  -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: cover;
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%);
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: cover;
}  
</style>
