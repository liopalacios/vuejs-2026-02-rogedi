import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMaterialesStore = defineStore('materiales', () => {
  const materiales = ref([
    { id: 1, codigo: 'MAT001', descripcion: 'Cable UTP Cat 6', cantidad: 140 },
    { id: 2, codigo: 'MAT002', descripcion: 'Router WiFi', cantidad: 60 },
    { id: 3, codigo: 'MAT003', descripcion: 'Switch 24 puertos', cantidad: 30 },
    { id: 4, codigo: 'MAT004', descripcion: 'Disco Duro 1TB', cantidad: 80 },
  ]);

  function agregarMaterial(material) {
    material.id = materiales.value.length ? Math.max(...materiales.value.map(m => m.id)) + 1 : 1;
    materiales.value.push(material);
  }

  function actualizarMaterial(material) {
    const index = materiales.value.findIndex(m => m.id === material.id);
    if (index !== -1) {
      materiales.value[index] = { ...material };
    }
  }

  function eliminarMaterial(id) {
    materiales.value = materiales.value.filter(m => m.id !== id);
  }

  function obtenerMaterialPorId(id) {
    return materiales.value.find(m => m.id === id);
  }

  return { materiales, agregarMaterial, actualizarMaterial, eliminarMaterial, obtenerMaterialPorId };
});
