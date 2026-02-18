<template>
  <v-container fluid class="fill-height bg-gradient">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="10">
        <v-card elevation="12" class="rounded-xl">

          <!-- Header -->
          <v-card-title class="bg-primary text-white pa-6">
            <h1 class="text-h5 font-weight-bold">
              Compras registradas
            </h1>
          </v-card-title>

          <v-card-text class="pa-6">

            <!-- Filtros -->
            <v-row class="mb-4">
              <v-col cols="12" md="3">
                <v-select
                  v-model="filtros.tipoComprobante"
                  label="Tipo Comprobante"
                  :items="tiposComprobante"
                  prepend-inner-icon="mdi-file-document"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @update:model-value="buscarCompras"
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filtros.numeroComprobante"
                  label="Número Comprobante"
                  prepend-inner-icon="mdi-numeric"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @keyup.enter="buscarCompras"
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-select
                  v-model="filtros.estado"
                  label="Estado"
                  :items="estados"
                  prepend-inner-icon="mdi-filter"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @update:model-value="buscarCompras"
                />
              </v-col>

              <v-col cols="12" md="3" class="d-flex align-center">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-magnify"
                  block
                  @click="buscarCompras"
                >
                  Buscar
                </v-btn>
              </v-col>
            </v-row>

            <!-- Tabla -->
            <v-data-table-server
              :headers="headers"
              :items="compras"
              :items-length="totalCompras"
              :loading="loading"
              :items-per-page="itemsPerPage"
              :page="page"
              @update:page="cambiarPagina"
              @update:items-per-page="cambiarItemsPorPagina"
              item-key="id"
              density="comfortable"
              class="elevation-1"
            >

              <!-- Tipo Compra -->
              <template #item.tipoCompra="{ item }">
                <v-chip
                  :color="item.tipoCompra === 'Compra Material' ? 'blue' : 'purple'"
                  variant="tonal"
                  size="small"
                >
                  {{ item.tipoCompra }}
                </v-chip>
              </template>

              <!-- Estado -->
              <template #item.estado="{ item }">
                <v-chip
                  :color="estadoColor(item.estado)"
                  variant="tonal"
                  size="small"
                >
                  {{ estadoTexto(item.estado) }}
                </v-chip>
              </template>

               <!-- Acciones -->
              <template #item.acciones="{ item }">
                <div class="d-flex gap-1">
                  <!-- Editar - Solo si está pendiente -->
                  <v-tooltip text="Editar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        color="blue"
                        variant="text"
                        :disabled="item.estado !== 'P'"
                        @click="editarCompra(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>

                  <!-- Finalizar - Solo si está pendiente -->
                  <v-tooltip text="Finalizar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        color="success"
                        variant="text"
                        :disabled="item.estado !== 'P'"
                        @click="abrirConfirmacionFinalizar(item)"
                      >
                        <v-icon>mdi-check-circle</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>

                  <!-- Anular - Solo si está pendiente o finalizado -->
                  <v-tooltip text="Anular" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        :disabled="item.estado === 'A'"
                        @click="abrirConfirmacionAnular(item)"
                      >
                        <v-icon>mdi-close-circle</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>

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
                <v-skeleton-loader type="table-row@5" />
              </template>

              <!-- Sin datos -->
              <template #no-data>
                <v-alert
                  type="info"
                  variant="tonal"
                  class="ma-4"
                >
                  No se encontraron compras con los filtros seleccionados
                </v-alert>
              </template>

            </v-data-table-server>

          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  <v-dialog
    v-model="dialogDetalle"
    max-width="1100"
    scrollable
  >
    <v-card class="rounded-xl">

      <!-- HEADER -->
      <v-card-title class="bg-primary text-white d-flex justify-space-between">
        <span>
          <v-icon class="me-2">mdi-eye</v-icon>
          Detalle de ingreso
        </span>
        <v-btn icon variant="text" @click="dialogDetalle = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- CONTENIDO -->
      <v-card-text class="pa-6">
        <DetalleCompra
          v-if="detalleCompra"
          :idCompra="idCompraDetalle"
        />
      </v-card-text>

      <!-- FOOTER -->
      <div class="d-flex align-center gap-2 pl-6 pb-6">
         <v-btn
          color="success"
          class="pl-4 pr-4 pt-2 pb-2"
          style="height: 2rem;"
          variant="flat"
          size="medium"
          prepend-icon="mdi-file-excel"
          @click="descargarExcel"
          :disabled="!detalleCompra"
        >
          Descargar
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          @click="dialogDetalle = false"
        >
          Cerrar
        </v-btn>
      </div>

    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogFinalizar"
    max-width="460"
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl elevation-10">

      <!-- Header -->
      <v-card-title class="bg-primary text-white d-flex align-center">
        <v-icon class="me-2">mdi-alert-circle-outline</v-icon>
        Confirmar finalización
      </v-card-title>

      <!-- Contenido -->
      <v-card-text class="py-6 text-body-1">
        <p class="mb-2">
          Está a punto de <strong>finalizar el ingreso de material</strong>.
        </p>
        <p class="mb-3">
          <strong>Documento:</strong> {{ compraSeleccionada?.tipoDocumento }} - {{ compraSeleccionada?.numeroDocumento }}
        </p>
        <p class="text-medium-emphasis">
          Una vez finalizado, no podrá modificar los materiales ni las series
          asociadas a esta compra.
        </p>
      </v-card-text>

      <v-divider />

      <!-- Acciones -->
      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn
          variant="outlined"
          color="grey-darken-1"
          prepend-icon="mdi-close"
          @click="dialogFinalizar = false"
          :disabled="loadingFinalizar"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="success"
          variant="flat"
          prepend-icon="mdi-check-circle"
          @click="confirmarFinalizacion"
          :loading="loadingFinalizar"
        >
          Finalizar compra
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
  <!-- Modal de Confirmación Anular -->
  <v-dialog
    v-model="dialogAnular"
    max-width="460"
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl elevation-10">

      <!-- Header -->
      <v-card-title class="bg-error text-white d-flex align-center">
        <v-icon class="me-2">mdi-alert-circle-outline</v-icon>
        Confirmar anulación
      </v-card-title>

      <!-- Contenido -->
      <v-card-text class="py-6 text-body-1">
        <p class="mb-2">
          Está a punto de <strong class="text-error">anular esta compra</strong>.
        </p>
        <p class="mb-3">
          <strong>Documento:</strong> {{ compraSeleccionada?.tipoDocumento }} - {{ compraSeleccionada?.numeroDocumento }}
        </p>
        <p class="text-medium-emphasis">
          Esta acción no se puede deshacer. La compra quedará marcada como anulada
          y no podrá ser modificada.
        </p>
      </v-card-text>

      <v-divider />

      <!-- Acciones -->
      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn
          variant="outlined"
          color="grey-darken-1"
          prepend-icon="mdi-close"
          @click="dialogAnular = false"
          :disabled="loadingAccion"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="error"
          variant="flat"
          prepend-icon="mdi-close-circle"
          @click="confirmarAnulacion"
          :loading="loadingAccion"
        >
          Anular compra
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
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
import { useRouter } from 'vue-router'
import { listarComprasService, finalizarCompraService, anularCompraService } from '@/services/comprasService'
import DetalleCompra from '@/views/almacen/DetalleCompra.vue'
import { obtenerCompraPorId } from '@/services/comprasService'
import * as XLSX from 'xlsx'
// Router
const router = useRouter()
const dialogFinalizar = ref(false)
const dialogAnular = ref(false)
const compraSeleccionada = ref(null)
const loading = ref(false)
const loadingAccion = ref(false)
const loadingFinalizar = ref(false)
const compras = ref([])
const totalCompras = ref(0)
const page = ref(1)
const itemsPerPage = ref(10)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})
const dialogDetalle = ref(false)
const detalleCompra = ref(null)
const idCompraDetalle = ref(null)
// Filtros
const filtros = ref({
  tipoComprobante: null,
  numeroComprobante: '',
  estado: null
})
const headers = [
  { title: 'Tipo compra', key: 'tipoCompra', sortable: false },
  { title: 'Tipo documento', key: 'tipoDocumento', sortable: false },
  { title: 'Número', key: 'numeroDocumento', sortable: false },
  { title: 'Fecha ingreso', key: 'fechaIngreso', sortable: false },
  { title: 'Estado', key: 'estado', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false, align: 'center' }
]
// Opciones para filtros
const tiposComprobante = [
  'Factura',
  'Boleta',
  'Guía de Remisión',
  'Nota de Crédito',
  'Nota de Débito'
]
const estados = [
  { title: 'Pendiente', value: 'P' },
  { title: 'Finalizado', value: 'F' }
]
// Cargar compras al montar
onMounted(() => {
  cargarCompras()
})
// Función para cargar compras
async function cargarCompras() {
  loading.value = true
  try {
    const { content, total } = await listarComprasService({
      page: page.value - 1, // El backend espera page desde 0
      size: itemsPerPage.value,
      tipoDocumento: filtros.value.tipoComprobante || '',
      numeroDocumento: filtros.value.numeroComprobante || '',
      estado: filtros.value.estado || ''
    })
    console.log('Compras cargadas:', content)
    compras.value = content
    totalCompras.value = total
  } catch (error) {
    console.error('Error al cargar compras:', error)
    mostrarSnackbar('Error al cargar las compras', 'error')
  } finally {
    loading.value = false
  }
}
// Buscar con filtros
function buscarCompras() {
  page.value = 1 // Reset a la primera página
  cargarCompras()
}

// Cambiar página
function cambiarPagina(nuevaPagina) {
  page.value = nuevaPagina
  cargarCompras()
}

// Cambiar items por página
function cambiarItemsPorPagina(nuevoSize) {
  itemsPerPage.value = nuevoSize
  page.value = 1
  cargarCompras()
}

// Abrir confirmación
function abrirConfirmacion(compra) {
  compraSeleccionada.value = compra
  dialogFinalizar.value = true
}
// Editar compra
function editarCompra(compra) {
  console.log('Editando compra:', compra)
  // Redirigir a la vista de edición con el ID de la compra
  router.push({
    name: 'Compramateriales', // Nombre de tu ruta de formulario
    query: { id: compra.id }
  })
}
// Abrir confirmación finalizar
function abrirConfirmacionFinalizar(compra) {
  compraSeleccionada.value = compra
  dialogFinalizar.value = true
}
// Confirmar finalización
async function confirmarFinalizacion() {
  loadingFinalizar.value = true
  try {
    // Llamar al servicio para finalizar
    await finalizarCompraService(compraSeleccionada.value.id)

    // Actualizar estado local
    const index = compras.value.findIndex(c => c.id === compraSeleccionada.value.id)
    if (index !== -1) {
      compras.value[index].estado = 'F'
    }

    mostrarSnackbar('Compra finalizada correctamente', 'success')
    dialogFinalizar.value = false
    
  } catch (error) {
    console.error('Error al finalizar compra:', error)
    
    // Manejo de errores específicos
    if (error.response?.status === 500) {
      const mensaje = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Error al finalizar la compra'
      mostrarSnackbar(`Error del servidor: ${mensaje}`, 'error')
    } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      mostrarSnackbar('Servicio no disponible. Por favor, intente más tarde.', 'error')
    } else {
      mostrarSnackbar('Error al finalizar la compra', 'error')
    }
  } finally {
    loadingFinalizar.value = false
  }
}
// Abrir confirmación anular
function abrirConfirmacionAnular(compra) {
  compraSeleccionada.value = compra
  dialogAnular.value = true
}
// Confirmar anulación
async function confirmarAnulacion() {
  loadingAccion.value = true
  try {
    await anularCompraService(compraSeleccionada.value.id)

    // Actualizar estado local
    const index = compras.value.findIndex(c => c.id === compraSeleccionada.value.id)
    if (index !== -1) {
      compras.value[index].estado = 'A'
    }

    mostrarSnackbar('Compra anulada correctamente', 'success')
    dialogAnular.value = false
    
  } catch (error) {
    console.error('Error al anular compra:', error)
    
    if (error.response?.status === 500) {
      const mensaje = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Error al anular la compra'
      mostrarSnackbar(`Error del servidor: ${mensaje}`, 'error')
    } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      mostrarSnackbar('Servicio no disponible. Por favor, intente más tarde.', 'error')
    } else {
      mostrarSnackbar('Error al anular la compra', 'error')
    }
  } finally {
    loadingAccion.value = false
  }
}

function descargarExcel() {
  if (!detalleCompra.value) return

  let contador = 1
  const rows = []

  detalleCompra.value.materiales.forEach(material => {
    console.log('Procesando material:', material)
    // Caso: material con series
    if (material.series && material.series.length > 0) {
      material.series.forEach(serie => {
        rows.push({
          'N°': contador++,
          'Código material': material.codigoMaterial,
          'Material': material.descripcion,
          'Serie': serie
        })
      })
    } 
    // Caso: material sin series
    else {
      rows.push({
        'N°': contador++,
        'Código material': material.codigo,
        'Material': material.nombre,
        'Serie': ''
      })
    }

  })

  // Crear hoja
  const worksheet = XLSX.utils.json_to_sheet(rows)

  // Ajuste visual de columnas (UX)
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 18 },
    { wch: 30 },
    { wch: 20 }
  ]

  // Crear libro
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalle')

  // Nombre de archivo
  const nombreArchivo =
    `Ingreso_${detalleCompra.value.tipoDocumento}_${detalleCompra.value.numeroDocumento}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
}
// Utilidades
function estadoColor(estado) {
  switch (estado) {
    case 'P': return 'warning'
    case 'F': return 'success'
    case 'A': return 'error'
    default: return 'grey'
  }
}

function estadoTexto(estado) {
  switch (estado) {
    case 'P': return 'Pendiente'
    case 'F': return 'Finalizado'
    case 'A': return 'Anulado'
    default: return estado
  }
}

function mostrarSnackbar(text, color = 'success') {
  snackbar.value.text = text
  snackbar.value.color = color
  snackbar.value.show = true
}

async function verDetalle(compra) {
  idCompraDetalle.value = compra.id
  dialogDetalle.value = true
  detalleCompra.value = null
  try {
    detalleCompra.value = await obtenerCompraPorId(compra.id)
  } catch (e) {
    mostrarSnackbar('Error al cargar el detalle', 'error')
    dialogDetalle.value = false
  }
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
.bg-success {
  background-color: #4CAF50 !important;
}

.bg-error {
  background-color: #F44336 !important;
}

.d-flex.gap-1 {
  gap: 4px;
}
</style>