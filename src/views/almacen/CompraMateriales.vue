<template>
  <v-container fluid class="fill-height bg-gradient">
    <v-row justify="center"   >
      <v-col cols="12" md="10" lg="8" class="custom-width">
        <v-card elevation="12" class="rounded-xl">
          <!-- Header -->
          <v-card-title class="bg-primary text-white pa-6">
            <div>
              <h1 class="text-h5 font-weight-bold">Compra Materiales / SAP</h1>
            </div>
          </v-card-title>

          <v-card-text class="pa-8">
            <v-form ref="formRef">
              <v-row>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="form.tipoCompra"
                    label="Tipo Compra"
                    :items="tiposCompra"
                    prepend-inner-icon="mdi-file-document"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="form.fechaIngreso"
                    label="Fecha Ingreso"
                    type="date"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Primera fila: 3 campos -->
              <v-row>
                

                <v-col cols="12" md="3">
                  <v-select
                    v-model="form.tipoDocumento"
                    label="Tipo Documento"
                    :items="tiposDocumento"
                    prepend-inner-icon="mdi-file-document"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="form.numeroDocumento"
                    label="Número de Documento"
                    prepend-inner-icon="mdi-numeric"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="table-header">
                <v-col cols="2">Código material</v-col>
                <v-col cols="5">Descripción</v-col>
                <v-col cols="1">Cant.</v-col>
                <v-col cols="1">Precio</v-col>
                <v-col cols="1.5">Pre. total</v-col>
                <v-col cols="1.5" class="text-center">Series</v-col>
              </v-row>

              <!-- Segunda fila: 2 campos -->
              <v-row
                v-for="(material, index) in form.materiales"
                :key="index"
                class="table-row"
                align="center"
              >
                <!-- Código -->
                <v-col cols="2">
                  <v-autocomplete
                    v-model="material.codigoMaterial"
                    v-model:search="material.search"
                    :items="codigoMateriales"
                    item-title="codigo"
                    item-value="codigo"
                    density="compact"
                    variant="outlined"
                    hide-details
                    clearable
                    @update:search="buscarCodigoMateriales"
                    @update:modelValue="onMaterialSeleccionado(material)"
                  />
                </v-col>

                <!-- Descripción -->
                <v-col cols="5">
                  <v-text-field
                    v-model="material.descripcion"
                    density="compact"
                    variant="plain"
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="1" class="text-center">
                  <v-text-field
                    v-model="material.cantidad"
                    variant="outlined"
                    density="compact"
                    style="padding: 0;height: 2.5rem;"
                    @input="calcularPrecioTotal(material)"
                  ></v-text-field>
                </v-col>
                 <v-col cols="1" class="text-center">
                  <v-text-field
                    v-model="material.precio"
                    variant="outlined"
                    density="compact"
                    style="padding: 0;height: 2.5rem;"
                    @input="calcularPrecioTotal(material)"
                  ></v-text-field>
                </v-col>
                 <v-col cols="1.5" class="text-center">
                  <v-text-field
                    v-model="material.precioTotal"
                    variant="outlined"
                    density="compact"
                    style="padding: 0;height: 2.5rem;"
                    readonly
                  ></v-text-field>
                </v-col>
                <!-- Series -->
                <v-col cols="1.5" class="text-center">
                  <div
                    :class="{
                      'bg-palo-rosa pa-1': cantidadSeriesInconsistente(material),
                      'bg-palo-blue pa-1': !cantidadSeriesInconsistente(material)
                    }"
                    style="display: flex; gap: 4px; align-items: center;"
                  >
                    <v-btn
                      size="medium"
                      variant="tonal"
                      color="primary"
                      class="pa-1"
                      style="flex: 1;"
                      :disabled="!material.cantidad || Number(material.cantidad) <= 0"
                      @click="abrirModalSeries(material)"
                    >
                      {{ contarSeries(material.series) }}
                    </v-btn>
                    <v-btn
                      size="small"
                      color="error"
                      icon="mdi-delete"
                      variant="text"
                      @click="eliminarMaterial(index)"
                    />
                  </div>
                </v-col>

               
              </v-row>
              <br />
              <v-row class="mb-5" align="center">
                <v-col cols="auto">
                  <v-btn
                    color="secondary"
                    variant="tonal"
                    @click="agregarMaterial"
                  >
                    + Agregar material
                  </v-btn>
                </v-col>

                <v-spacer />

                <v-col cols="auto">
                  <v-btn
                    color="secondary"
                    variant="tonal"
                    prepend-icon="mdi-file-excel"
                    @click="$refs.fileInput.click()"
                  >
                    + Cargar Excel material
                  </v-btn>
                </v-col>
              </v-row>
              <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls"
                style="display:none"
                @change="procesarExcel"
              />
              <!-- Observación -->
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.observacion"
                    label="Observación"
                    prepend-inner-icon="mdi-message-text"
                    variant="outlined"
                    rows="4"
                    density="comfortable"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!-- Botón Guardar -->
              <v-row justify="center" class="mt-4">
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    size="x-large"
                    prepend-icon="mdi-content-save"
                    append-icon="mdi-chevron-right"
                    elevation="4"
                    class="px-10"
                    :loading="loadingGuardar"
                    :disabled="loadingGuardar"
                    @click="semiGuardar"
                  >
                    Guardar
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    size="x-large"
                    prepend-icon="mdi-content-save"
                    append-icon="mdi-chevron-right"
                    elevation="4"
                    class="px-10"
                    :loading="loadingGuardar"
                    :disabled="loadingGuardar"
                    @click="guardar"
                  >
                    Finalizar
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    size="x-large"
                    prepend-icon="mdi-content-save"
                    append-icon="mdi-chevron-right"
                    elevation="4"
                    class="px-10"
                    @click="cancelar"
                  >
                    Cancelar
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="modalSeries" max-width="600px">
    <v-card>
      <v-card-title>
        Series - {{ materialActivo?.codigo }}
      </v-card-title>

      <v-card-text>
        <!-- Input tipo pistola -->
        <v-text-field
          class="mb-0"
          ref="serieInputRef"
          v-model="serieInput"
          label="Escanear número de serie"
          variant="outlined"
          @keydown.enter.prevent="agregarSerie"
          persistent-hint
          :disabled="deshabilitarSerieInput"
        />
       
        <!-- Visualización -->
        <v-row class="mt-0">
          <v-col cols="12">
            <v-textarea
              v-model="materialActivo.series"
              label="Series ingresadas"
              variant="outlined"
              rows="4"
              readonly
            />
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-textarea
                v-model="seriesAEliminar"
                label="Series a eliminar (separadas por coma)"
                placeholder="Ej: 234234252345, 312444435656"
                variant="outlined"
                rows="3"
                density="comfortable"
                hide-details
                class="flex-grow-1"
              ></v-textarea>
              
              <v-btn
                icon
                size="large"
                color="primary"
                class="ml-2"
                @click="eliminarUltimoOPorLista"
              >
                <v-icon>mdi-backspace-outline</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        
        
        <!-- Acción eliminar última serie -->
        <v-row>
          <v-col>
            <v-btn
              class="mt-3"
              color="error"
              variant="tonal"
              prepend-icon="mdi-delete"
              @click="limpiarSeries"
            >
              Limpiar series
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <strong> Total de series: </strong>{{ totalSeries }} <strong>de</strong> {{ cantidadRequerida }}
          </v-col>
          
        </v-row>
        
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="modalSeries = false">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


   <!-- Diálogo de confirmación para guardar -->
    <v-dialog
      v-model="dialogConfirmarGuardar"
      max-width="500px"
      persistent
    >
      <v-card class="rounded-xl">
        <v-card-title class="bg-primary text-white pa-4">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-help-circle</v-icon>
            Confirmar registro de compra
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
          <div class="mb-3">
            <p class="text-body-1 mb-2">
              ¿Está seguro de registrar esta compra?
            </p>
            
            <v-divider class="my-3"></v-divider>
            
            <div class="text-body-2">
              <div class="d-flex mb-2">
                <span class="font-weight-bold mr-2">Tipo:</span>
                <span>{{ form.tipoCompra }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="font-weight-bold mr-2">Documento:</span>
                <span>{{ form.tipoDocumento }} - {{ form.numeroDocumento }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="font-weight-bold mr-2">Fecha:</span>
                <span>{{ formatearFecha(form.fechaIngreso) }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="font-weight-bold mr-2">Materiales:</span>
                <span>{{ form.materiales.length }}</span>
              </div>
              <div class="d-flex">
                <span class="font-weight-bold mr-2">Series totales:</span>
                <span>{{ contarTotalSeries() }}</span>
              </div>
            </div>
          </div>

          <v-alert
            type="warning"
            variant="tonal"
            class="mt-4"
            density="compact"
          >
            Una vez guardado, los datos quedarán registrados en el sistema.
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            @click="dialogConfirmarGuardar = false"
            :disabled="loadingGuardar"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-content-save"
            @click="confirmarGuardar"
            :loading="loadingGuardar"
          >
            Sí, guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="3000"
    class="snackbar-large-text"
    elevation="10"
    rounded="lg"
  >
    {{ snackbar.text }}
  </v-snackbar>
  <v-overlay
  :model-value="loadingGuardar"
  class="d-flex align-center justify-center"
  scrim="rgba(0,0,0,0.45)"
  persistent
  >
    <v-card
      elevation="8"
      class="pa-6 text-center"
      rounded="lg"
    >
      <v-progress-circular
        indeterminate
        size="48"
        width="4"
        color="primary"
        class="mb-4"
      />
      <div class="text-subtitle-1 font-weight-medium">
        Guardando información…
      </div>
    </v-card>
  </v-overlay>
  </v-container>
  
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { listarMaterialesService } from '@/services/materialesService'
import { obtenerCompraPorId } from '@/services/comprasService'
import { useRoute } from 'vue-router'

// import { getDocumentos, crearDocumento, modificarDocumento } from '@/services/documentoService';
import { crearCompra } from '@/services/comprasService';
import * as XLSX from 'xlsx'
import { es } from 'vuetify/locale';
const route = useRoute()
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
// Referencias
//const searchCodigoMaterial = ref('')
const codigoMateriales = ref([])
const loadingCodigoMateriales = ref(false)
const serieInput = ref('')
const isProcesandoSerie = ref(false)
const materialActivo = ref(null)
materialActivo.series = materialActivo.series || ''
const loadingGuardar = ref(false)
const modalSeries = ref(false)
const fileInput = ref(null)
const seriesAEliminar = ref('')
const formRef = ref(null)
const dialogConfirmarGuardar = ref(false)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Datos del formulario
const form = ref({
  fechaIngreso: hoyISO(),
  tipoCompra: '',
  tipoDocumento: '',
  numeroDocumento: '',
  observacion: '',
  materiales: [
    {
      materialId: null,
      codigoMaterial: '',
      cantidad: '',
      precio: '',
      precioTotal: '',
      descripcion: '',
      series: []
    }
  ]

})
onMounted(async () => {
  // Verificar si viene un ID para edición
  const compraId = route.query.id
  
  if (compraId) {
    console.log('Modo edición - Cargando compra ID:', compraId)
    await cargarCompraParaEdicion(compraId)
  }
})
function calcularPrecioTotal(material) {
  const cantidad = Number(material.cantidad) || 0
  const precio = Number(material.precio) || 0
  material.precioTotal = (cantidad * precio).toFixed(2)
}
async function cargarCompraParaEdicion(id) {
  try {
    // Aquí cargarías los datos de la compra desde el backend
    const compra = await obtenerCompraPorId(id)
    // Luego llenar el formulario con esos datos
    console.log('Datos de la compra obtenidos:', compra)
    form.value = {
      tipoCompra: compra.tipoCompra,
      fechaIngreso: compra.fechaIngreso,
      tipoDocumento: compra.tipoDocumento,
      numeroDocumento: compra.numeroDocumento,
      materiales: compra.materiales,
      observacion: compra.observacion
    }
    
    console.log('Compra cargada para edición')
  } catch (error) {
    console.error('Error al cargar compra:', error)
    mostrarSnackbar('Error al cargar la compra', 'error')
  }
}
function hoyISO() {
  return new Date().toISOString().split('T')[0]
}
// Opciones para selects
const tiposDocumento = [
  'Factura',
  'Boleta',
  'Guía de Remisión',
  'Nota de Crédito',
  'Nota de Débito'
]
const tiposCompra = [
  'Compra Material',
  'Material SAP'
]

const almacenes = [
  'Almacén Principal',
  'Almacén Secundario',
  'Almacén Temporal',
  'Almacén de Productos Terminados'
]

// Reglas de validación
const rules = {
  required: value => !!value || 'Este campo es requerido'
}
const eliminarUltimaSerie = () => {
  if (!materialActivo.value?.series) return

  let seriesArray = []

  // Normalizar a array
  if (Array.isArray(materialActivo.value.series)) {
    seriesArray = [...materialActivo.value.series]
  } else if (typeof materialActivo.value.series === 'string') {
    seriesArray = materialActivo.value.series
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }

  if (seriesArray.length === 0) return

  // ❌ Eliminar última
  seriesArray.pop()

  // Volver a asignar (manteniendo string)
  materialActivo.value.series = seriesArray.join(',')
}
function eliminarUltimoOPorLista() {
  const seriesTexto = seriesAEliminar.value.trim()
  
  // Si el textarea de eliminación tiene contenido, eliminar por lista
  if (seriesTexto) {
    eliminarSeriesPorLista()
  } else {
    // Si está vacío, eliminar el último item
    eliminarUltimaSerie()
  }
}
function eliminarSeriesPorLista() {
  const seriesTexto = seriesAEliminar.value.trim()
  
  if (!seriesTexto) {
    return
  }

  // Separar por comas y limpiar espacios
  const seriesAEliminarArray = seriesTexto
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(s => s.length > 0)

  if (seriesAEliminarArray.length === 0) {
    mostrarSnackbar('No se encontraron series válidas para eliminar', 'error')
    return
  }
  const seriesActuales = obtenerSeriesArray()

  console.log('Series actuales:', seriesActuales)
  console.log('Series a eliminar:', seriesAEliminarArray)
  // Contar cuántas se eliminaron
  const cantidadAntes = seriesActuales.length
  
  const seriesFiltradas = seriesActuales.filter(
    serie => !seriesAEliminarArray.includes(serie.toUpperCase())
  )
  console.log('Series filtradas:', seriesFiltradas)
  const cantidadDespues = seriesFiltradas.length
  const eliminadas = cantidadAntes - cantidadDespues

  

  if (eliminadas > 0) {
    materialActivo.value.series = seriesFiltradas.join(',')

    mostrarSnackbar(`${eliminadas} serie(s) eliminada(s)`, 'success')
    seriesAEliminar.value = '' // Limpiar textarea
  } else {
    mostrarSnackbar('No se encontraron coincidencias para eliminar', 'warning')
  }
}
const contarSeries = (series) => {
  if (!series) return 0

  if (Array.isArray(series)) {
    return series.filter(s => s?.trim()).length
  }

  if (typeof series === 'string') {
    return series.split(',').filter(s => s.trim()).length
  }

  return 0
}
const cantidadRequerida = computed(() => {
  if (!materialActivo.value) return 0
  return Number(materialActivo.value.cantidad) || 0
})
function abrirModalSeries(material) {
  materialActivo.value = material
  modalSeries.value = true
}
// Funciones
// Funcion cancelar limpia el formulario
function cancelar() {
  limpiarFormulario()
}
const deshabilitarSerieInput = computed(() => {
  return (
    cantidadRequerida.value > 0 &&
    totalSeries.value >= cantidadRequerida.value
  )
})

async function guardar() {
  const { valid } = await formRef.value.validate()
  
  if (!valid) {
    mostrarSnackbar('Por favor complete todos los campos requeridos', 'error')
    return
  }
  const validacion = validarMateriales()
  if (!validacion.valido) {
    mostrarSnackbar(validacion.mensaje, 'error')
    return
  }
  
  // Abrir diálogo de confirmación
  dialogConfirmarGuardar.value = true
}
// Función auxiliar para formatear fecha
function formatearFecha(fechaISO) {
  if (!fechaISO) return ''
  const fecha = new Date(fechaISO)
  return fecha.toLocaleDateString('es-PE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
function contarTotalSeries() {
  if (!form.value.materiales) return 0
  
  return form.value.materiales.reduce((total, material) => {
    return total + contarSeries(material.series)
  }, 0)
}
async function confirmarGuardar() {
  const { valid } = await formRef.value.validate()
  
  
  loadingGuardar.value = true 
  const inicioLoading = Date.now()
  try {
    const payload = {
      tipoCompra: form.value.tipoCompra,
      fechaIngreso: form.value.fechaIngreso,
      tipoDocumento: form.value.tipoDocumento,
      numeroDocumento: form.value.numeroDocumento,      
      observacion: form.value.observacion,
      estado: 'F',
      usuarioCreacion: 'admin', // ← puedes obtenerlo del login
      fechaCreacion: new Date().toISOString(),
      materiales: form.value.materiales.map(m => ({
        materialId: m.materialId,
        codigoMaterial: m.codigoMaterial,
        descripcion: m.descripcion,
        precio: m.precio,
        precioTotal: m.precioTotal,
        cantidad: m.cantidad,
        series: obtenerSeriesDesdeString(m.series),
        fechaCreacion: new Date().toISOString(),
        usuarioCreacion: 'admin'
      }))
    }
    
    console.log('Payload enviado:', payload)

    const respuesta = await crearCompra(payload)

    mostrarSnackbar('Ingreso de material correctamente')
    limpiarFormulario()
    // si nuevo.id existe, mostrar exito
    /*if (nuevo.id) {
      mostrarSnackbar('Documento registrado correctamente', 'success')
      limpiarFormulario()
    }*/
    
  } catch (err) {
    
    console.error('Error al guardar documento:', err)
     // Servicio inactivo o sin conexión
    if (err.code === 'ECONNREFUSED' || 
        err.code === 'ERR_NETWORK' ||
        err.message?.includes('Network Error') ||
        err.message?.includes('ERR_CONNECTION_REFUSED')) {
      mostrarSnackbar('Servicio no disponible. Por favor, intente más tarde.', 'error')
    }
    // Error 500 - Mostrar detalle de la causa
    else if (err.response?.status === 500) {
      const mensajeError = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.response?.data?.causa ||
                          err.response?.data?.detalle ||
                          'Error interno del servidor'
      
      console.error('Detalle error 500:', err.response?.data)
      mostrarSnackbar(`Error del servidor: ${mensajeError}`, 'error')
    } 
    // Error 400 - Validación
    else if (err.response?.status === 400) {
      const mensajeError = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Datos inválidos'
      mostrarSnackbar(`Error de validación: ${mensajeError}`, 'error')
    } 
    // Error 404
    else if (err.response?.status === 404) {
      mostrarSnackbar('Recurso no encontrado', 'error')
    } 
    // Error 401/403 - Sin permisos
    else if (err.response?.status === 401 || err.response?.status === 403) {
      mostrarSnackbar('No tiene permisos para realizar esta acción', 'error')
    } 
    // Error genérico
    else {
      const mensajeError = err.response?.data?.message || 
                          err.message || 
                          'Error desconocido'
      mostrarSnackbar(`Error al guardar: ${mensajeError}`, 'error')
    }
    
    // Log detallado para debugging
    console.error('Detalles completos del error:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message,
      code: err.code
    })
  } finally {
    const tiempoTranscurrido = Date.now() - inicioLoading
    // Cerrar diálogo de confirmación
    dialogConfirmarGuardar.value = false
    const tiempoMinimo = 1000
    if (tiempoTranscurrido < tiempoMinimo) {
      await sleep(tiempoMinimo - tiempoTranscurrido)
    }
    loadingGuardar.value = false 
  }
}
async function semiGuardar() {
  const { valid } = await formRef.value.validate()
  
  
  loadingGuardar.value = true 
  const inicioLoading = Date.now()
  try {
    const payload = {
      tipoCompra: form.value.tipoCompra,
      fechaIngreso: form.value.fechaIngreso,
      tipoDocumento: form.value.tipoDocumento,
      numeroDocumento: form.value.numeroDocumento,      
      observacion: form.value.observacion,
      estado: 'P',
      usuarioCreacion: 'admin', // ← puedes obtenerlo del login
      fechaCreacion: new Date().toISOString(),
      materiales: form.value.materiales.map(m => ({
        materialId: m.materialId,
        codigoMaterial: m.codigoMaterial,
        descripcion: m.descripcion,
        precio: m.precio,
        precioTotal: m.precioTotal,
        cantidad: m.cantidad,
        series: obtenerSeriesDesdeString(m.series),
        fechaCreacion: new Date().toISOString(),
        usuarioCreacion: 'admin'
      }))
    }
    
    console.log('Payload enviado:', payload)

    const respuesta = await crearCompra(payload)

    mostrarSnackbar('Ingreso de material correctamente')
    limpiarFormulario()
    // si nuevo.id existe, mostrar exito
    /*if (nuevo.id) {
      mostrarSnackbar('Documento registrado correctamente', 'success')
      limpiarFormulario()
    }*/
    
  } catch (err) {
    
    console.error('Error al guardar documento:', err)
     // Servicio inactivo o sin conexión
    if (err.code === 'ECONNREFUSED' || 
        err.code === 'ERR_NETWORK' ||
        err.message?.includes('Network Error') ||
        err.message?.includes('ERR_CONNECTION_REFUSED')) {
      mostrarSnackbar('Servicio no disponible. Por favor, intente más tarde.', 'error')
    }
    // Error 500 - Mostrar detalle de la causa
    else if (err.response?.status === 500) {
      const mensajeError = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.response?.data?.causa ||
                          err.response?.data?.detalle ||
                          'Error interno del servidor'
      
      console.error('Detalle error 500:', err.response?.data)
      mostrarSnackbar(`Error del servidor: ${mensajeError}`, 'error')
    } 
    // Error 400 - Validación
    else if (err.response?.status === 400) {
      const mensajeError = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Datos inválidos'
      mostrarSnackbar(`Error de validación: ${mensajeError}`, 'error')
    } 
    // Error 404
    else if (err.response?.status === 404) {
      mostrarSnackbar('Recurso no encontrado', 'error')
    } 
    // Error 401/403 - Sin permisos
    else if (err.response?.status === 401 || err.response?.status === 403) {
      mostrarSnackbar('No tiene permisos para realizar esta acción', 'error')
    } 
    // Error genérico
    else {
      const mensajeError = err.response?.data?.message || 
                          err.message || 
                          'Error desconocido'
      mostrarSnackbar(`Error al guardar: ${mensajeError}`, 'error')
    }
    
    // Log detallado para debugging
    console.error('Detalles completos del error:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message,
      code: err.code
    })
  } finally {
    const tiempoTranscurrido = Date.now() - inicioLoading
    // Cerrar diálogo de confirmación
    dialogConfirmarGuardar.value = false
    const tiempoMinimo = 1000
    if (tiempoTranscurrido < tiempoMinimo) {
      await sleep(tiempoMinimo - tiempoTranscurrido)
    }
    loadingGuardar.value = false 
  }
}
const procesarExcel = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet)

  for (const row of rows) {
    await procesarFilaExcel(row)
  }

  mostrarSnackbar('Excel cargado correctamente')
  event.target.value = '' // reset input
}
const procesarFilaExcel = async (row) => {
  const codigoSAP = row.SAP?.toString().trim()
  const seriesExcel = row.SERIE?.toString().trim()

  if (!codigoSAP || !seriesExcel) return

  // 🔍 Buscar material por SAP
  const { content } = await listarMaterialesService({
    page: 0,
    size: 1,
    codigo: codigoSAP
  })

  const materialApi = content?.[0]
  if (!materialApi) {
    mostrarSnackbar(`Material SAP ${codigoSAP} no encontrado`, 'warning')
    return
  }

  // 🔄 Normalizar series
  const seriesArray = seriesExcel
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const materialExistente = form.value.materiales.find(
    m => m.materialId === codigoSAP
  )

  if (materialExistente) {
    // Merge de series
    const actuales = obtenerSeriesDesdeString(materialExistente.series)
    const nuevas = seriesArray.filter(s => !actuales.includes(s))

    const total = [...actuales, ...nuevas]

    materialExistente.series = total.join(',')
    materialExistente.cantidad = total.length
  } else {
    if (
      form.value.materiales.length === 1 &&
      esFilaVacia(form.value.materiales[0])
    ) {
      form.value.materiales = []
    }
    // Nuevo material
    form.value.materiales.push({
      materialId: codigoSAP,
      codigo: materialApi.codigo,
      descripcion: materialApi.descripcion,
      precio: materialApi.precio,
      precioTotal: materialApi.precioTotal,
      series: seriesArray.join(','),
      cantidad: seriesArray.length,
      search: ''
    })
  }
}
const esFilaVacia = (material) => {
  return (
    !material.codigo &&
    !material.descripcion &&
    !material.cantidad &&
    (!material.series || material.series.length === 0)
  )
}
const obtenerSeriesDesdeString = (series) => {
  if (!series) return []
  if (Array.isArray(series)) return series
  return series.split(',').map(s => s.trim()).filter(Boolean)
}
function validarMateriales() {
  if (!form.value.materiales || form.value.materiales.length === 0) {
    return {
      valido: false,
      mensaje: 'Debe agregar al menos un material'
    }
  }
  for (let i = 0; i < form.value.materiales.length; i++) {
    const material = form.value.materiales[i]
    const indice = i + 1

    // Validar código
    if (!material.codigoMaterial) {
      return {
        valido: false,
        mensaje: `Fila ${indice}: Debe seleccionar un código de material`
      }
    }

    // Validar materialId
    if (!material.materialId) {
      return {
        valido: false,
        mensaje: `Fila ${indice}: Material no válido`
      }
    }

    // Validar cantidad
    const cantidad = Number(material.cantidad) || 0
    if (cantidad <= 0) {
      return {
        valido: false,
        mensaje: `Fila ${indice} (${material.codigoMaterial}): Ingrese una cantidad mayor a 0`
      }
    }

    // ✅ Validar series SOLO si ingresaron series
    const cantidadSeries = contarSeries(material.series)
    
    // Si tiene series ingresadas, deben coincidir con la cantidad
    if (cantidadSeries > 0 && cantidad !== cantidadSeries) {
      return {
        valido: false,
        mensaje: `Fila ${indice} (${material.codigoMaterial}): Cantidad (${cantidad}) debe coincidir con series ingresadas (${cantidadSeries})`
      }
    }
    
    // ✅ Si la cantidad es mayor a 0 pero no hay series, es válido (material sin serie)
    // No validamos nada en este caso, permitimos continuar
  }

  const validacion = form.value.materiales.every(m =>{
    console.log(m),
    m.codigoMaterial &&
    m.materialId }
  )
  if (!validacion) {
    return {
      valido: false,
      mensaje: 'Todos los materiales deben ser válidos'
    }
  }
  return {
    valido: true,
    mensaje: 'Validación exitosa'
  }
}
function agregarMaterial() {
  form.value.materiales.push({
    materialId: null,
    codigo: '',
    cantidad:'',
    descripcion: '',
    precio: '',
    precioTotal: '',
    series: [],
    search: ''
  })
}
function eliminarMaterial(index) {
  form.value.materiales.splice(index, 1)
}

function onMaterialSeleccionado(material) {
  console.log('Material seleccionado para:', material)
  console.log('Código seleccionado:', codigoMateriales)
  const seleccionado = codigoMateriales.value.find(
    m => m.codigo === material.codigoMaterial
  )
  console.log('Material seleccionado:', seleccionado)
  if (!seleccionado) return
  material.materialId = seleccionado.id
  material.descripcion = seleccionado?.descripcion || ''
}

function mostrarSnackbar(text, color = 'success') {
  snackbar.value.show = false 
  snackbar.value.text = text
  snackbar.value.color = color
  setTimeout(() => {
    snackbar.value.show = true
  }, 50)
}
const cantidadSeriesInconsistente = (material) => {
  const cantidad = Number(material.cantidad) || 0
  const series = contarSeries(material.series)

  return series > 0 && cantidad !== series
}
function limpiarFormulario() {
  form.value = {
    fechaIngreso: hoyISO(),
    tipoCompra: '',
    tipoDocumento: '',
    numeroDocumento: '',
    valeReserva: '',
    almacen: '',
    observacion: '',
    materiales: [
      {
        materialId: null,
        codigoMaterial: '',
        cantidad: '',
        descripcion: '',
        precio: '',
        precioTotal: '',
        series: '',
        search: ''
      }
    ]
  }
  formRef.value.reset()
}
const obtenerSeriesArray = () => {
  const series = materialActivo.value.series

  if (!series) return []

  if (Array.isArray(series)) {
    return series.map(s => s.trim())
  }

  if (typeof series === 'string') {
    return series.split(',').map(s => s.trim()).filter(Boolean)
  }

  return []
}
const agregarSerie = () => {

  console.log('Agregar serie:', serieInput.value)
  console.log('Procesando serie:', isProcesandoSerie.value)
  if (!serieInput.value || isProcesandoSerie.value) return

    // 🔍 Obtener series actuales como array
  const seriesActuales = obtenerSeriesArray()

  isProcesandoSerie.value = true
  const serieCapturada = serieInput.value
  console.log('Serie capturada:', serieCapturada)
  console.log(seriesActuales)
   // ❌ Validar duplicado
  if (seriesActuales.includes(serieCapturada)) {
    console.log('Serie duplicada:', serieCapturada)
    mostrarSnackbar('La serie ya existe en la lista', 'warning')
    serieInput.value = ''
    isProcesandoSerie.value = false
    return
  }

 

  // 👉 Retardo visual
  setTimeout(() => {
    materialActivo.value.series =
      materialActivo.value.series.length>0
        ? materialActivo.value.series + ',' + serieCapturada
        : serieCapturada

    serieInput.value = ''
    isProcesandoSerie.value = false
  }, 1000)

}

const limpiarSeries = () => {
  materialActivo.value.series = ''
}

const totalSeries = computed(() => {
  if (!materialActivo.value) return 0
  return obtenerSeriesArray().length
})

async function buscarCodigoMateriales(criterio) {
  if (!criterio || criterio.length < 3) {
    codigoMateriales.value = []
    return
  }

  try {
    loadingCodigoMateriales.value = true

    const { content } = await listarMaterialesService({
      page: 0,
      size: 10,
      codigo: criterio
    })

    codigoMateriales.value = content || []
  } catch (error) {
    console.error('Error buscando materiales', error)
    codigoMateriales.value = []
  } finally {
    loadingCodigoMateriales.value = false
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.table-header {
  font-weight: 600;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
  padding: 4px 0;
  text-align: center;
  font-size: 1rem;
  color: #1976d2;
}

.table-row {
  border-bottom: 1px solid #e0e0e0;
  padding: 0;
}

.table-row:hover {
  background-color: #fafafa;
}
.bg-palo-rosa {
  background-color: #f8d7da; /* palo rosa */
  border-radius: 6px;
}
.bg-palo-blue {
  background-color: #d1ecf1; /* palo blue */
  border-radius: 6px;
}
.custom-width {
  min-width: 90% !important;
  width: 90% !important;
}
</style>