<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="text-h6">Mantenimiento de Materiales</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="searchCodigo"
              label="Buscar por código"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="searchDescripcion"
              label="Buscar por descripción"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4" class="d-flex justify-end align-center">
            <v-btn color="primary" @click="abrirFormulario()">Agregar Material</v-btn>
          </v-col>
          
        </v-row>
      </v-card-text>
      <!-- Tabs -->
      <v-tabs v-model="tab" bg-color="primary" dark>
        <v-tab value="materiales">Materiales</v-tab>
        <v-tab value="series" @click="listarSeries()">Series</v-tab>
      </v-tabs>
      <v-card-text>
      <v-window v-model="tab">
        <!-- TAB: Materiales -->
        <v-window-item value="materiales">
          <v-data-table
            :headers="headers"
            :items="materialesFiltrados"
            
            class="elevation-1"
          >
            <template #item.series="{ item }">
              <v-btn
                text
                color="primary"
                @click="verSeries(item.codigo)"
              >
                {{ item.cantidadSeries }}
              </v-btn>
            </template>
            <template #item.acciones="{ item }">
              <v-btn icon color="blue" @click="abrirFormulario(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="eliminar(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-window-item>

        <!-- TAB: Series -->
        <v-window-item value="series">
          <v-data-table-server
            :headers="headersSeries"
            :items="series"
            :items-per-page="itemsPerPage"
            :page="page"
            :items-length="totalSeries" 
            @update:page="p => listarSeries(p)"     
            @update:items-per-page="val => { itemsPerPage.value = val; listarSeries(1) }"
            class="elevation-1"
          >
            
            <template #item.acciones="{ item }">
              <v-btn icon color="blue" @click="verDetalleSerie(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
          </v-data-table-server>
        </v-window-item>
      </v-window>
    </v-card-text>
    </v-card>

    <!-- Modal Formulario -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{ form.id ? 'Editar Material' : 'Agregar Material' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field v-model="form.codigo" label="Código" required></v-text-field>
            <v-text-field v-model="form.descripcion" label="Descripción" required></v-text-field>
            <v-select
              v-model="form.unidadMedida"
              :items="['UND', 'MTS']"
              label="Unidad de medida"
              required
            ></v-select>
             <v-row>
              <v-col cols="12">
                <v-checkbox
                  v-model="form.seriado"
                  label="Material seriado"
                  hint="Los materiales seriados requieren registro de número de serie"
                  persistent-hint
                  color="primary"
                ></v-checkbox>
              </v-col>
            </v-row>
            
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="guardar()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed , watch } from 'vue'
import { useMaterialesStore } from '../../store/materiales';
import { getMateriales, crearMaterial, eliminarMaterial } from '@/services/materialesService'
import { listarSeriesService } from "@/services/seriesService";


const materiales = ref([])
const dialog = ref(false)
const form = ref({})
const formRef = ref(null)
const searchDescripcion = ref('')
const searchCodigo = ref('')
const tab = ref('materiales')
// Series
const series = ref([]);
const totalSeries = ref(0);
const materialSeleccionado = ref(null);

const page = ref(1)                // página actual (empieza en 1)
const itemsPerPage = ref(10)       // registros por página
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Codigo', key: 'codigo' },
  { title: 'Nombre', key: 'descripcion' },
  { title: 'Series', key: 'series' },
  { title: 'Acciones', key: 'acciones', sortable: false }
];
const headersSeries = [
  { title: "ID", key: "id" },
  { title: "Número Serie", key: "numeroSerie" },
  { title: "Modelo", key: "modelo" },
  { title: "Año Fabricación", key: "anioFabricacion" },
  { title: "Estado", key: "estado" },
  { title: "Ubicación", key: "ubicacion" },
  { title: "Acciones", key: "acciones", sortable: false },
];
const materialesFiltrados = computed(() => {
  const cod = (searchCodigo.value ?? '').toString().toLowerCase()
  const desc = (searchDescripcion.value ?? '').toString().toLowerCase()
  console.log('Filtrando materiales por:', { cod, desc })
  return materiales.value
    .map((item, index) => ({ ...item, index: index + 1 }))
    .filter((item) => {
      const coincideNombre =
        !desc ||
        item.descripcion.toLowerCase().includes(desc)
      const coincideCodigo =
        !cod ||
        item.codigo.toLowerCase().includes(cod)
      return coincideNombre && coincideCodigo
    })
})
const listarSeries = async (pagina = page.value) => {
  const pag = pagina && pagina > 0 ? pagina : 1;
  const backendPage = pag - 1;
  const { content, total } = await listarSeriesService({
    page: backendPage,
    size: itemsPerPage.value,
    codigo: searchCodigo.value,
    descripcion: searchDescripcion.value
  });
  console.log(content);
  console.log(total);
  console.log('API totalElements:', total)
  series.value = content;
  totalSeries.value = total;
  console.log('totalSeries.value', totalSeries.value)
  page.value = pag; // porque vuetify empieza desde 1
};

onMounted(async () => {
  materiales.value = await getMateriales()
})
const abrirFormulario = (item = null) => {
  form.value = item ? { ...item } : {};
  dialog.value = true;
}

watch([searchCodigo, searchDescripcion], () => {
  if (tab.value === 'series') {
    // Si está en Series, consulta API
    page.value = 1
    listarSeries(1)
  }
  // Si está en Materiales, no hacemos nada: el computed ya filtra
})

watch(tab, (nuevo) => {
  if (nuevo === 'series') {
    // Al cambiar a series refresca lista con filtros actuales
    page.value = 1
    listarSeries(1)
  }
})

const guardar = async () => {
  if (form.value.id) {
    //const actualizado = await actualizarMaterial(form.value.id, form.value)
    //materiales.value = materiales.value.map(m => m.id === actualizado.id ? actualizado : m)
  } else {
    const nuevo = await crearMaterial(form.value)
    materiales.value.push(nuevo)
  }
  dialog.value = false
}

const eliminar = async (id) => {
  await eliminarMaterial(id)
  materiales.value = materiales.value.filter(m => m.id !== id)
}
function verSeries(codigo) {
  if (!codigo) return
  searchCodigo.value = codigo;   // setear el código al filtro
  tab.value = 'series';
  page.value = 1;                 // cambiar tab
  listarSeries(1);                         // cargar series desde la página 1 con filtro

}

</script>
