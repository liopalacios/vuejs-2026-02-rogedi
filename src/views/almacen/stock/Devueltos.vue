<template>
  <v-container fluid class=" bg-gradient p-0" style="padding: 0!important;">
    <v-row justify="center" class="contenedor" style="padding: 0!important;margin: 0;">
      <v-col cols="12" style="padding: 0!important;">
        <v-card elevation="12" class="rounded-xl">
          <!-- Header -->
          <v-card-title class="bg-success text-white pa-3">
            <div class="d-flex align-center justify-space-between">
              <div>
                <h1 class="text-h6 font-weight-bold">
                  <v-icon class="mr-2">mdi-account-check</v-icon>
                  Control de Stock - Materiales Devueltos
                </h1>
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
            <v-card class="mb-1 pa-4" style="box-shadow: none;">
              <v-row>
                <v-col cols="12" md="2">
                  <v-autocomplete
                    v-model="filtros.zonal"
                    :items="zonales"
                    item-title="nombre"
                    item-value="codigo"
                    label="Zonal"
                    prepend-inner-icon="mdi-map-marker"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="buscarStock"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.tecnico"
                    label="Técnico"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @keyup.enter="buscarStock"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.fechaDesde"
                    label="Fecha Desde"
                    type="date"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="buscarStock"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.fechaHasta"
                    label="Fecha Hasta"
                    type="date"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="buscarStock"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    color="success"
                    class="btn-filtros"
                    prepend-icon="mdi-magnify"
                    @click="buscarStock"
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
                </v-col>
              </v-row>
            </v-card>
            
            <!-- Tabla de Stock Devueltos -->
            <v-data-table-server
              :headers="headers"
              :items="devueltos"
              :items-length="totalDevueltos"
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
              <!-- Contratista -->
              <template #item.contratista="{ item }">
                <div class="cell-center" style="width: 100px;">
                  <span class="text-truncate">
                    {{ item.contratista || '-' }}
                  </span>

                  <v-tooltip
                    activator="parent"
                    location="top"
                    v-if="item.contratista && item.contratista.length > 10"
                  >
                    {{ item.contratista }}
                  </v-tooltip>
                </div>
              </template>

              <!-- Fecha Movimiento -->
              <template #item.fecMovimiento="{ item }" >
                <span class="cell-simple" style="width: 100px;">{{ formatearFecha(item.fecMovimiento) }}</span>
              </template>

              <!-- Tipo Movimiento -->
              <template #item.tipoMovimiento="{ item }">
                <v-chip
                  color="info"
                  size="small"
                  variant="outlined"
                  class="chip-cell"
                  style="max-width: 120px;"
                >
                  {{ item.tipoMovimiento || '-' }}
                </v-chip>
              </template>

              <!-- Condición -->
              <template #item.condicion="{ item }">
                <v-chip
                  :color="getCondicionColor(item.condicion)"
                  size="small"
                  variant="tonal"
                  class="chip-cell"
                  style="max-width: 120px;"
                >
                  {{ item.condicion || '-' }}
                </v-chip>
              </template>

              <!-- Tipo Documento -->
              <template #item.tipoDocumento="{ item }">
                <div class="cell-center" style="max-width: 100px;">
                  <span class="text-truncate" style="font-size: x-small; font-weight: bold;">{{ item.tipoDocumento || '-' }}</span>
                  <v-tooltip activator="parent" location="top" v-if="item.tipoDocumento && item.tipoDocumento.length > 12">
                    {{ item.tipoDocumento }}
                  </v-tooltip>
                </div>
              </template>

              <!-- Nro. Documento -->
              <template #item.numDocumento="{ item }">
                <div class="cell-center" style="max-width: 100px;">
                  <span class="text-truncate" style="font-size: small; ">{{ item.numDocumento || '-' }}</span>
                  <v-tooltip activator="parent" location="top" v-if="item.numDocumento && item.numDocumento.length > 12">
                    {{ item.numDocumento }}
                  </v-tooltip>
                </div>
              </template>

              <!-- Doc. referencia -->
              <template #item.nroDocref="{ item }">
                <div class="cell-center" style="width: 70px;">
                  <span class="text-truncate" style="font-size: small; ">{{ item.nroDocref || '-' }}</span>
                  <v-tooltip activator="parent" location="top" v-if="item.nroDocref && item.nroDocref.length > 12">
                    {{ item.nroDocref }}
                  </v-tooltip>
                </div>
              </template>

              <!-- Id Usuario -->
              <template #item.usuarioId="{ item }">
                <span class="cell-simple" style="width: 60px; display: block; text-align: center;">{{ item.usuarioId || '-' }}</span>
              </template>

              <!-- Usuario -->
              <template #item.usuarioRegistro="{ item }">
                <div class="cell-center" style="width: 80px;">
                  <span class="text-truncate">{{ item.usuarioRegistro || '-' }}</span>
                  <v-tooltip activator="parent" location="top" v-if="item.usuarioRegistro && item.usuarioRegistro.length > 10">
                    {{ item.usuarioRegistro }}
                  </v-tooltip>
                </div>
              </template>

              <!-- Técnico -->
              <template #item.tecnico="{ item }">
                <div class="cell-center">
                  <div class="text-truncate"  style="width: 90px;">
                    <div class="font-weight-bold text-truncate">{{ item.tecnicoNombreCompleto || '-' }}</div>
                    
                  </div>
                  <v-tooltip activator="parent" location="top" 
                    v-if="(item.tecnicoNombreCompleto && item.tecnicoNombreCompleto.length > 12) || 
                          (item.tecnicoCodigo && item.tecnicoCodigo.length > 6)">
                    <div class="text-tooltip">
                      <div class="font-weight-bold">{{ item.tecnicoNombreCompleto || '-' }}</div>
                      <div class="text-caption">{{ item.tecnicoCodigo || '' }}</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>
              <template #item.observacion="{ item }">
                <div class="text-truncate" style="width: 200px;">
                  {{ item.observacion || '-' }}
                </div>
                <v-tooltip activator="parent" location="top" v-if="item.observacion && item.observacion.length > 12">
                  {{ item.observacion }}
                </v-tooltip>
              </template>
              <!-- Fecha Sistema -->
              <template #item.creadoEn="{ item }">
                <span class="cell-simple" style="font-size: small; ">{{ formatearFechaHora(item.creadoEn) }}</span>
              </template>

              <!-- Acciones -->
              <template #item.acciones="{ item }">
                <div class="d-flex gap-1">
                  <v-tooltip text="Ver detalle" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        color="grey"
                        variant="text"
                        @click="verDetalle(item)"
                      >
                        <v-icon>mdi-eye</v-icon>
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
                  No se encontraron registros con los filtros aplicados
                </v-alert>
              </template>
            </v-data-table-server>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
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

<script setup>
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { listarStockDevueltos, listarZonales, abrirPDFEnNuevaPestaña } from '@/services/stockService'

// Referencias
const loading = ref(false)
const devueltos = ref([])
const totalDevueltos = ref(0)
const page = ref(1)
const itemsPerPage = ref(20)
const exportando = ref(false)
const zonales = ref([])
const idMovimiento = ref(null)
const filtros = ref({
  contratista: '',
  condicion: '',
  zonal: '',
  sap: '',
  articulo: '',
  serie: '',
  tecnico: '',
  tipoMovimiento: '',
  fechaDesde: '',
  fechaHasta: ''
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Headers de la tabla - con ancho fijo
const headers = [
  { title: 'Contratista', key: 'contratista', width: '80px', sortable: false },
  { title: 'Fecha Mov.', key: 'fecMovimiento', width: '100px', sortable: false },
  { title: 'Tipo Mov.', key: 'tipoMovimiento', width: '110px', sortable: false },
  { title: 'Condición', key: 'condicion', width: '110px', sortable: false },
  { title: 'Tipo Doc.', key: 'tipoDocumento', width: '100px', sortable: false },
  { title: 'Nro. Doc.', key: 'numDocumento', width: '100px', sortable: false },
  { title: 'Doc. Ref.', key: 'nroDocref', width: '100px', sortable: false },
  { title: 'Técnico', key: 'tecnico', width: '150px', sortable: false },
  { title: 'Observación', key: 'observacion', width: '190px', sortable: false },
  { title: 'ID User', key: 'usuarioId', width: '80px', sortable: false },
  { title: 'Usuario', key: 'usuarioRegistro', width: '100px', sortable: false },
 
  { title: 'Fecha Sis.', key: 'creadoEn', width: '120px', sortable: false },
  { title: 'Acciones', key: 'acciones', width: '80px', sortable: false, align: 'center' }
]

// Cargar datos iniciales
onMounted(async () => {
  await Promise.all([
    cargarZonales(),
    cargarDevueltos()
  ])
})

// Funciones de carga
async function cargarZonales() {
  try {
    zonales.value = await listarZonales()
  } catch (error) {
    console.error('Error al cargar zonales:', error)
    mostrarSnackbar('Error al cargar zonales', 'error')
  }
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

async function verDetalle(movimiento) {
  idMovimiento.value = movimiento.movimientoId
  try {
    abrirPDFEnNuevaPestaña(movimiento.movimientoId)
    console.log('Cargando detalle para movimiento:', movimiento)
    console.log('Detalle del movimiento:', idMovimiento.value)
  } catch (e) {
    mostrarSnackbar('Error al cargar el detalle', 'error')
  }
}

async function cargarDevueltos() {
  loading.value = true
  try {
    const { content, total } = await listarStockDevueltos({
      contratista: filtros.value.contratista || '',
      condicion: filtros.value.condicion || '',
      zonal: filtros.value.zonal || '',
      sap: filtros.value.sap || '',
      articulo: filtros.value.articulo || '',
      serie: filtros.value.serie || '',
      tecnico: filtros.value.tecnico || '',
      tipoMovimiento: filtros.value.tipoMovimiento || '',
      fechaDesde: filtros.value.fechaDesde || '',
      fechaHasta: filtros.value.fechaHasta || '',
      page: page.value - 1,
      size: itemsPerPage.value
    })
    console.log('Devueltos cargados:', content)
    devueltos.value = content
    totalDevueltos.value = total
  } catch (error) {
    console.error('Error al cargar devueltos:', error)
    
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      mostrarSnackbar('Servicio no disponible. Por favor, intente más tarde.', 'error')
    } else {
      mostrarSnackbar('Error al cargar el stock devueltos', 'error')
    }
  } finally {
    loading.value = false
  }
}

// Funciones de búsqueda y filtros
function buscarStock() {
  page.value = 1
  cargarDevueltos()
}

function limpiarFiltros() {
  filtros.value = {
    contratista: '',
    condicion: '',
    zonal: '',
    sap: '',
    articulo: '',
    serie: '',
    tecnico: '',
    tipoMovimiento: '',
    fechaDesde: '',
    fechaHasta: ''
  }
  page.value = 1
  cargarDevueltos()
}

// Paginación
function cambiarPagina(nuevaPagina) {
  page.value = nuevaPagina
  cargarDevueltos()
}

function cambiarItemsPorPagina(nuevoSize) {
  itemsPerPage.value = nuevoSize
  page.value = 1
  cargarDevueltos()
}

// Otras funciones
function actualizarStock() {
  cargarDevueltos()
  mostrarSnackbar('Stock actualizado', 'success')
}

async function exportarExcel() {
  exportando.value = true
  try {
    mostrarSnackbar('Generando reporte Excel, por favor espere...', 'info')
    
    const { content: todosDevueltos } = await listarStockDevueltos({
      contratista: filtros.value.contratista || '',
      condicion: filtros.value.condicion || '',
      zonal: filtros.value.zonal || '',
      sap: filtros.value.sap || '',
      articulo: filtros.value.articulo || '',
      serie: filtros.value.serie || '',
      tecnico: filtros.value.tecnico || '',
      tipoMovimiento: filtros.value.tipoMovimiento || '',
      fechaDesde: filtros.value.fechaDesde || '',
      fechaHasta: filtros.value.fechaHasta || '',
      page: 0,
      size: 10000
    })
    
    const datosExcel = todosDevueltos.map((item, index) => ({
      '#': index + 1,
      'Código Movimiento': item.movimientoId || '',
      'Contratista': item.contratista || '',
      'Cód Zonal': item.codZonal || '',
      'Tipo Movimiento': item.tipoMovimiento || '',
      'Condición': item.condicion || '',
      'Tipo Documento': item.tipoDocumento || '',
      'Num Documento': item.numDocumento || '',
      'Fec Movimiento': formatearFecha(item.fecMovimiento),
      'Nro Doc Ref': item.nroDocref || '',
      'Nro Destino Ref': item.nroDestinoref || '',
      'Glosa': item.glosa || '',
      'Código Usuario': item.usuarioId || '',
      'Usuario Registro': item.usuarioRegistro || '',
      'Fecha Sistema': formatearFechaHora(item.creadoEn || ''),
      'SAP': item.sap || '',
      'Artículo': item.articulo || '',
      'Serie': item.serie || '',
      'Técnico': item.tecnicoNombreCompleto || '',
      'Código Técnico': item.tecnicoCodigo || ''
    }))
    
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(datosExcel)
    
    worksheet['!cols'] = [
      { wch: 5 },   // #
      { wch: 15 },  // Código Movimiento
      { wch: 20 },  // Contratista
      { wch: 10 },  // Cód Zonal
      { wch: 15 },  // Tipo Movimiento
      { wch: 15 },  // Condición
      { wch: 15 },  // Tipo Documento
      { wch: 15 },  // Num Documento
      { wch: 12 },  // Fec Movimiento
      { wch: 15 },  // Nro Doc Ref
      { wch: 15 },  // Nro Destino Ref
      { wch: 30 },  // Glosa
      { wch: 10 },  // Código Usuario
      { wch: 15 },  // Usuario Registro
      { wch: 18 },  // Fecha Sistema
      { wch: 12 },  // SAP
      { wch: 40 },  // Artículo
      { wch: 20 },  // Serie
      { wch: 25 },  // Técnico
      { wch: 15 }   // Código Técnico
    ]
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Devueltos')
    
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const hora = new Date().toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '')
    const nombreArchivo = `Reporte_Stock_Devueltos_${fecha}_${hora}.xlsx`
    
    XLSX.writeFile(workbook, nombreArchivo)
    
    mostrarSnackbar('Reporte Excel generado exitosamente', 'success')
    
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    mostrarSnackbar('Error al generar el reporte Excel', 'error')
  } finally {
    exportando.value = false
  }
}

function mostrarSnackbar(text, color = 'success') {
  snackbar.value.text = text
  snackbar.value.color = color
  snackbar.value.show = true
}

function getCondicionColor(condicion) {
  const colors = {
    'NUEVO': 'success',
    'FALLO-FABRICA': 'warning',
    'ROBADO': 'error',
    'INOPERATIVO': 'error'
  }
  return colors[condicion] || 'grey'
}

function formatearFecha(fecha) {
  if (!fecha) return '-'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES')
}



</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #fff9c4 100%);
  min-height: 100vh;
}

.rounded-xl {
  border-radius: 16px !important;
}

.bg-success {
  background-color: #1976D2 !important;
}

.btn-filtros {
  height: 3rem;
}

.contenedor {
  padding-top: 20px;
  padding-bottom: 20px;
  max-width: 100%;
}

/* Estilos para celdas de una sola línea */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 100%;
}

.cell-tooltip {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.cell-tooltip .text-truncate {
  display: block;
  width: 100%;
}

.cell-simple {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chip-cell {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Asegurar que todas las filas tengan la misma altura */
:deep(.v-data-table__tr) {
  height: 48px !important;
  max-height: 48px !important;
}

:deep(.v-data-table__td) {
  padding: 0 8px !important;
  height: 48px !important;
  max-height: 48px !important;
  vertical-align: middle !important;
  overflow: hidden !important;
}

:deep(.v-data-table__td > *) {
  max-height: 48px !important;
  overflow: hidden !important;
}

/* Tooltip personalizado */
.text-tooltip {
  max-width: 300px;
  word-wrap: break-word;
  white-space: normal;
}

/* Estilo para el contenedor de la tabla */
:deep(.v-data-table) {
  table-layout: fixed !important;
}

:deep(.v-data-table__wrapper) {
  max-height: 650px !important;
  overflow-y: auto !important;
}

/* Scrollbar personalizado */
:deep(.v-data-table__wrapper::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-thumb) {
  background: #888;
  border-radius: 4px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-thumb:hover) {
  background: #555;
}
</style>