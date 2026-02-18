<template>
  <v-container fluid class="fill-height bg-gradient">
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="12" class="rounded-xl">
          <!-- Header -->
          <v-card-title class="bg-primary text-white pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <h1 class="text-h5 font-weight-bold">
                  <v-icon class="mr-2">mdi-package-variant</v-icon>
                  Stock General - (MATERIAL NUEVO)
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
            <!-- Tabs -->
            <v-tabs v-model="tabActual" bg-color="primary" dark class="mb-4">
              <v-tab value="detalle">
                <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                Detalle
              </v-tab>
              <v-tab value="series">
                <v-icon class="mr-2">mdi-format-list-numbered</v-icon>
                Series
              </v-tab>
            </v-tabs>

            <!-- Filtros -->
            <v-card class="mb-1 pa-4" style="box-shadow: none;">
              <v-row>
                

                <v-col cols="12" md="2">
                  <v-select
                    v-model="filtros.condicion"
                    :items="condiciones"
                    label="Condición"
                    prepend-inner-icon="mdi-tag"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="buscarStock"
                  ></v-select>
                </v-col>

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

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="filtros.sap"
                    label="SAP"
                    prepend-inner-icon="mdi-barcode"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @keyup.enter="buscarStock"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.articulo"
                    label="Artículo"
                    prepend-inner-icon="mdi-text-search"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @keyup.enter="buscarStock"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-magnify"
                    @click="buscarStock"
                  >
                    Buscar
                  </v-btn>
                  <v-btn
                    color="grey"
                    variant="outlined"
                    prepend-icon="mdi-filter-off"
                    class="ml-2"
                    @click="limpiarFiltros"
                  >
                    Limpiar
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" class="text-right">
                  
                </v-col>
              </v-row>
            </v-card>

            <!-- Tabla de Stock -->
            <v-window v-model="tabActual">
              <!-- Tab Detalle -->
              <v-window-item value="detalle">
                <v-data-table-server
                  :headers="headersDetalle"
                  :items="stock"
                  :items-length="totalStock"
                  :loading="loading"
                  :items-per-page="itemsPerPage"
                  :page="page"
                  @update:page="cambiarPagina"
                  @update:items-per-page="cambiarItemsPorPagina"
                  class="elevation-1"
                  density="comfortable"
                >
                  <!-- Contratista -->
                  <template #item.contratista="{ item }">
                    <div class="text-truncate" style="max-width: 200px;">
                      {{ item.contratista }}
                    </div>
                  </template>

                  <!-- Condición -->
                  <template #item.condicion="{ item }">
                    <v-chip
                      :color="item.condicion === 'NUEVO' ? 'success' : 'warning'"
                      size="small"
                      variant="tonal"
                    >
                      {{ item.condicion }}
                    </v-chip>
                  </template>

                  <!-- Zonal -->
                  <template #item.zonal="{ item }">
                    <v-chip
                      color="primary"
                      size="small"
                      variant="outlined"
                    >
                      {{ item.zonal }}
                    </v-chip>
                  </template>

                  <!-- SAP -->
                  <template #item.sap="{ item }">
                    <span class="font-weight-bold">{{ item.sap || '-' }}</span>
                  </template>

                  <!-- Artículo -->
                  <template #item.articulo="{ item }">
                    <div class="text-truncate" style="max-width: 300px;">
                      {{ item.articulo }}
                    </div>
                  </template>

                  <!-- (S) - Marca de series -->
                  <template #item.marcaSeries="{ item }">
                    <v-chip
                      v-if="item.marcaSeries === 'S'"
                      color="warning"
                      size="small"
                      @click="irASeries(item)"
                      variant="flat"
                    >
                      S
                    </v-chip>
                  </template>

                  <!-- Stock -->
                  <template #item.stockTotal="{ item }">
                    <v-chip
                      :color="item.stockTotal > 0 ? 'success' : 'error'"
                      size="small"
                      variant="tonal"
                    >
                      {{ item.stockTotal }}
                    </v-chip>
                  </template>

                  <!-- Disponible -->
                  <template #item.stockDisponible="{ item }">
                    <span class="font-weight-bold text-success">
                      {{ item.stockDisponible }}
                    </span>
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
              </v-window-item>

              <!-- Tab Series -->
              <v-window-item value="series">
                <v-data-table-server
                  :headers="headersSeries"
                  :items="series"
                  :items-length="totalSeries"
                  :loading="loadingSeries"
                  :items-per-page="itemsPerPageSeries"
                  :page="pageSeries"
                  density="comfortable"
                  class="elevation-1"
                  @update:page="cambiarPaginaSeries"
                  @update:items-per-page="cambiarItemsPorPaginaSeries"
                >
                  <!-- Condición -->
                  <template #item.condicion="{ item }">
                    <v-chip
                      :color="item.condicion === 'NUEVO' ? 'success' : item.condicion === 'INOPERATIVO' ? 'error' : 'warning'"
                      size="small"
                      variant="tonal"
                    >
                      {{ item.condicion }}
                    </v-chip>
                  </template>

                  <!-- SAP -->
                  <template #item.sap="{ item }">
                    <span class="font-weight-bold">{{ item.sap }}</span>
                  </template>

                  <!-- Artículo -->
                  <template #item.articulo="{ item }">
                    <div class="text-truncate" style="max-width: 350px;">
                      {{ item.articulo }}
                    </div>
                  </template>

                  <!-- Serie -->
                  <template #item.serie="{ item }">
                    <span class="font-weight-bold text-primary">
                      {{ item.serie }}
                    </span>
                  </template>

                  <!-- Último Movimiento -->
                  <template #item.ultimoMovimiento="{ item }">
                    <v-chip
                      color="info"
                      size="small"
                      variant="outlined"
                    >
                      {{ item.ultimoMovimiento }}
                    </v-chip>
                  </template>

                  <!-- Días -->
                  <template #item.dias="{ item }">
                    <v-chip
                      :color="item.dias > 180 ? 'error' : 'success'"
                      size="small"
                      variant="tonal"
                    >
                      {{ item.dias }}
                    </v-chip>
                  </template>

                  <!-- Loading -->
                  <template #loading>
                    <v-skeleton-loader type="table-row@10" />
                  </template>

                  <!-- Sin datos -->
                  <template #no-data>
                    <v-alert type="info" variant="tonal" class="ma-4">
                      No existen series para el material seleccionado
                    </v-alert>
                  </template>
                </v-data-table-server>
              </v-window-item>
            </v-window>
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
import { listarStockGeneral, listarContratistas, listarZonales, listarStockSeries } from '@/services/stockService'

// Referencias
const tabActual = ref('detalle')
const loading = ref(false)
const stock = ref([])
const totalStock = ref(0)
const page = ref(1)
const itemsPerPage = ref(20)
const exportando = ref(false)
const contratistas = ref([])
const zonales = ref([])

const series = ref([])
const totalSeries = ref(0)
const loadingSeries = ref(false)
const pageSeries = ref(1)
const itemsPerPageSeries = ref(20)

// material seleccionado
const materialSeleccionado = ref(null)

const filtros = ref({
  contratista: '',
  condicion: '',
  zonal: '',
  sap: '',
  articulo: ''
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const headersSeries = [
  { title: 'Contratista', key: 'contratista', sortable: false },
  { title: 'Condición', key: 'condicion', width: '110px', sortable: false },
  { title: 'Zonal', key: 'zonal', width: '80px', sortable: false },
  { title: 'SAP', key: 'sap', width: '90px', sortable: false },
  { title: 'Artículo', key: 'articulo', sortable: false },
  { title: 'UM', key: 'unidadMedida', width: '70px', sortable: false },
  { title: 'Serie', key: 'serie', width: '160px', sortable: false },
  { title: 'Últim. Mov', key: 'ultimoMovimiento', width: '180px', sortable: false },
  { title: 'Días', key: 'dias', width: '80px', sortable: false }
]
// Datos estáticos
const condiciones = ['NUEVO', 'FALLO-FABRICA', 'ROBADO']

// Headers de la tabla
const headersDetalle = [
  { title: '#', key: 'materialId', width: '60px', sortable: false },
  { title: 'Contratista', key: 'contratista', sortable: false },
  { title: 'Condición', key: 'condicion', width: '110px', sortable: false },
  { title: 'Zonal', key: 'zonal', width: '90px', sortable: false },
  { title: 'SAP', key: 'sap', width: '120px', sortable: false },
  { title: 'Artículo', key: 'articulo', sortable: false },
  { title: 'UM', key: 'unidadMedida', width: '80px', sortable: false },
  { title: '(S)', key: 'marcaSeries', width: '60px', sortable: false },
  { title: 'Stock', key: 'stockTotal', width: '90px', sortable: false },
  { title: 'Trans.', key: 'enTransito', width: '80px', sortable: false }
]

// Cargar datos iniciales
onMounted(async () => {
  await Promise.all([
    cargarContratistas(),
    cargarZonales(),
    cargarStock()
  ])
})

// Funciones de carga
async function cargarContratistas() {
  try {
    contratistas.value = await listarContratistas()
  } catch (error) {
    console.error('Error al cargar contratistas:', error)
    mostrarSnackbar('Error al cargar contratistas', 'error')
  }
}

async function cargarZonales() {
  try {
    zonales.value = await listarZonales()
  } catch (error) {
    console.error('Error al cargar zonales:', error)
    mostrarSnackbar('Error al cargar zonales', 'error')
  }
}
function irASeries(item) {
  console.log('Ir a series del item:', item)
  materialSeleccionado.value = item
  // 1️⃣ Colocar SAP en el buscador
  filtros.value.sap = item.sap
  filtros.value.articulo = item.articulo
  // 2️⃣ Cambiar al tab Series
  tabActual.value = 'series'

  // 3️⃣ Cargar series filtradas
  cargarSeriesPorSap(item.sap)
}
function cambiarPaginaSeries(nuevaPagina) {
  pageSeries.value = nuevaPagina
  cargarSeriesPorSap()
}

function cambiarItemsPorPaginaSeries(nuevoSize) {
  itemsPerPageSeries.value = nuevoSize
  pageSeries.value = 1
  cargarSeriesPorSap()
}
async function cargarSeriesPorSap(sap) {
  console.log('Cargar series para SAP:', sap)
  console.log('materialSeleccionado.value:', materialSeleccionado.value)
  if (!materialSeleccionado.value) return

  loadingSeries.value = true

  try {
    console.log('Parámetros para listarStockSeries:', {
      contratista: materialSeleccionado.value.contratista || '',
      condicion: materialSeleccionado.value.condicion || '',
      zonal: materialSeleccionado.value.zonal || '',
      sap: materialSeleccionado.value.sap || '',
      articulo: materialSeleccionado.value.articulo || '',
      page: pageSeries.value - 1,
      size: itemsPerPageSeries.value
    })
    const { content, total } = await listarStockSeries({
      contratista: materialSeleccionado.value.contratista || '',
      
      sap: materialSeleccionado.value.sap || '',
      
      page: pageSeries.value - 1,
      size: itemsPerPageSeries.value
    })
    console.log('Series cargadas:', content)
    series.value = content
    totalSeries.value = total
  } catch (error) {
    console.error('Error al cargar series:', error)
    mostrarSnackbar('Error al cargar series del material', 'error')
  } finally {
    loadingSeries.value = false
  }
}
async function cargarStock() {
  loading.value = true
  try {
    const { content, total } = await listarStockGeneral({
      contratista: filtros.value.contratista || '',
      condicion: filtros.value.condicion || '',
      zonal: filtros.value.zonal || '',
      sap: filtros.value.sap || '',
      articulo: filtros.value.articulo || '',
      page: page.value - 1,
      size: itemsPerPage.value
    })

    stock.value = content
    totalStock.value = total
  } catch (error) {
    console.error('Error al cargar stock:', error)
    
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      mostrarSnackbar('Servicio no disponible. Por favor, intente más tarde.', 'error')
    } else {
      mostrarSnackbar('Error al cargar el stock', 'error')
    }
  } finally {
    loading.value = false
  }
}

// Funciones de búsqueda y filtros
function buscarStock() {
  page.value = 1
  cargarStock()
}

function limpiarFiltros() {
  filtros.value = {
    contratista: '',
    condicion: '',
    zonal: '',
    sap: '',
    articulo: ''
  }
  page.value = 1
  cargarStock()
}

// Paginación
function cambiarPagina(nuevaPagina) {
  page.value = nuevaPagina
  cargarStock()
}

function cambiarItemsPorPagina(nuevoSize) {
  itemsPerPage.value = nuevoSize
  page.value = 1
  cargarStock()
}

// Otras funciones
function actualizarStock() {
  cargarStock()
  mostrarSnackbar('Stock actualizado', 'success')
}

async function exportarExcel() {
  exportando.value = true
  try {
    mostrarSnackbar('Generando reporte Excel, por favor espere...', 'info')
    
    // Crear un nuevo workbook
    const workbook = XLSX.utils.book_new()
    
    // Obtener las tres condiciones
    const condiciones = ['NUEVO', 'FALLO-FABRICA', 'ROBADO']
    
    // Para cada condición, crear hojas de materiales y series
    for (const condicion of condiciones) {
        // Exportar materiales con los filtros actuales pero cambiando la condición
      await exportarMaterialesFiltrados(workbook, condicion)
      
      // Exportar series con los filtros actuales pero cambiando la condición
      await exportarSeriesFiltradas(workbook, condicion)
    }
    
    // Generar nombre del archivo con fecha y hora
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const hora = new Date().toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '')
    
    
    // Agregar información de filtros al nombre si están aplicados
    if (filtros.value.contratista) nombreBase += `_${filtros.value.contratista}`
    if (filtros.value.zonal) nombreBase += `_${filtros.value.zonal}`
    if (filtros.value.sap) nombreBase += `_${filtros.value.sap}`

    const nombreArchivo = `Reporte_Stock_General_${fecha}_${hora}.xlsx`
    // Descargar el archivo
    XLSX.writeFile(workbook, nombreArchivo)
    
    mostrarSnackbar('Reporte Excel generado exitosamente', 'success')
    
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    mostrarSnackbar('Error al generar el reporte Excel', 'error')
  } finally {
    exportando.value = false
  }
}

async function exportarMaterialesFiltrados(workbook, condicion) {
  try {
    // Usar los filtros actuales pero sobrescribir la condición
    const params = {
      contratista: filtros.value.contratista || '',
      condicion: condicion, // Sobrescribir con la condición específica
      zonal: filtros.value.zonal || '',
      sap: filtros.value.sap || '',
      articulo: filtros.value.articulo || '',
      page: 0,
      size: 10000
    }
    
    const { content: materiales } = await listarStockGeneral(params)
    
    if (materiales.length > 0) {
      // ... resto del código igual que antes ...
      const datosExcel = materiales.map((item, index) => ({
        '#': index + 1,
        'ID Material': item.materialId || '',
        'Contratista': item.contratista || '',
        'Condición': item.condicion || '',
        'Zonal': item.zonal || '',
        'SAP': item.sap || '',
        'Artículo': item.articulo || '',
        'Unidad Medida': item.unidadMedida || '',
        'Tiene Series': item.marcaSeries || 'N',
        'Stock Total': item.stockTotal || 0,
        'Stock Disponible': item.stockDisponible || 0,
        'En Tránsito': item.enTransito || 0
      }))
      
      const worksheet = XLSX.utils.json_to_sheet(datosExcel)
      
      // Agregar título a la hoja
      const range = XLSX.utils.decode_range(worksheet['!ref'])
      XLSX.utils.sheet_add_aoa(worksheet, [[`Materiales - ${condicion}`]], { origin: -1 })
      
      worksheet['!cols'] = [
        { wch: 5 },
        { wch: 10 },
        { wch: 20 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
        { wch: 40 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 15 },
        { wch: 10 }
      ]
      
      const nombreHoja = `Material ${condicion}`.substring(0, 31)
      XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja)
    }
  } catch (error) {
    console.error(`Error al exportar materiales ${condicion}:`, error)
  }
}

async function exportarSeriesFiltradas(workbook, condicion) {
  try {
    // Usar los filtros actuales pero sobrescribir la condición
    const params = {
      contratista: filtros.value.contratista || '',
      condicion: condicion, // Sobrescribir con la condición específica
      zonal: filtros.value.zonal || '',
      sap: filtros.value.sap || '',
      articulo: filtros.value.articulo || '',
      serie: '',
      page: 0,
      size: 10000
    }
    
    const { content: series } = await listarStockSeries(params)
    
    if (series.length > 0) {
      const datosExcel = series.map((item, index) => ({
        '#': index + 1,
        'Contratista': item.contratista || '',
        'Condición': item.condicion || '',
        'Zonal': item.zonal || '',
        'SAP': item.sap || '',
        'Artículo': item.articulo || '',
        'Unidad Medida': item.unidadMedida || '',
        'Serie': item.serie || '',
        'Último Movimiento': item.ultimoMovimiento || '',
        'Días en Stock': item.dias || 0
      }))
      
      const worksheet = XLSX.utils.json_to_sheet(datosExcel)
      
      // Agregar título a la hoja
      XLSX.utils.sheet_add_aoa(worksheet, [[`Series - ${condicion}`]], { origin: -1 })
      
      worksheet['!cols'] = [
        { wch: 5 },
        { wch: 20 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
        { wch: 40 },
        { wch: 12 },
        { wch: 20 },
        { wch: 18 },
        { wch: 12 }
      ]
      
      const nombreHoja = `Serie ${condicion}`.substring(0, 31)
      XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja)
    }
  } catch (error) {
    console.error(`Error al exportar series ${condicion}:`, error)
  }
}

async function exportarMaterialesPorCondicion(workbook, condicion) {
  try {
    // Obtener todos los materiales para esta condición (sin paginación)
    const { content: materiales } = await listarStockGeneral({
      condicion: condicion,
      page: 0,
      size: 10000 // Número grande para obtener todos los registros
    })
    
    if (materiales.length > 0) {
      // Preparar datos para Excel
      const datosExcel = materiales.map((item, index) => ({
        '#': index + 1,
        'ID Material': item.materialId || '',
        'Contratista': item.contratista || '',
        'Condición': item.condicion || '',
        'Zonal': item.zonal || '',
        'SAP': item.sap || '',
        'Artículo': item.articulo || '',
        'Unidad Medida': item.unidadMedida || '',
        'Tiene Series': item.marcaSeries || 'N',
        'Stock Total': item.stockTotal || 0,
        'Stock Disponible': item.stockDisponible || 0,
        'En Tránsito': item.enTransito || 0,
        'Stock No Disponible': (item.stockTotal || 0) - (item.stockDisponible || 0)
      }))
      
      // Crear hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(datosExcel)
      
      // Ajustar anchos de columna
      worksheet['!cols'] = [
        { wch: 5 },    // #
        { wch: 10 },   // ID Material
        { wch: 20 },   // Contratista
        { wch: 15 },   // Condición
        { wch: 10 },   // Zonal
        { wch: 15 },   // SAP
        { wch: 40 },   // Artículo
        { wch: 12 },   // Unidad Medida
        { wch: 12 },   // Tiene Series
        { wch: 10 },   // Stock Total
        { wch: 15 },   // Stock Disponible
        { wch: 10 },   // En Tránsito
        { wch: 18 }    // Stock No Disponible
      ]
      
      // Agregar hoja al workbook
      const nombreHoja = `Material ${condicion}`.substring(0, 31) // Excel limita a 31 caracteres
      XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja)
    }
  } catch (error) {
    console.error(`Error al exportar materiales ${condicion}:`, error)
    throw error
  }
}

// Función para exportar series por condición
async function exportarSeriesPorCondicion(workbook, condicion) {
  try {
    // Obtener todas las series para esta condición (sin paginación)
    const { content: series } = await listarStockSeries({
      condicion: condicion,
      page: 0,
      size: 10000 // Número grande para obtener todos los registros
    })
    
    if (series.length > 0) {
      // Preparar datos para Excel
      const datosExcel = series.map((item, index) => ({
        '#': index + 1,
        'Contratista': item.contratista || '',
        'Condición': item.condicion || '',
        'Zonal': item.zonal || '',
        'SAP': item.sap || '',
        'Artículo': item.articulo || '',
        'Unidad Medida': item.unidadMedida || '',
        'Serie': item.serie || '',
        'Último Movimiento': item.ultimoMovimiento || '',
        'Días en Stock': item.dias || 0,
        'Material ID': item.materialId || ''
      }))
      
      // Crear hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(datosExcel)
      
      // Ajustar anchos de columna
      worksheet['!cols'] = [
        { wch: 5 },    // #
        { wch: 20 },   // Contratista
        { wch: 15 },   // Condición
        { wch: 10 },   // Zonal
        { wch: 15 },   // SAP
        { wch: 40 },   // Artículo
        { wch: 12 },   // Unidad Medida
        { wch: 20 },   // Serie
        { wch: 18 },   // Último Movimiento
        { wch: 12 },   // Días en Stock
        { wch: 10 }    // Material ID
      ]
      
      // Agregar hoja al workbook
      const nombreHoja = `Serie ${condicion}`.substring(0, 31) // Excel limita a 31 caracteres
      XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja)
    }
  } catch (error) {
    console.error(`Error al exportar series ${condicion}:`, error)
    throw error
  }
}
function mostrarSnackbar(text, color = 'success') {
  snackbar.value.text = text
  snackbar.value.color = color
  snackbar.value.show = true
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 50%, #f3e5f5 100%);
  min-height: 100vh;
}

.rounded-xl {
  border-radius: 16px !important;
}

.bg-primary {
  background-color: #1976D2 !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>