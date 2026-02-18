<template>
  <v-dialog
    v-model="dialog"
    max-width="95vw"
    fullscreen
    persistent
  >
    <v-card>
      <!-- Header -->
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          <v-icon class="mr-2">mdi-file-pdf-box</v-icon>
          Despacho - {{ numeroDocumento }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="descargarPDF">
          <v-icon>mdi-download</v-icon>
          <v-tooltip activator="parent" location="bottom">
            Descargar PDF
          </v-tooltip>
        </v-btn>
        <v-btn icon @click="imprimirPDF">
          <v-icon>mdi-printer</v-icon>
          <v-tooltip activator="parent" location="bottom">
            Imprimir
          </v-tooltip>
        </v-btn>
        <v-btn icon @click="cerrar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Contenido del PDF -->
      <v-card-text class="pa-0 fill-height">
        <div v-if="cargando" class="d-flex justify-center align-center fill-height">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
        </div>

        <div v-else-if="error" class="d-flex justify-center align-center fill-height flex-column">
          <v-icon size="64" color="error">mdi-alert-circle</v-icon>
          <p class="text-h6 mt-4">{{ error }}</p>
          <v-btn color="primary" class="mt-4" @click="intentarCargar">
            Reintentar
          </v-btn>
        </div>

        <div v-else-if="urlPDF" class="fill-height">
          <iframe
            :src="urlPDF"
            frameborder="0"
            width="100%"
            height="100%"
            style="min-height: 85vh;"
            @load="onPDFLoad"
          ></iframe>
        </div>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="outlined"
          @click="cerrar"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { generarPDFDespacho } from '@/services/stockService'

const props = defineProps({
  modelo: {
    type: Boolean,
    required: true
  },
  movimientoId: {
    type: Number,
    required: true
  },
  numeroDocumento: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelo', 'cerrar'])

const dialog = computed({
  get() {
    return props.modelo
  },
  set(value) {
    emit('update:modelo', value)
  }
})

const urlPDF = ref(null)
const cargando = ref(false)
const error = ref(null)

watch(() => props.movimientoId, (nuevoId) => {
  if (nuevoId && dialog.value) {
    cargarPDF(nuevoId)
  }
}, { immediate: true })

async function cargarPDF(movimientoId) {
  cargando.value = true
  error.value = null
  urlPDF.value = null

  try {
    // Obtener el PDF como blob desde el backend
    const blob = await generarPDFDespacho(movimientoId)
    
    // Crear URL para el blob
    const url = URL.createObjectURL(blob)
    urlPDF.value = url
  } catch (err) {
    console.error('Error al cargar PDF:', err)
    error.value = 'No se pudo cargar el PDF. Intente nuevamente.'
  } finally {
    cargando.value = false
  }
}

function onPDFLoad() {
  console.log('PDF cargado correctamente')
}

function descargarPDF() {
  if (urlPDF.value) {
    const link = document.createElement('a')
    link.href = urlPDF.value
    link.download = `Despacho_${props.numeroDocumento || props.movimientoId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

function imprimirPDF() {
  if (urlPDF.value) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = urlPDF.value
    document.body.appendChild(iframe)
    
    iframe.onload = function() {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
    }
  }
}

function intentarCargar() {
  if (props.movimientoId) {
    cargarPDF(props.movimientoId)
  }
}

function cerrar() {
  // Liberar URL del blob para evitar fugas de memoria
  if (urlPDF.value) {
    URL.revokeObjectURL(urlPDF.value)
    urlPDF.value = null
  }
  emit('cerrar')
}
</script>

<style scoped>
.fill-height {
  height: 100%;
}
</style>