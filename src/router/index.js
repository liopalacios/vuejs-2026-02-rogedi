import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';
import Login from '../views/Login.vue';
import MainLayout from '../layouts/MainLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import { useMenuStore } from '../store/menu';
// Vistas de Mantenimiento
import MantenimientoTecnicos from '../views/mantenimiento/Tecnicos.vue';
import MantenimientoProductos from '../views/mantenimiento/Productos.vue';
import MantenimientoMateriales from '../views/mantenimiento/Materiales.vue';
import NotFound from '../views/NotFound.vue';

// Vistas de Operaciones
import OperacionesAsignaciones from '../views/operaciones/Asignaciones.vue';

const baseRoutes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];
const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes
});

export function loadDynamicRoutes() {
  const menuStore = useMenuStore();  
  const views = import.meta.glob('../views/**/*.vue');
  if (!router.hasRoute('MainLayout')) {
    router.addRoute({
      path: '/',
      name: 'MainLayout',
      component: MainLayout,
      children: []
    });
  }
  function addRoutesFromMenu(items) {
    items.forEach(item => {
      if (item.route) {
        const routePath = item.route.startsWith('/')
          ? item.route
          : `/${item.route}`;

        const filePath = `../views${routePath}.vue`;
        if (views[filePath]) {
          // Agregar ruta base
          router.addRoute('MainLayout', {
            path: routePath.replace(/^\//, ''),
            name: item.title.replace(/\s+/g, ''),
            component: views[filePath]
          });

          // Agregar ruta con parámetro ID para edición
          router.addRoute('MainLayout', {
            path: `${routePath.replace(/^\//, '')}/:id`,
            name: `${item.title.replace(/\s+/g, '')}Edit`,
            component: views[filePath],
            props: true // Pasar el ID como prop
          });
        }
      }
      if (item.children) {
        addRoutesFromMenu(item.children);
      }
    });
  }

  addRoutesFromMenu(menuStore.menu);
}

// Antes de entrar a cualquier ruta, si el menú está vacío lo cargamos
router.beforeEach(async (to, from, next) => {
  const menuStore = useMenuStore();

  if (!menuStore.menu.length && to.path !== '/login') {
    await menuStore.loadMenuFromApi(); // Simular llamada al backend
    loadDynamicRoutes();
    next({ path: to.fullPath, replace: true }); // Redirigir para aplicar rutas nuevas
  } else {
    next();
  }
});

export default router;
