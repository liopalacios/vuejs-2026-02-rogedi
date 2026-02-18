<template>
  <div>

    <!-- LOADING -->
    <v-skeleton-loader
      v-if="loading"
      type="article, table"
    />

    <template v-else>

      <!-- DATOS GENERALES -->
      <v-row>
        <v-col cols="12" md="3">
          <v-card variant="outlined">
            <v-card-text>
              <strong>Documento</strong>
              <div>{{ compra.tipoDocumento }} - {{ compra.numeroDocumento }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card variant="outlined">
            <v-card-text>
              <strong>Fecha ingreso</strong>
              <div>{{ compra.fechaIngreso }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card variant="outlined">
            <v-card-text>
              <strong>Estado</strong>
              <v-chip
                :color="estadoColor(compra.estado)"
                size="small"
              >
                {{ estadoTexto(compra.estado) }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- MATERIALES -->
      <v-row class="mt-6">
        <v-col cols="12">
          <h3 class="mb-3">Materiales ingresados</h3>

          <v-expansion-panels variant="accordion">
            <v-expansion-panel
              v-for="material in compra.materiales"
              :key="material.id"
              :disabled="!material.series?.length"
            >
              <v-expansion-panel-title>
                <div class="d-flex justify-space-between w-100">
                  <div>
                    <strong>{{ material.nombre }}</strong>
                    <div class="text-caption">
                      {{ material.descripcion }} ( {{ material.cantidad }} ) {{ material.unidad }}
                    </div>
                  </div>

                  <v-chip
                    v-if="material.series?.length"
                    size="small"
                    color="primary"
                    variant="tonal"
                  >
                    {{ material.series.length }} series
                  </v-chip>

                  <v-chip
                    v-else
                    size="small"
                    variant="outlined"
                  >
                    Sin series
                  </v-chip>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <div class="d-flex flex-wrap gap-2">

                    <v-chip
                    v-for="serie in material.series"
                    :key="serie"
                    size="small"
                    color="primary"
                    variant="tonal"
                    >
                    {{ serie }}
                    </v-chip>

                </div>
              </v-expansion-panel-text>

            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerCompraPorId } from '@/services/comprasService'


const props = defineProps({
  idCompra: {
    type: Number,
    required: true
  }
})

const loading = ref(false)
const compra = ref({ materiales: [] })

const headersSeries = [
  { title: 'Serie', key: 'codigo' },
  { title: 'Estado', key: 'estado' }
]

onMounted(async () => {
  loading.value = true
  try {
    compra.value = await obtenerCompraPorId(props.idCompra)
  } finally {
    loading.value = false
  }
})

function estadoColor(estado) {
  return estado === 'P' ? 'warning' : estado === 'F' ? 'success' : 'error'
}

function estadoTexto(estado) {
  return estado === 'P' ? 'Pendiente' : estado === 'F' ? 'Finalizado' : 'Anulado'
}

</script>
<style>
.gap-2 {
  gap: 8px;
}
</style>