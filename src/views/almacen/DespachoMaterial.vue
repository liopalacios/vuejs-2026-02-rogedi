<template>
  <div>
    <v-card class="pa-4">
      <!-- Cabecera con información del personal -->
      <v-row class="mb-4">
        <v-col cols="12" md="12">
          <v-card variant="outlined" class="pa-4">
            <v-row>
              <v-col cols="6">
                <v-text-field label="Nombre Personal" cols="2" md="1" required></v-text-field>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-btn color="primary" size="large">Guardar & Imprimir</v-btn>
              </v-col>  
            </v-row>
            <v-row>
              
              <v-col cols="2">
                <v-text-field label="DNI" md="1" required></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field label="Zonal" cols="2" md="1" required></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field label="Tipo" cols="2" md="1" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Observación" cols="2" md="1" required></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <!-- Selector de Material -->
      <v-card class="mb-4" variant="outlined">
        <v-card-text>
          <v-row align="center">
           
             <v-col cols="12" md="4" style="padding-top: 0;">
              <v-autocomplete
                v-model="materialSeleccionado"
                :items="materialesFiltrados"
                :search-input.sync="busquedaMaterial"
                item-title="descripcionCompleta"
                item-value="id"
                label="Material"
                placeholder="Escriba para buscar material..."
                hint="Material"
                persistent-hint
                clearable
                auto-select-first
                :loading="cargando"
                @update:search-input="filtrarMateriales"
              >
                <!-- Template para personalizar cómo se muestra cada item -->
                <template #item="{ item, props }">
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.descripcion"
                    :subtitle="`Código: ${item.raw.codigo} | Stock: ${item.raw.cantidad}`"
                  ></v-list-item>
                </template>
                
                <!-- Template para cuando no hay resultados -->
                <template #no-data>
                  <v-list-item>
                    <v-list-item-title>
                      No se encontraron materiales
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            
            <v-col cols="12" md="2"> 
              <v-text-field label="Seriado" cols="2" md="1" required></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Stock técnico" cols="2" md="1" required></v-text-field>
            </v-col>  
            <v-col cols="12" md="2">  
              <v-text-field label="Stock almacén" cols="12" md="1" required></v-text-field>
            </v-col>
            <v-col cols="12" md="1">  
              <v-text-field label="Cantidad" cols="12" md="1" required></v-text-field>
            </v-col>
            
            
            <v-col cols="12" md="1" class="text-right" style="padding-top: 0;">
              <v-btn color="success" block style="height: 3rem;">AGREGAR</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Tabla de materiales seleccionados -->
      <v-card-title class="px-0 pt-0">
        <span class="text-h6">Materiales a despachar</span>
      </v-card-title>
      
      <v-data-table
        :headers="headers"
        :items="materialesSeleccionados"
        class="elevation-1"
        items-per-page="10"
      >
        <template #item.um="{ item }">
          <span>{{ item.um }} <small v-if="item.seriado">(S)</small></span>
        </template>
        
        <template #item.cantidad="{ item }">
          <v-text-field
            v-model="item.cantidad"
            type="number"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 100px;"
          ></v-text-field>
        </template>
        
        <template #item.acciones="{ item }">
          <v-btn icon color="error" size="small" @click="eliminarMaterial(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMaterialesStore } from '@/store/materiales'

const materialesStore = useMaterialesStore()
// Variables para el autocompletado
const busquedaMaterial = ref('')
const materialSeleccionado = ref(null)
const cargando = ref(false)

// Computed para filtrar materiales (máximo 10 resultados)
const materialesFiltrados = computed(() => {
  if (!busquedaMaterial.value) {
    // Si no hay búsqueda, mostrar los primeros 10
    return materialesStore.materiales.slice(0, 10).map(m => ({
      ...m,
      descripcionCompleta: `${m.codigo} - ${m.descripcion}`
    }))
  }
  const busqueda = busquedaMaterial.value.toLowerCase()
  
  // Filtrar materiales que coincidan con la búsqueda
  const filtrados = materialesStore.materiales.filter(m => 
    m.descripcion.toLowerCase().includes(busqueda) ||
    m.codigo.toLowerCase().includes(busqueda)
  )
  
  // Retornar máximo 10 resultados
  return filtrados.slice(0, 10).map(m => ({
    ...m,
    descripcionCompleta: `${m.codigo} - ${m.descripcion}`
  }))
})

const headers = [
  { title: 'ALMACÉN', key: 'almacen' },
  { title: 'CÓDIGO MATERIAL', key: 'codigo' },
  { title: 'DESCRIPCIÓN', key: 'descripcion' },
  { title: 'UM (S)', key: 'um' },
  { title: 'CANTIDAD', key: 'cantidad' },
  { title: 'ACCIONES', key: 'acciones', sortable: false }
]

const materiales = ref([
  { id: 1, descripcion: 'ONT ATW-922G1N4NH AX3000 GPON WI-FI 6' },
  { id: 2, descripcion: 'GRAPA P/CR-6 (NC-1N) 6MM WIR GRIS' }
])

const materialesSeleccionados = ref([
  {
    almacen: '01 Lima',
    codigo: 'WO1315',
    descripcion: 'ONT ATW-922G1N4NH AX3000 GPON WI-FI 6',
    um: 'MTS',
    seriado: true,
    cantidad: 5
  },
  {
    almacen: '02 Lima',
    codigo: 'WO1315',
    descripcion: 'GRAPA P/CR-6 (NC-1N) 6MM WIR GRIS',
    um: 'UND',
    seriado: false,
    cantidad: 4
  },
  {
    almacen: '03 Ica',
    codigo: 'WO1315',
    descripcion: 'GRAPA P/CR-6 (NC-1N) 6MM WIR GRIS',
    um: 'MTS',
    seriado: false,
    cantidad: 4
  },
  {
    almacen: '04 Lima',
    codigo: 'WO1315',
    descripcion: 'GRAPA P/CR-6 (NC-1N) 6MM WIR GRIS',
    um: 'MTS',
    seriado: false,
    cantidad: 5
  },
  {
    almacen: '05 Lima',
    codigo: 'WO1315',
    descripcion: 'GRAPA P/CR-6 (NC-1N) 6MM WIR GRIS',
    um: 'MTS',
    seriado: false,
    cantidad: 10
  }
])

const eliminarMaterial = (item) => {
  const index = materialesSeleccionados.value.indexOf(item)
  if (index > -1) {
    materialesSeleccionados.value.splice(index, 1)
  }
}
</script>

<style scoped>
.v-data-table :deep(th) {
  font-weight: 600;
  font-size: 0.85rem;
  background-color: #f5f5f5;
}


.v-data-table :deep(th) {
  font-weight: 600;
  font-size: 0.85rem;
  background-color: #f5f5f5;
}

.v-data-table :deep(td) {
  font-size: 0.9rem;
}

/* Estilos adicionales para el autocomplete */
:deep(.v-autocomplete) {
  width: 100%;
}
</style>