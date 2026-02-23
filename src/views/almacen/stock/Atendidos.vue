<template>
  <v-container fluid class="p-0 bg-gradient" style="padding: 0!important;">
    <v-row justify="center" class="contenedor" style="padding: 0!important;margin: 0;">
      <v-col cols="12" style="padding: 0!important;">
        <v-card elevation="12" class="rounded-xl">
          <!-- Header -->
          <v-card-title class="bg-success text-white pa-3">
            <div class="d-flex align-center justify-space-between">
              <div>
                <h1 class="text-h5 font-weight-bold">
                  <v-icon class="mr-2">mdi-account-check</v-icon>
                  Stock Atendidos - Materiales Entregados
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
            <!-- Tabla de Stock Atendidos -->
            <v-data-table-server
              :headers="headers"
              :items="atendidos"
              :items-length="totalAtendidos"
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
                <div class="cell-center" style="width: 110px;">
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
              <template #item.fecMovimiento="{ item }">
                <span class="cell-simple" style="width: 80px;">{{ formatearFecha(item.fecMovimiento) }}</span>
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
                  {{ item.tipoMovimiento }}
                </v-chip>
              </template>
              <!-- Código Movimiento -->
              <template #item.codigoMovimiento="{ item }">
                <span class="font-weight-bold text-primary">{{ item.codigoMovimiento }}</span>
              </template>

              <!-- Nro. Documento -->
              <template #item.numDocumento="{ item }">
                <div class="cell-center" style="width: 120px;">
                  <span class="text-truncate" style="font-size: small; ">{{ item.numDocumento || '-' }}</span>
                  <v-tooltip activator="parent" location="top" v-if="item.numDocumento && item.numDocumento.length > 12">
                    {{ item.numDocumento }}
                  </v-tooltip>
                </div>
              </template>
              <!-- Doc. referencia -->
              <template #item.nroDocref="{ item }">
                <div class="cell-center" style="width: 100px;">
                  <span class="text-truncate" style="font-size: small; ">{{ item.nroDocref || '-' }}</span>
                  <v-tooltip activator="parent" location="top" v-if="item.nroDocref && item.nroDocref.length > 12">
                    {{ item.nroDocref }}
                  </v-tooltip>
                </div>
              </template>
              <!-- Condición -->
              <template #item.condicion="{ item }">
                <v-chip
                  :color="getCondicionColor(item.condicion)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.condicion }}
                </v-chip>
              </template>

             

              <!-- Artículo -->
              <template #item.articulo="{ item }">
                <div class="text-truncate" style="max-width: 300px;">
                  {{ item.articulo }}
                </div>
              </template>

              <!-- Serie -->
              <template #item.serie="{ item }">
                <span class="font-weight-bold">{{ item.serie || '-' }}</span>
              </template>

             <!-- Técnico -->
              <template #item.tecnico="{ item }">
                <div class="cell-center">
                  <div class="text-truncate"  style="width: 120px;">
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

              
              

              <!-- Días Atendido -->
              <template #item.diasAtendido="{ item }">
                <v-chip
                  :color="item.diasAtendido > 90 ? 'error' : item.diasAtendido > 30 ? 'warning' : 'success'"
                  size="small"
                  variant="tonal"
                >
                  {{ item.diasAtendido }} días
                </v-chip>
              </template>

              <!-- Glosa -->
              <template #item.observacion="{ item }">
                <div class="text-truncate" style="width: 200px;">
                  {{ item.observacion || '-' }}
                </div>
                <v-tooltip activator="parent" location="top" v-if="item.observacion && item.observacion.length > 12">
                  {{ item.observacion }}
                </v-tooltip>
              </template>
              <template #item.creadoEn="{ item }" style="width: 280px;">
                <span class="cell-simple" style="font-size: small;">{{ formatearFechaHora(item.creadoEn) }}</span>
              </template>

               <!-- Acciones -->
              <template #item.acciones="{ item }">
                <div class="d-flex gap-1">

                  <!-- Ver detalle - Siempre disponible -->
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
import { listarStockAtendidos, listarZonales, abrirPDFEnNuevaPestaña } from '@/services/stockService'

// Referencias
const loading = ref(false)
const atendidos = ref([])
const totalAtendidos = ref(0)
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

// Datos estáticos
const condiciones = ['NUEVO', 'FALLO-FABRICA', 'ROBADO', 'INOPERATIVO']
const tiposMovimiento = ['ENTREGA', 'SALIDA', 'ASIGNACION']

// Headers de la tabla
const headers = [
  { title: 'Contratista', key: 'contratista', width: '100px', sortable: false },
  { title: 'Fecha Mov.', key: 'fecMovimiento', width: '110px', sortable: false },
  { title: 'Tipo Mov.', key: 'tipoMovimiento', width: '120px', sortable: false },
  { title: 'Condición', key: 'condicion', width: '110px', sortable: false },
  { title: 'Tipo Documento', key: 'tipoDocumento', width: '110px', sortable: false },
  { title: 'Nro. Documento', key: 'numDocumento', width: '140px', sortable: false },
  { title: 'Doc. referencia', key: 'nroDocref', width: '110px', sortable: false },
  { title: 'Técnico', key: 'tecnico', width: '180px', sortable: false },
  { title: 'Observacion', key: 'observacion', width: '180px', sortable: false },
  { title: 'Usuario', key: 'usuarioRegistro', width: '110px', sortable: false },
  
  { title: 'Fecha Sistema', key: 'creadoEn', width: '250px', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false, align: 'center' }
]

// Cargar datos iniciales
onMounted(async () => {
  await Promise.all([
    cargarZonales(),
    cargarAtendidos()
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
/**
 * Formatea una fecha con hora en formato ISO a dd/mm/yyyy hh:mm
 * De: "2026-01-27T12:07:22.655477"
 * A:  "27/01/2026 12:07"
 */
function formatearFechaHora(fecha) {
  if (!fecha) return '-'
  
  try {
    const date = new Date(fecha)
    
    // Verificar si es una fecha válida
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
    //detalleCompra.value = await obtenerCompraPorId(compra.id)
    abrirPDFEnNuevaPestaña(movimiento.movimientoId)
    console.log('Cargando detalle para movimiento:', movimiento)
    console.log('Detalle del movimiento:', idMovimiento.value)
  } catch (e) {
    mostrarSnackbar('Error al cargar el detalle', 'error')
  }
}
async function cargarAtendidos() {
  loading.value = true
  try {
    const { content, total } = await listarStockAtendidos({
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
    console.log('Atendidos cargados:', content)
    atendidos.value = content
    totalAtendidos.value = total
  } catch (error) {
    console.error('Error al cargar atendidos:', error)
    
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      mostrarSnackbar('Servicio no disponible. Por favor, intente más tarde.', 'error')
    } else {
      mostrarSnackbar('Error al cargar el stock atendido', 'error')
    }
  } finally {
    loading.value = false
  }
}

// Funciones de búsqueda y filtros
function buscarStock() {
  page.value = 1
  cargarAtendidos()
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
  cargarAtendidos()
}

// Paginación
function cambiarPagina(nuevaPagina) {
  page.value = nuevaPagina
  cargarAtendidos()
}

function cambiarItemsPorPagina(nuevoSize) {
  itemsPerPage.value = nuevoSize
  page.value = 1
  cargarAtendidos()
}

// Otras funciones
function actualizarStock() {
  cargarAtendidos()
  mostrarSnackbar('Stock actualizado', 'success')
}
async function exportarExcel() {
  exportando.value = true
  try {
    mostrarSnackbar('Generando reporte Excel, por favor espere...', 'info')
    
    // Obtener todos los registros
    const { content: todosAtendidos } = await listarStockAtendidos({
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
    console.log('Registros para exportar:', todosAtendidos)
    // --- PESTAÑA 1: STOCK ATENDIDOS (Vista Principal) ---
    const datosExcel = todosAtendidos.map((item, index) => ({
      '#': index + 1,
      'Código Movimiento': item.movimientoId || '',
      'No Contratista': item.contratista || '',
      'Cód Zonal': item.codZonal || '',
      'Cod. Tipo Movimiento': item.tipoMovimientoId || '',
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
      'Cód estado Cab.': item.codEstadoCabecera || '',
      'SAP': item.sap || '',
      'Artículo': item.articulo || '',
      'Descripción': item.descripcion || '',
      'Unidad Medida': item.unidadMedida || '',
      'Cantidad': item.cantidad || 0,
      'Serie': item.serie || ''
    }))
    
    // --- PESTAÑA 2: DETALLE DE MATERIALES (Agrupado por Artículo) ---
    const materialesMap = new Map()
    
    todosAtendidos.forEach(item => {
      const tecnicoNombre = item.tecnicoNombreCompleto || '-';
      const tecnicoNumeroDocumento = item.tecnicoNumeroDocumento || '';
      const key = `${item.sap || ''}|${item.articulo || ''}|${item.descripcion || ''}|${item.unidadMedida || ''}`
      if (!materialesMap.has(key)) {
        materialesMap.set(key, {
          sap: item.sap || '',
          articulo: item.articulo || '',
          descripcion: item.descripcion || '',
          unidadMedida: item.unidadMedida || '',
          cantidadTotal: 0,
          movimientos: new Set(),
          contratistas: new Set(),
          tecnicos: new Set(),
          fecMovimiento: item.fecMovimiento || '',
          tecnicoNombres: tecnicoNombre,
          tecnicoNumeroDocumento: tecnicoNumeroDocumento,
          tiposMovimiento: new Set()
        })
      }
      const material = materialesMap.get(key)
      material.cantidadTotal += (item.cantidad || 0)
      if (item.movimientoId) material.movimientos.add(item.movimientoId)
      if (item.contratista) material.contratistas.add(item.contratista)
      if (item.tecnico) material.tecnicos.add(item.tecnico)
      if (item.tipoMovimiento) material.tiposMovimiento.add(item.tipoMovimiento)
    })
    
    const datosMateriales = Array.from(materialesMap.entries()).map(([key, material], index) => ({
      '#': index + 1,
      'Código SAP': material.sap,
      'Código Artículo': material.articulo,
      'Fecha Movimiento': formatearFecha(material.fecMovimiento),
      'Descripción': material.descripcion,
      'Unidad Medida': material.unidadMedida,
      'Cantidad Total Atendida': material.cantidadTotal,
      'N° Movimientos': material.movimientos.size,
      'N° Contratistas': material.contratistas.size,
      'Técnico': material.tecnicoNombres,
      'Documento': material.tecnicoNumeroDocumento,
      'N° Técnicos': material.tecnicos.size,
      'Tipos Movimiento': Array.from(material.tiposMovimiento).join(', '),
      'Contratistas': Array.from(material.contratistas).join(', '),
      'N° de Series': todosAtendidos.filter(item => 
        item.sap === material.sap && 
        item.articulo === material.articulo && 
        item.serie && item.serie.trim() !== ''
      ).length
    }))
    
    // --- PESTAÑA 3: DETALLE DE SERIES ---
    const seriesData = []
    
    todosAtendidos.forEach((item, index) => {
      if (item.serie && item.serie.trim() !== '') {
        // Dividir series múltiples (separadas por coma, espacio, etc)
        const series = item.serie.split(',').map(s => s.trim()).filter(s => s !== '')
        const tecnicoNombre = item.tecnicoNombreCompleto || '-';
        const tecnicoNumeroDocumento = item.tecnicoNumeroDocumento || '';
        series.forEach((serie, serieIndex) => {
          seriesData.push({
            '#': seriesData.length + 1,
            'Movimiento ID': item.movimientoId || '',
            'Fecha Movimiento': formatearFecha(item.fecMovimiento),
            'Tipo Movimiento': item.tipoMovimiento || '',
            'Contratista': item.contratista || '',
            'Técnico': tecnicoNombre,
            'Documento': tecnicoNumeroDocumento,
            'Código SAP': item.sap || '',
            'Artículo': item.articulo || '',
            'Descripción': item.descripcion || '',
            'Serie': serie,
            'Condición': item.condicion || '',
            'N° Documento': item.numDocumento || '',
            'Cód Zonal': item.codZonal || ''
          })
        })
      }
    })
    
    // Si no hay series, agregar un registro indicativo
    if (seriesData.length === 0) {
      seriesData.push({
        '#': 1,
        'Movimiento ID': '',
        'Fecha Movimiento': '',
        'Tipo Movimiento': '',
        'Contratista': '',
        'Técnico': '',
        'Código SAP': '',
        'Artículo': '',
        'Descripción': 'NO HAY REGISTROS CON SERIES',
        'Serie': '',
        'Condición': '',
        'N° Documento': '',
        'Cód Zonal': ''
      })
    }
    
    // Crear workbook
    const workbook = XLSX.utils.book_new()
    
    // --- PESTAÑA 1: Stock Atendidos ---
    const worksheet1 = XLSX.utils.json_to_sheet(datosExcel)
    worksheet1['!cols'] = [
      { wch: 5 },   // #
      { wch: 18 },  // Código Movimiento
      { wch: 20 },  // No Contratista
      { wch: 12 },  // Cód Zonal
      { wch: 15 },  // Cod. Tipo Movimiento
      { wch: 20 },  // Tipo Movimiento
      { wch: 15 },  // Condición
      { wch: 15 },  // Tipo Documento
      { wch: 15 },  // Num Documento
      { wch: 12 },  // Fec Movimiento
      { wch: 15 },  // Nro Doc Ref
      { wch: 15 },  // Nro Destino Ref
      { wch: 40 },  // Glosa
      { wch: 15 },  // Código Usuario
      { wch: 20 },  // Usuario Registro
      { wch: 18 },  // Fecha Sistema
      { wch: 15 },  // Cód estado Cab.
      { wch: 15 },  // SAP
      { wch: 20 },  // Artículo
      { wch: 40 },  // Descripción
      { wch: 10 },  // Unidad Medida
      { wch: 12 },  // Cantidad
      { wch: 25 }   // Serie
    ]
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'Stock Atendidos')
    
    // --- PESTAÑA 2: Detalle de Materiales ---
    const worksheet2 = XLSX.utils.json_to_sheet(datosMateriales)
    worksheet2['!cols'] = [
      { wch: 5 },   // #
      { wch: 15 },  // Código SAP
      { wch: 20 },  // Código Artículo
      { wch: 50 },  // Descripción
      { wch: 10 },  // Unidad Medida
      { wch: 18 },  // Cantidad Total Atendida
      { wch: 15 },  // N° Movimientos
      { wch: 15 },  // N° Contratistas
      { wch: 15 },  // N° Técnicos
      { wch: 30 },  // Tipos Movimiento
      { wch: 40 },  // Contratistas
      { wch: 15 }   // N° de Series
    ]
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'Detalle Materiales')
    
    // --- PESTAÑA 3: Detalle de Series ---
    const worksheet3 = XLSX.utils.json_to_sheet(seriesData)
    worksheet3['!cols'] = [
      { wch: 5 },   // #
      { wch: 18 },  // Movimiento ID
      { wch: 15 },  // Fecha Movimiento
      { wch: 20 },  // Tipo Movimiento
      { wch: 20 },  // Contratista
      { wch: 20 },  // Técnico
      { wch: 15 },  // Código SAP
      { wch: 20 },  // Artículo
      { wch: 50 },  // Descripción
      { wch: 25 },  // Serie
      { wch: 15 },  // Condición
      { wch: 15 },  // N° Documento
      { wch: 12 }   // Cód Zonal
    ]
    XLSX.utils.book_append_sheet(workbook, worksheet3, 'Detalle Series')
    
    // Generar nombre del archivo
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const hora = new Date().toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '')
    const nombreArchivo = `Reporte_Stock_Atendidos_${fecha}_${hora}.xlsx`
    
    // Descargar
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
    'Nuevo': 'success',
    'Fallo de Fábrica': 'warning',
    'Dañado': 'error',
    'Reacondicionado': 'info',
    'Robado': 'primary',
    'Usado en Buen Estado': 'secundary'
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

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 100%;
}
.btn-filtros {
  height: 3rem;
}
.cell-simple {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>