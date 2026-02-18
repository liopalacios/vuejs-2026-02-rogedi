import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menu: []
  }),
  actions: {
    loadMenuFromApi(userRole) {
      // 🚀 En el futuro aquí harás la llamada al API
      // Por ahora lo simulamos con el JSON estático
      this.menu = [
        {
          title: 'Mantenimiento',
          icon: 'mdi-tools',
          children: [
            { title: 'Técnicos', icon: 'mdi-account-hard-hat', route: '/mantenimiento/Tecnicos' },
            { title: 'Materiales', icon: 'mdi-package-variant', route: '/mantenimiento/Materiales' }
          ]
        },
        {
          title: 'Almacén',
          icon: 'mdi-warehouse',
          children: [
            {
              title: 'Ingreso material',
              icon: 'mdi-truck-delivery',
              children: [
                { title: 'Compra materiales', icon: 'mdi-cart', route: '/almacen/CompraMateriales' },
                { title: 'Doc. Pendientes', icon: 'mdi-database', route: '/almacen/DocumentosPendientes' }
              ]
            },
            {
              title: 'Stock',
              icon: 'mdi-cube-outline',
              children: [
                { title: 'Stock general', icon: 'mdi-store', route: '/almacen/stock/StockGeneral' },
                { title: 'Atendidos', icon: 'mdi-check-circle', route: '/almacen/stock/Atendidos' },
                { title: 'Devueltos', icon: 'mdi-undo', route: '/almacen/stock/Devueltos' },
                { title: 'Liquidados', icon: 'mdi-cash', route: '/almacen/stock/Liquidados' }
              ]
            },
            { title: 'Despacho material', icon: 'mdi-truck-fast', route: '/almacen/DespachoMaterial' },
            { title: 'Devolución material', icon: 'mdi-package-variant', route: '/almacen/DevolucionMaterial' },
            { title: 'Guías concluidas', icon: 'mdi-clipboard-check-outline', route: '/almacen/GuiasConcluidas' },
            { title: 'Búsqueda Series', icon: 'mdi-magnify-scan', route: '/almacen/BusquedaSeries' },
            { title: 'Despacho a colaboradora', icon: 'mdi-account-arrow-right-outline', route: '/almacen/DespachoColaboradora' },
            { title: 'Stock por ruta', icon: 'mdi-map-marker-path', route: '/almacen/StockRuta' },
            { title: 'Modificación almacén', icon: 'mdi-warehouse', route: '/almacen/ModificacionAlmacen' },
            { title: 'Transferencias', icon: 'mdi-swap-horizontal-bold', route: '/almacen/Transferecias' }
          ]
        },
        {
          title: 'Gestión',
          icon: 'mdi-clipboard-list',
          children: [
            { title: 'Liquidaciones', icon: 'mdi-file-document', route: '/gestion/Liquidaciones' }
          ]
        },
        {
          title: 'Reportes',
          icon: 'mdi-chart-bar',
          children: [
            { title: 'Reporte almacén', icon: 'mdi-file-chart', route: '/reportes/ReporteAlmacen' }
          ]
        }
      ];
    }
  }
});
