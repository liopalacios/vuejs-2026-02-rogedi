// store/tecnicos.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTecnicosStore = defineStore('tecnicos', () => {
  const tecnicos = ref([
    {
      id: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      telefono: '987654321',
      email:'leonardo@gmail.com',
      fechaNacimiento: '05/06/1985',
      direccion: 'Av. Siempre Viva 123',
      costo: 50
    },
    {
      id: 2,
      nombres: 'Pedro',
      apellidos: 'Rios',
      tipoDocumento: 'DNI',
      numeroDocumento: '44445678',
      telefono: '999654321',
      email:'leonardo2@gmail.com',
      direccion: 'Av. Arriba Peru 123',
      fechaNacimiento: '05/08/1985',
      costo: 60
    },
    {
      id: 3,
      nombres: 'Javier',
      apellidos: 'Mendez',
      tipoDocumento: 'DNI',
      numeroDocumento: '45565678',
      telefono: '977754321',
      email:'leonardo3@gmail.com',
      fechaNacimiento: '05/11/1985',
      direccion: 'Av. Central Peru 123',
      costo: 55
    }
  ]);

  function agregarTecnico(tecnico) {
    tecnico.id = Date.now();
    tecnicos.value.push(tecnico);
  }

  function actualizarTecnico(tecnicoEditado) {
    const index = tecnicos.value.findIndex(t => t.id === tecnicoEditado.id);
    if (index !== -1) {
      tecnicos.value[index] = { ...tecnicoEditado };
    }
  }

  function eliminarTecnico(id) {
    tecnicos.value = tecnicos.value.filter(t => t.id !== id);
  }

  return { tecnicos, agregarTecnico, actualizarTecnico, eliminarTecnico };
});
