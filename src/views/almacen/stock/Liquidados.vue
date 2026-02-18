<template>
  <v-container fluid class="p-0 bg-gradient" style="padding: 0!important;">
    <v-row justify="center" class="contenedor" style="padding: 0!important;margin: 0;">
      <v-col cols="12" style="padding: 0!important;">
        <v-card elevation="12" class="rounded-xl">
          <!-- Header -->
          <v-card-title class="bg-warning text-white pa-3">
            <div class="d-flex align-center justify-space-between">
              <div>
                <h1 class="text-h5 font-weight-bold">
                  <v-icon class="mr-2">mdi-cash-multiple</v-icon>
                  Liquidaciones
                </h1>
                <p class="text-caption mb-0 mt-1 opacity-75">
                  Gestión de liquidaciones de instalaciones y servicios
                </p>
              </div>
              
              <div>
                
                <v-btn
                  icon
                  variant="text"
                  @click="exportarExcel"
                  :loading="exportando"
                  :disabled="exportando"
                >
                  <v-icon>mdi-file-excel</v-icon>
                  <v-tooltip activator="parent" location="bottom">
                    {{ exportando ? 'Exportando...' : 'Exportar a Excel' }}
                  </v-tooltip>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  @click="actualizarStock"
                >
                  <v-icon>mdi-refresh</v-icon>
                  <v-tooltip activator="parent" location="bottom">
                    Actualizar
                  </v-tooltip>
                </v-btn>

              </div>
            </div>
          </v-card-title>

          <v-card-text class="pa-6 pt-0 pl-0 pr-0">
            <!-- Filtros -->
            <v-card class="mb-4 pa-4" style="box-shadow: none;">
              <v-row>
                <!-- Filtros principales -->
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.coLiquidacion"
                    label="Cód. Liquidación"
                    prepend-inner-icon="mdi-barcode"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @keyup.enter="buscarLiquidaciones"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.dniCliente"
                    label="DNI Cliente"
                    prepend-inner-icon="mdi-card-account-details"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @keyup.enter="buscarLiquidaciones"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.nombreCliente"
                    label="Nombre Cliente"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @keyup.enter="buscarLiquidaciones"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="3">
                  <v-select
                    v-model="filtros.tipoInstalacion"
                    :items="tiposInstalacion"
                    item-title="nombre"
                    item-value="codigo"
                    label="Tipo Instalación"
                    prepend-inner-icon="mdi-cog"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="buscarLiquidaciones"
                  ></v-select>
                </v-col>
                
                <!-- Filtros secundarios -->
                <v-col cols="12" md="3">
                  <v-select
                    v-model="filtros.estadoRevision"
                    :items="estadosRevision"
                    item-title="nombre"
                    item-value="codigo"
                    label="Estado Revisión"
                    prepend-inner-icon="mdi-check-circle"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="buscarLiquidaciones"
                  ></v-select>
                </v-col>
                
                <v-col cols="12" md="3">
                  <v-select
                    v-model="filtros.codZonal"
                    :items="zonales"
                    item-title="nombre"
                    item-value="codigo"
                    label="Zonal"
                    prepend-inner-icon="mdi-map-marker"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="buscarLiquidaciones"
                  ></v-select>
                </v-col>
                
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.fechaDesde"
                    label="Fecha Desde"
                    type="date"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="buscarLiquidaciones"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.fechaHasta"
                    label="Fecha Hasta"
                    type="date"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="buscarLiquidaciones"
                  ></v-text-field>
                </v-col>
                
                <!-- Botones -->
                 <!--
                <v-col cols="12" md="3" class="d-flex align-center">
                  <v-btn
                    color="warning"
                    class="btn-filtros"
                    prepend-icon="mdi-magnify"
                    @click="buscarLiquidaciones"
                  >
                    Buscar
                  </v-btn>
                  <v-btn
                    color="grey"
                    variant="outlined"
                    prepend-icon="mdi-filter-off"
                    class="ml-2 btn-filtros"
                    @click="limpiarFiltros"
                  >
                    Limpiar
                  </v-btn>
                </v-col>-->
              </v-row>
            </v-card>

            <!-- Tabla de Liquidaciones -->
            <v-data-table-server
              :headers="headers"
              :items="liquidaciones"
              :items-length="totalLiquidaciones"
              :loading="loading"
              :items-per-page="itemsPerPage"
              :page="page"
              @update:page="cambiarPagina"
              @update:items-per-page="cambiarItemsPorPagina"
              class="elevation-1"
              density="comfortable"
              :fixed-header="true"
              :height="auto"
            >
              <!-- Número de secuencia -->
              <template #item.nro="{ item }">
                <span class="font-weight-bold text-primary">{{ item.numeroSecuencia }}</span>
              </template>
              
              <!-- Código Liquidación -->
              <template #item.coLiquidacion="{ item }">
                <v-chip color="warning" variant="tonal" size="small">
                  {{ item.coLiquidacion }}
                </v-chip>
              </template>
              
              <!-- Fecha Instalación -->
              <template #item.fechaInstalacion="{ item }">
                <span>{{ formatearFecha(item.fechaInstalacion) }}</span>
              </template>
              
              <!-- Tipo de Instalación -->
              <template #item.tipoInstalacion="{ item }">
                <v-chip
                  :color="getColorTipoInstalacion(item.tipoInstalacionCodigo)"
                  size="small"
                  variant="outlined"
                >
                  {{ item.tipoInstalacionNombre }}
                </v-chip>
              </template>
              
              <!-- Estado Revisión -->
              <template #item.estadoRevision="{ item }">
                <v-chip
                  :color="getColorEstadoRevision(item.estadoRevisionCodigo)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.estadoRevisionNombre }}
                </v-chip>
              </template>
              
              <!-- Cliente -->
              <template #item.cliente="{ item }">
                <div class="cell-tooltip" style="max-width: 160px;">
                  <div class="font-weight-bold text-truncate" style="font-size: small; ">{{ item.nombreCliente }}</div>
                  <div class="text-caption text-grey text-truncate">{{ item.dniCliente }}</div>
                  <v-tooltip activator="parent" location="top" v-if="item.nombreCliente && item.nombreCliente.length > 12">
                    {{ item.nombreCliente }}
                  </v-tooltip>
                </div>
              </template>
              
              <!-- Dirección -->
              <template #item.direccion="{ item }">
                <div class="text-truncate" style="max-width: 200px;" :title="item.direccion">
                  <v-icon small class="mr-1">mdi-map-marker</v-icon>
                  {{ item.direccion }}
                </div>
                <v-tooltip activator="parent" location="top" v-if="item.direccion && item.direccion.length > 20">
                  {{ item.direccion }}
                </v-tooltip>
              </template>
              
              <!-- Condominio/Residencial -->
              <template #item.nombreCondominio="{ item }">
                <div v-if="item.nombreCondominio">
                  <v-chip color="info" size="small" variant="tonal">
                    {{ item.nombreCondominio }}
                  </v-chip>
                  <div class="text-caption mt-1">
                    {{ item.tipoPropiedadNombre }}
                  </div>
                </div>
                <span v-else class="text-grey">-</span>
              </template>
              
           
              
              <!-- Observaciones -->
              <template #item.observaciones="{ item }">
                <div class="text-truncate" style="max-width: 200px;">
                  <div v-if="item.observacionContrata" class="text-caption">
                    <strong>C:</strong> {{ item.observacionContrata }}
                  </div>
                  <div v-if="item.observacionOperador" class="text-caption">
                    <strong>O:</strong> {{ item.observacionOperador }}
                  </div>
                  <span v-if="!item.observacionContrata && !item.observacionOperador" class="text-grey">-</span>
                </div>
              </template>
              <!-- Fecha Sistema -->
              <template #item.creadoEn="{ item }">
                <span class="cell-simple" style="font-size: small; ">{{ formatearFechaHora(item.creadoEn) }}</span>
              </template>
              <!-- Acciones -->
              <template #item.acciones="{ item }">
                <div class="d-flex gap-1">
                  <!-- Ver detalles -->
                  <v-tooltip text="Ver detalles" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        color="info"
                        variant="text"
                        @click="verDetalle(item)"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  
                  <!-- Editar -->
                  <v-tooltip text="Editar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        color="warning"
                        variant="text"
                        @click="editarLiquidacion(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  
                  <!-- Cambiar estado -->
                  <v-tooltip text="Cambiar estado" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        color="success"
                        variant="text"
                        @click="cambiarEstado(item)"
                      >
                        <v-icon>mdi-check-circle</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  
                  <!-- Descargar PDF -->
                  <v-tooltip text="Descargar PDF" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        @click="descargarPDF(item)"
                      >
                        <v-icon>mdi-file-pdf-box</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </template>
              
              <!-- Loading -->
              <template #loading>
                <v-skeleton-loader type="table-row@10" />
              </template>

              <!-- Sin datos -->
              <template #no-data>
                <v-alert
                  type="info"
                  variant="tonal"
                  class="ma-4"
                >
                  No se encontraron liquidaciones con los filtros aplicados
                </v-alert>
              </template>
            </v-data-table-server>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para cambiar estado -->
    <v-dialog v-model="dialogEstado" max-width="500">
      <v-card>
        <v-card-title class="bg-warning text-white">
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Cambiar Estado de Revisión
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-select
            v-model="nuevoEstado"
            :items="estadosRevision"
            item-title="nombre"
            item-value="codigo"
            label="Nuevo Estado"
            variant="outlined"
            density="comfortable"
          ></v-select>
          
          <v-textarea
            v-model="comentarioEstado"
            label="Comentario"
            variant="outlined"
            density="comfortable"
            rows="3"
            class="mt-4"
          ></v-textarea>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogEstado = false">
            Cancelar
          </v-btn>
          <v-btn color="warning" @click="confirmarCambioEstado">
            Actualizar Estado
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para detalles -->
    <v-dialog v-model="dialogDetalle" max-width="800">
      <v-card>
        <v-card-title class="bg-info text-white">
          <v-icon class="mr-2">mdi-eye</v-icon>
          Detalles de Liquidación
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div v-if="liquidacionDetalle">
            <!-- Información principal -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-3">
                  <div class="text-subtitle-2 text-grey mb-2">Información General</div>
                  <v-list density="compact">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small">mdi-barcode</v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">
                        Código: {{ liquidacionDetalle.coLiquidacion }}
                      </v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small">mdi-calendar</v-icon>
                      </template>
                      <v-list-item-title>
                        Fecha Instalación: {{ formatearFechaLarga(liquidacionDetalle.fechaInstalacion) }}
                      </v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small">mdi-cog</v-icon>
                      </template>
                      <v-list-item-title>
                        Tipo: {{ liquidacionDetalle.tipoInstalacionNombre }}
                      </v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small">mdi-check-circle</v-icon>
                      </template>
                      <v-list-item-title>
                        Estado: {{ liquidacionDetalle.estadoRevisionNombre }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-3">
                  <div class="text-subtitle-2 text-grey mb-2">Información del Cliente</div>
                  <v-list density="compact">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small">mdi-account</v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">
                        {{ liquidacionDetalle.nombreCliente }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        DNI: {{ liquidacionDetalle.dniCliente }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon size="small">mdi-map-marker</v-icon>
                      </template>
                      <v-list-item-title>
                        {{ liquidacionDetalle.direccion }}
                      </v-list-item-title>
                      <v-list-item-subtitle v-if="liquidacionDetalle.torreDepartamento">
                        {{ liquidacionDetalle.torreDepartamento }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item v-if="liquidacionDetalle.nombreCondominio">
                      <template v-slot:prepend>
                        <v-icon size="small">mdi-home</v-icon>
                      </template>
                      <v-list-item-title>
                        {{ liquidacionDetalle.nombreCondominio }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ liquidacionDetalle.tipoPropiedadNombre }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- Detalles técnicos -->
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card variant="outlined" class="pa-3">
                  <div class="text-subtitle-2 text-grey mb-2">Detalles Técnicos</div>
                  <v-row>
                    <v-col cols="12" md="4">
                      <div class="d-flex align-center mb-2">
                        <v-icon size="small" class="mr-2">mdi-ruler</v-icon>
                        <span>Metraje: </span>
                        <span class="font-weight-bold ml-2">{{ liquidacionDetalle.metraje || 0 }} m</span>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" md="4">
                      <div class="d-flex align-center mb-2">
                        <v-icon size="small" class="mr-2">mdi-mesh</v-icon>
                        <span>Mesh: </span>
                        <span class="font-weight-bold ml-2">{{ liquidacionDetalle.cantidadMesh || 0 }}</span>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" md="4">
                      <div class="d-flex align-center mb-2">
                        <v-icon size="small" class="mr-2">mdi-tag</v-icon>
                        <span>Rotulado: </span>
                        <span class="font-weight-bold ml-2">{{ liquidacionDetalle.rotuladoCtoNap || 'N/A' }}</span>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" md="12">
                      <div class="d-flex align-center mb-2">
                        <v-icon size="small" class="mr-2">mdi-package</v-icon>
                        <span>Paquete: </span>
                        <span class="font-weight-bold ml-2">{{ liquidacionDetalle.paqueteServicio || 'N/A' }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- Observaciones -->
            <v-row v-if="liquidacionDetalle.observacionContrata || liquidacionDetalle.observacionOperador">
              <v-col cols="12">
                <v-card variant="outlined" class="pa-3">
                  <div class="text-subtitle-2 text-grey mb-2">Observaciones</div>
                  
                  <div v-if="liquidacionDetalle.observacionContrata" class="mb-3">
                    <div class="text-caption text-grey">Contrata:</div>
                    <div class="text-body-2">{{ liquidacionDetalle.observacionContrata }}</div>
                  </div>
                  
                  <div v-if="liquidacionDetalle.observacionOperador">
                    <div class="text-caption text-grey">Operador:</div>
                    <div class="text-body-2">{{ liquidacionDetalle.observacionOperador }}</div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="info" @click="descargarPDF(liquidacionDetalle)">
            <v-icon class="mr-2">mdi-file-pdf-box</v-icon>
            Descargar PDF
          </v-btn>
          <v-btn color="grey" variant="text" @click="dialogDetalle = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Input para importar Excel -->
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept=".xlsx, .xls"
      @change="procesarArchivoExcel"
    />

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      top
      right
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>
// En tu componente Liquidaciones.vue
<script setup>
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { 
    listarLiquidacionesService,
    obtenerTiposInstalacionService,
    obtenerEstadosRevisionService,
    obtenerTiposPropiedadService,
    actualizarEstadoRevisionService,
    importarExcelLiquidacionesService,
    formatearFecha,
    formatearFechaLarga,
    getColorTipoInstalacion,
    getColorEstadoRevision
} from '@/services/liquidacionService'
// Referencias
const loading = ref(false)
const exportando = ref(false)
const importando = ref(false)
const liquidaciones = ref([])
const totalLiquidaciones = ref(0)
const page = ref(1)
const itemsPerPage = ref(20)
const tiposInstalacion = ref([])
const estadosRevision = ref([])
const tiposPropiedad = ref([])

// Diálogos
const dialogEstado = ref(false)
const dialogDetalle = ref(false)
const liquidacionDetalle = ref(null)
const liquidacionSeleccionada = ref(null)
const nuevoEstado = ref('')
const comentarioEstado = ref('')

// Input de archivo
const fileInput = ref(null)

const filtros = ref({
  coLiquidacion: '',
  dniCliente: '',
  nombreCliente: '',
  tipoInstalacion: '',
  estadoRevision: '',
  tipoPropiedad: '',
  fechaDesde: '',
  fechaHasta: ''
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Headers de la tabla
const headers = [
  { title: 'N°', key: 'nro', width: '60px', sortable: false },
  { title: 'Código', key: 'coLiquidacion', width: '120px', sortable: false },
  { title: 'Fecha Inst.', key: 'fechaInstalacion', width: '110px', sortable: false },
  { title: 'Tipo', key: 'tipoInstalacion', width: '130px', sortable: false },
  { title: 'Estado', key: 'estadoRevision', width: '120px', sortable: false },
  { title: 'Cliente', key: 'cliente', width: '180px', sortable: false },
  { title: 'Dirección', key: 'direccion', width: '200px', sortable: false },
  { title: 'Zonal', key: 'zonal', width: '150px', sortable: false },
  { title: 'Paquete', key: 'paqueteCodigo', width: '150px', sortable: false },
  { title: 'Observaciones', key: 'observaciones', width: '150px', sortable: false },
  { title: 'Creado', key: 'creadoEn', width: '110px', sortable: false },
  { title: 'Acciones', key: 'acciones', width: '150px', sortable: false, align: 'center' }
]

// Cargar datos iniciales
onMounted(async () => {
  await Promise.all([
    cargarTiposInstalacion(),
    cargarEstadosRevision(),
    cargarTiposPropiedad(),
    cargarLiquidaciones()
  ])
})

// Funciones de carga
async function cargarTiposInstalacion() {
  try {
    tiposInstalacion.value = await getTiposInstalacion()
  } catch (error) {
    console.error('Error al cargar tipos de instalación:', error)
    mostrarSnackbar('Error al cargar tipos de instalación', 'error')
  }
}

async function cargarEstadosRevision() {
  try {
    estadosRevision.value = await getEstadosRevision()
  } catch (error) {
    console.error('Error al cargar estados de revisión:', error)
    mostrarSnackbar('Error al cargar estados de revisión', 'error')
  }
}

async function cargarTiposPropiedad() {
  try {
    tiposPropiedad.value = await getTiposPropiedad()
  } catch (error) {
    console.error('Error al cargar tipos de propiedad:', error)
    mostrarSnackbar('Error al cargar tipos de propiedad', 'error')
  }
}

async function cargarLiquidaciones() {
    loading.value = true
    try {
        const response = await listarLiquidacionesService({
            page: page.value - 1, // Convertir a 0-based para Spring
            size: itemsPerPage.value,
            coLiquidacion: filtros.value.coLiquidacion || '',
            dniCliente: filtros.value.dniCliente || '',
            nombreCliente: filtros.value.nombreCliente || '',
            tipoInstalacion: filtros.value.tipoInstalacion || '',
            estadoRevision: filtros.value.estadoRevision || '',
            tipoPropiedad: filtros.value.tipoPropiedad || '',
            fechaDesde: filtros.value.fechaDesde || '',
            fechaHasta: filtros.value.fechaHasta || ''
        })
        console.log('Respuesta del servicio:', response)  
        liquidaciones.value = response.content
        totalLiquidaciones.value = response.total
        
    } catch (error) {
        console.error('Error al cargar liquidaciones:', error)
        mostrarSnackbar('Error al cargar liquidaciones', 'error')
    } finally {
        loading.value = false
    }
}

async function confirmarCambioEstado() {
    if (!nuevoEstado.value || !liquidacionSeleccionada.value) return
    
    try {
        const usuario = 'admin' // Obtener del estado de autenticación
        const resultado = await actualizarEstadoRevisionService(
            liquidacionSeleccionada.value.id,
            nuevoEstado.value,
            usuario,
            comentarioEstado.value
        )
        
        if (resultado.success) {
            mostrarSnackbar('Estado actualizado correctamente', 'success')
            cargarLiquidaciones()
        } else {
            mostrarSnackbar('Error al actualizar el estado', 'error')
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error)
        mostrarSnackbar('Error al cambiar el estado: ' + error.message, 'error')
    } finally {
        dialogEstado.value = false
        liquidacionSeleccionada.value = null
    }
}

async function procesarArchivoExcel(event) {
    const file = event.target.files[0]
    if (!file) return
    
    importando.value = true
    
    try {
        const usuario = 'admin' // Obtener del estado de autenticación
        const resultado = await importarExcelLiquidacionesService(file, usuario)
        
        if (resultado.success) {
            mostrarSnackbar(`Importación exitosa: ${resultado.registrosImportados} registros`, 'success')
            cargarLiquidaciones()
        } else {
            mostrarSnackbar('Error en la importación: ' + resultado.message, 'error')
        }
    } catch (error) {
        console.error('Error al importar Excel:', error)
        mostrarSnackbar('Error al importar archivo Excel: ' + error.message, 'error')
    } finally {
        importando.value = false
        event.target.value = ''
    }
}
function buscarLiquidaciones() {
  page.value = 1
  cargarLiquidaciones()
}
function formatearFechaHora(fecha) {
  if (!fecha) return '-'
  
  try {
    const date = new Date(fecha)
    
    if (isNaN(date.getTime())) return '-'
    
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const anio = date.getFullYear()
    const horas = String(date.getHours()).padStart(2, '0')
    const minutos = String(date.getMinutes()).padStart(2, '0')
    
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error)
    return '-'
  }
}
async function exportarExcel() {
  exportando.value = true
  try {
    mostrarSnackbar('Generando reporte Excel, por favor espere...', 'info')
    
    // Obtener TODAS las liquidaciones sin paginación
    const response = await listarLiquidacionesService({
      page: 0,
      size: 10000,
      coLiquidacion: '',
      dniCliente: '',
      nombreCliente: '',
      tipoInstalacion: '',
      estadoRevision: '',
      tipoPropiedad: '',
      fechaDesde: filtros.value.fechaDesde || '',
      fechaHasta: filtros.value.fechaHasta || ''
    })
    
    const todasLiquidaciones = response.content || []
    
    if (todasLiquidaciones.length === 0) {
      mostrarSnackbar('No hay datos para exportar', 'warning')
      return
    }

    // ============================================
    // HOJA 1: DOCUMENTOS
    // ============================================
    const datosDocumentos = todasLiquidaciones.map((item, index) => ({
      'CO_LIQUIDACION': item.coLiquidacion || '',
      'CO_ORDENSERVICIO': '0',
      'CO_CLIENTEORDEN': '0',
      'NO_ZONAL': item.zonalCodigo || 'LIM',
      'NO_MES': '',
      'NO_NEGOCIO': 'FIBRA',
      'NO_ACTIVIDAD': 'ALTA',
      'NO_TIFICACIONATENCION': item.tipoInstalacionNombre || 'INSTALACIÓN NUEVA',
      'NO_TIPOVIVIENDA': item.tipoPropiedadNombre || '',
      'NU_ORDEN': item.numeroSecuencia || item.codigoPedido || '',
      'NO_MDF': '',
      'NO_SERVICIO': '',
      'NU_TELEFONO': '',
      'NU_PETICION': '',
      'FE_LIQUIDACIONLEGADO': item.fechaInstalacion || '',
      'FE_LIQUIDACIONINTERNO': item.fechaInstalacion || '',
      'TX_OBSERVACION': '',
      'SS_BAREMO': '0',
      'NO_PREFIJO': '',
      'TX_CARNET': item.codigoPedido || '',
      'NU_DNI': item.dniCliente || '',
      'NO_PERSONAL': item.nombreTecnico || item.nombreCliente || '',
      'NO_CONTRATISTA': 'ROGEDI NETWORD SAC',
      'NO_ESTADO': item.estadoRevisionNombre || 'LIQUIDADO',
      'NO_USUARIO': item.creadoPor || 'KRODRIGUEZ2',
      'NO_CLIENTE': item.nombreCliente || '',
      'NO_DIRECCION': item.direccion || 'Soporte Técnico Sin Costo',
      'NU_VELOCIDAD': item.paqueteVelocidad || 250,
      'NO_RUTULADOCTO': item.rotuladoCtoNap || '',
      'NU_ACTA': item.numeroActa || item.codigoPedido || '',
      'NU_GUIA': item.numeroActa || item.codigoPedido || '',
      'NU_DNICLIENTE': item.dniCliente || '',
      'MESH_HUAWEI': '',
      'CABLE_DROP': ''
    }))

    // ============================================
    // HOJA 2: DETALLE ARTICULO
    // ============================================
    // Primero necesitamos obtener los detalles de materiales
    // Esto debería venir de un servicio específico
    // Por ahora, generamos datos simulados basados en las liquidaciones
    const datosDetalleArticulo = []
    
    todasLiquidaciones.forEach((item, index) => {
      // Si tiene metraje, agregamos cable drop
      if (item.metraje && item.metraje > 0) {
        datosDetalleArticulo.push({
          'CO_ORDENSERVICIO': '0',
          'CO_CLIENTEORDEN': '0',
          'NO_ZONAL': item.zonalCodigo || 'LIM',
          'NO_MES': '',
          'NO_NEGOCIO': 'FIBRA',
          'NO_ACTIVIDAD': 'ALTA',
          'NU_ORDEN': item.numeroSecuencia || item.codigoPedido || '',
          'NO_MDF': '',
          'NO_SERVICIO': '',
          'NU_TELEFONO': '',
          'NU_PETICION': '',
          'FE_LIQUIDACIONLEGADO': item.fechaInstalacion || '',
          'CO_LIQUIDACION': item.coLiquidacion || '',
          'FE_LIQUIDACIONINTERNO': item.fechaInstalacion || '',
          'TX_OBSERVACION': '',
          'SS_BAREMO': '0',
          'NO_PREFIJO': '',
          'TX_CARNET': item.codigoPedido || '',
          'NO_PERSONAL': item.nombreTecnico || '',
          'NO_CONTRATISTA': 'ROGEDI NETWORD SAC',
          'NO_ESTADO': item.estadoRevisionNombre || 'LIQUIDADO',
          'NO_USUARIO': item.creadoPor || 'HTALLA',
          'TIPO': '1',
          'CABLE DROP 1H': item.metraje || 0,
          'CINTA AISLANTE 3M 18MTS/19 MM/0.15MM': '',
          'CINTILLO 100MM X2.5MM NEGRO': Math.ceil(item.metraje / 10) || 10,
          'CINTILLO DE IDENTIFICACION': '1',
          'CONECTOR SC APC FAST CONNECTOR TIPO CLIPE SC/APC': '2',
          'GRAPA P/CR-6 (NC-1N) 6MM WIR GRIS': Math.ceil(item.metraje / 5) || 10,
          'ONT ATW 624GS GPON HGU WIFI5 AC2100': item.paqueteVelocidad <= 300 ? '1' : '',
          'ONT ZTE ZXHN F6600P GPON GATEWAY WIF16 AX3000 DUAL': item.paqueteVelocidad > 300 ? '1' : '',
          'PATCH CORD APC': '1',
          'ROSETTA 1 PORTS FTTH TERMINAL': '1',
          'SUJETADOR DE ANCLAJE SS-P-HOOK - JV': item.tipoPropiedadNombre === 'CONDOMINIO' ? '1' : '',
          'TARUGO PLASTICO N6 X 100': item.tipoPropiedadNombre === 'CONDOMINIO' ? '1' : '',
          'TELEFONO ANALOGO': '',
          'TEMPLADO TIPO P': Math.ceil(item.metraje / 25) || 4
        })
      }
    })

    // ============================================
    // HOJA 3: DETALLE SERIES
    // ============================================
    const datosDetalleSeries = []
    
    todasLiquidaciones.forEach((item, index) => {
      // Generar serie simulada basada en el código de liquidación
      const serieOnt = generarSerieOnt(item.coLiquidacion, item.paqueteVelocidad)
      
      datosDetalleSeries.push({
        'CO_ORDENSERVICIO': '0',
        'CO_CLIENTEORDEN': '0',
        'NO_ZONAL': item.zonalCodigo || 'LIM',
        'NO_MES': '',
        'NO_NEGOCIO': 'FIBRA',
        'NO_ACTIVIDAD': 'ALTA',
        'NU_ORDEN': item.numeroSecuencia || item.codigoPedido || '',
        'NO_MDF': '',
        'NO_SERVICIO': '',
        'NU_TELEFONO': '',
        'NU_PETICION': '',
        'FE_LIQUIDACIONLEGADO': item.fechaInstalacion || '',
        'CO_LIQUIDACION': item.coLiquidacion || '',
        'FE_LIQUIDACIONINTERNO': item.fechaInstalacion || '',
        'TX_OBSERVACION': '',
        'SS_BAREMO': '0',
        'NO_PREFIJO': '',
        'TX_CARNET': item.codigoPedido || '',
        'NO_PERSONAL': item.nombreTecnico || '',
        'NO_CONTRATISTA': 'ROGEDI NETWORD SAC',
        'NO_ESTADO': item.estadoRevisionNombre || 'LIQUIDADO',
        'NO_USUARIO': item.creadoPor || 'HTALLA',
        'TIPO': '2',
        'CO_SAP': item.paqueteVelocidad > 300 ? '5974' : '3978',
        'NO_ARTICULO': item.paqueteVelocidad > 300 
          ? 'ONT ZTE ZXHN F6600P GPON GATEWAY WIF16 AX3000 DUAL'
          : 'ONT ATW 624GS GPON HGU WIFI5 AC2100',
        'NU_SERIE': serieOnt,
        'S/N_ONT': '',
        'NU_SERIEDEVUELTA': ''
      })
    })

    // ============================================
    // HOJA 4: CONSOLIDAR DETALLE
    // ============================================
    const datosConsolidarDetalle = [
      {
        'COLUMN1': 'Se pasó un parámetro de longitud no válido a la función LEFT o SUBSTRING.',
        'COLUMN2': ''
      }
    ]

    // ============================================
    // HOJA 5: CONSOLIDADO
    // ============================================
    const datosConsolidado = todasLiquidaciones.map((item, index) => ({
      'CO_LIQUIDACION': item.coLiquidacion || '',
      'N°': index + 1,
      'FECHA DE INSTALACIÓN': item.fechaInstalacion || '',
      'TIPO DE PARTIDA': item.tipoPartida || '0',
      'CONDOMINIO O RESIDENCIAL': item.tipoPropiedadNombre || '',
      'TIPO DE INSTALACION': item.tipoInstalacionNombre || 'INSTALACIÓN NUEVA',
      'ESTADO DE REVISION(SOLO PARA RESPONSABLE DE LIQUIDACIÓN)': '0',
      'N° ACTA': item.numeroActa || item.codigoPedido || '',
      'CÓDIGO DE PEDIDO': item.codigoPedido || '',
      'DNI': item.dniCliente || '',
      'CLIENTE': item.nombreCliente ? item.nombreCliente.split(' ').pop() || '' : '',
      'DIRECCION': item.direccion || 'Soporte Técnico Sin Costo',
      'TORRE_DEPARTAMENTO': item.torreDepartamento || '',
      'CONDOMINIO': item.nombreCondominio || '',
      'PAQUETE DE SERVICIO': item.paqueteNombre || item.direccion || 'Soporte Técnico Sin Costo',
      'METRAJE': item.metraje || '',
      'CANTIDAD DE MESH': item.cantidadMesh || '',
      'ROTULADO DE CTO Ó CAJA NAP': item.rotuladoCtoNap || '',
      'OBSERVACIÓN DE LA CONTRATA': item.observacionContrata || '',
      'OBSERVACIÓN DEL OPERADOR': item.observacionOperador || ''
    }))

    // ============================================
    // CREAR WORKBOOK Y AGREGAR HOJAS
    // ============================================
    const workbook = XLSX.utils.book_new()

    // Hoja 1: Documentos
    const worksheet1 = XLSX.utils.json_to_sheet(datosDocumentos)
    worksheet1['!cols'] = generarAnchosColumnas(datosDocumentos[0])
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'Documentos')

    // Hoja 2: Detalle Articulo
    const worksheet2 = XLSX.utils.json_to_sheet(datosDetalleArticulo)
    worksheet2['!cols'] = generarAnchosColumnas(datosDetalleArticulo[0] || {})
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'Detalle Articulo')

    // Hoja 3: Detalle Series
    const worksheet3 = XLSX.utils.json_to_sheet(datosDetalleSeries)
    worksheet3['!cols'] = generarAnchosColumnas(datosDetalleSeries[0] || {})
    XLSX.utils.book_append_sheet(workbook, worksheet3, 'Detalle Series')

    // Hoja 4: Consolidar Detalle
    const worksheet4 = XLSX.utils.json_to_sheet(datosConsolidarDetalle)
    worksheet4['!cols'] = [{ wch: 80 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(workbook, worksheet4, 'Consolidar Detalle')

    // Hoja 5: Consolidado
    const worksheet5 = XLSX.utils.json_to_sheet(datosConsolidado)
    worksheet5['!cols'] = generarAnchosColumnas(datosConsolidado[0] || {})
    XLSX.utils.book_append_sheet(workbook, worksheet5, 'Consolidado')

    // ============================================
    // GENERAR NOMBRE DE ARCHIVO Y DESCARGAR
    // ============================================
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const nombreArchivo = `Liquidaciones_${fecha}.xlsx`
    
    XLSX.writeFile(workbook, nombreArchivo)
    
    mostrarSnackbar(`Reporte Excel generado exitosamente con ${todasLiquidaciones.length} registros`, 'success')
    
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    mostrarSnackbar('Error al generar el reporte Excel: ' + (error.message || 'Error desconocido'), 'error')
  } finally {
    exportando.value = false
  }
}

// Función auxiliar para generar anchos de columna dinámicamente
function generarAnchosColumnas(obj) {
  if (!obj) return []
  return Object.keys(obj).map(key => ({ wch: Math.min(50, key.length + 10) }))
}

// Función auxiliar para generar series de ONT simuladas
function generarSerieOnt(coLiquidacion, velocidad) {
  if (!coLiquidacion) return ''
  
  const prefijo = velocidad > 300 ? '48D682E' : 'D40145E'
  const sufijo = coLiquidacion.toString().slice(-4).padStart(4, '0')
  return `${prefijo}${sufijo}`
}
function mostrarSnackbar(text, color = 'success') {
  snackbar.value.text = text
  snackbar.value.color = color
  snackbar.value.show = true
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 50%, #ffe082 100%);
  min-height: 100vh;
}

.rounded-xl {
  border-radius: 16px !important;
}

.bg-warning {
  background-color: #1976D2 !important;
}

.btn-filtros {
  height: 3rem;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  display: block;
  max-width: 100%;
}
.cell-tooltip .text-truncate {
  display: block;
  width: 100%;
}
.opacity-75 {
  opacity: 0.75;
}
.contenedor {
  padding-top: 20px;
  padding-bottom: 20px;
  max-width: 100%;
}
</style>