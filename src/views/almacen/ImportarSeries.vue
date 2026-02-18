<template>
    <v-container fluid class="fill-height bg-gradient">
    <v-row justify="center" align="center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="12" class="rounded-xl">
          <!-- Header -->
            <v-card-title class="bg-blue-darken-1 text-white pa-4">
                <v-icon class="mr-2">mdi-file-upload</v-icon>
                Importar Series
            </v-card-title>                            
            <v-card-text class="pa-6">
                <v-form @submit.prevent="handleImport">
                <v-row>
                    <v-col cols="12">
                    <!-- Input file personalizado -->
                    <v-file-input
                        v-model="selectedFile"
                        label="Seleccionar archivo"
                        accept=".csv,.xlsx"
                        prepend-icon="mdi-file-delimited"
                        variant="outlined"
                        density="comfortable"
                        show-size
                        required
                        :rules="[rules.required]"
                        color="primary"
                    >
                        <template v-slot:prepend-inner>
                        <v-icon color="primary">mdi-paperclip</v-icon>
                        </template>
                    </v-file-input>
                    
                    <div class="text-caption text-grey-darken-1 mt-2">
                        <v-icon size="small" class="mr-1">mdi-information</v-icon>
                        Formatos aceptados: CSV, XLSX
                    </div>
                    </v-col>

                    <v-col cols="12" class="text-center">
                    <v-btn
                        type="submit"
                        color="primary"
                        size="large"
                        prepend-icon="mdi-upload"
                        :loading="loading"
                        :disabled="!selectedFile"
                        elevation="2"
                    >
                        Importar
                    </v-btn>
                    </v-col>
                </v-row>
                </v-form>

                <!-- Mensaje de respuesta -->
                <v-alert
                v-if="message"
                :type="messageType"
                variant="tonal"
                class="mt-4"
                closable
                @click:close="message = ''"
                >
                {{ message }}
                </v-alert>

               
            
          </v-card-text>
           <!-- Snackbar para notificaciones -->
            <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            top
            right
            >
            {{ snackbar.text }}
            </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
    
</template>

<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { importarSeries } from '@/services/seriesService'

// Referencias
const selectedFile = ref(null)
const message = ref('')
const messageType = ref('success')
const loading = ref(false)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Reglas de validación
const rules = {
  required: value => !!value || 'Debe seleccionar un archivo'
}

// Funciones
function onFileSelected(event) {
  const file = event.target.files[0]
  selectedFile.value = file
  console.log('Archivo seleccionado:', file)
}

async function handleImport() {
  if (!selectedFile.value) {
    mostrarMensaje('Por favor seleccione un archivo', 'error')
    return
  }

  loading.value = true
  message.value = ''

  try {
    // Leer el archivo
    const data = await leerArchivoExcel(selectedFile.value)
    
    // Validar columnas requeridas
    if (!validarColumnas(data)) {
      mostrarMensaje('El archivo debe contener las columnas: numeroSerie, modelo, anioFabrica', 'error')
      loading.value = false
      return
    }

    // Validar que todas las filas tengan numeroSerie
    const seriesValidas = validarSeries(data)
    
    if (seriesValidas.invalidas.length > 0) {
      mostrarMensaje(
        `Se encontraron ${seriesValidas.invalidas.length} filas sin número de serie. Total válidas: ${seriesValidas.validas.length}`,
        'warning'
      )
    }

    if (seriesValidas.validas.length === 0) {
      mostrarMensaje('No hay series válidas para importar', 'error')
      loading.value = false
      return
    }

    // Enviar al servicio API
    console.log('Series a importar:', seriesValidas.validas)
    
    // Descomentar cuando tengas el servicio listo
    // const resultado = await importarSeries(seriesValidas.validas)
    // if (resultado.success) {
    //   mostrarMensaje(`Se importaron ${seriesValidas.validas.length} series correctamente`, 'success')
    //   mostrarSnackbar('Importación completada', 'success')
    //   selectedFile.value = null
    // }
    
    // Simulación exitosa (eliminar cuando uses el servicio real)
    // Enviar al backend
    console.log('Series a importar:', seriesValidas.validas)
    const resultado = await importarSeries(seriesValidas.validas)
    
    if (resultado.success) {
      mostrarMensaje(
        `${resultado.message}. Importadas: ${resultado.importadas} de ${resultado.total}`,
        'success'
      )
      mostrarSnackbar('Importación completada exitosamente', 'success')
      selectedFile.value = null
    } else {
      mostrarMensaje(resultado.message || 'Error al importar series', 'error')
      mostrarSnackbar('Error en la importación', 'error')
    }
    
  } catch (error) {
    mostrarMensaje('Error al procesar el archivo: ' + error.message, 'error')
    mostrarSnackbar('Error en la importación', 'error')
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

async function leerArchivoExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)
        resolve(jsonData)
      } catch (error) {
        console.error('Error al leer el archivo Excel:', error)
        reject(new Error('Error al leer el archivo Excel'))
      }
    }
    
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

function validarColumnas(data) {
  if (!data || data.length === 0) return false
  
  const primeraFila = data[0]
  const columnasRequeridas = ['numeroSerie', 'modelo', 'anioFabrica']
  
  return columnasRequeridas.every(col => col in primeraFila)
}

function validarSeries(data) {
  const validas = []
  const invalidas = []
  
  data.forEach((fila, index) => {
    // numeroSerie es obligatorio
    if (!fila.numeroSerie || fila.numeroSerie.toString().trim() === '') {
      invalidas.push({ fila: index + 1, motivo: 'Sin número de serie' })
      return
    }
    
    // Crear objeto con los datos
    const serie = {
      numeroSerie: fila.numeroSerie.toString().trim(),
      modelo: fila.modelo ? fila.modelo.toString().trim() : null,
      anioFabrica: fila.anioFabrica ? parseInt(fila.anioFabrica) : null,
      materialId: fila.material ? parseInt(fila.material) : null
    }
    
    validas.push(serie)
  })
  
  return { validas, invalidas }
}

function mostrarMensaje(texto, tipo = 'success') {
  message.value = texto
  messageType.value = tipo
}

function mostrarSnackbar(text, color = 'success') {
  snackbar.value.text = text
  snackbar.value.color = color
  snackbar.value.show = true
}
</script>

<style scoped>
.bg-primary {
  background-color: #1976D2 !important;
}

.bg-blue-darken-1 {
  background-color: #1565C0 !important;
}
</style>