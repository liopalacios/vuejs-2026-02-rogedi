<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="text-h6">Mantenimiento de Técnicos</span>
        <v-spacer></v-spacer>
        
      </v-card-title>
      <!-- 🔎 Filtros de búsqueda -->
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="searchNombre"
              label="Buscar por nombre"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="searchDocumento"
              label="Buscar por número de documento"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4" class="d-flex justify-end align-center">
            <v-btn color="primary" @click="abrirFormulario()">Agregar Técnico</v-btn>
          </v-col>
          
        </v-row>
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="tecnicosFiltrados"
        class="elevation-1"
      >
        <template #item.acciones="{ item }">
          <v-btn icon color="blue" @click="abrirFormulario(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="confirmarEliminar(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal Formulario -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{ form.id ? 'Editar Técnico' : 'Agregar Técnico' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field v-model="form.nombres" label="Nombres" required></v-text-field>
            <v-text-field v-model="form.apellidos" label="Apellidos" required></v-text-field>
            <v-row>
              <v-col cols="12" sm="5">
                <v-select
                  v-model="form.tipoDocumento"
                  :items="['DNI', 'Pasaporte', 'Carnet de Extranjería']"
                  label="Tipo de Documento"
                  required
                  :rules="[v => !!v || 'Tipo de documento es obligatorio']"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="7">
                <v-text-field
                  v-model="form.numeroDocumento"
                  label="Número de Documento"
                  required
                  :rules="reglasNumeroDocumento"
                ></v-text-field>
              </v-col>
            </v-row>            
            <v-text-field v-model="form.direccion" label="Dirección" 
              :rules="[v => !!v || 'Dirección es obligatorio']"
              required></v-text-field>
            
            <v-row>
              <v-col cols="12" sm="7">
                <v-text-field v-model="form.email" label="Email"                 
                  :rules="reglasEmail"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field 
                  v-model="form.fechaNacimiento"
                  placeholder="dd/mm/aaaa"
                  maxlength="10"                  
                  @input="form.fechaNacimiento = formatFecha(form.fechaNacimiento)"
                  label="Fecha de nacimiento" type="text" 
                  :rules="reglasFechaNacimiento"
                  required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="8">
                <v-text-field v-model="form.telefono" label="Teléfono" required :rules="reglasTelefono"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="form.costo" label="Costo" type="number"
                :rules="[
                  v => !v || !isNaN(parseFloat(v)) || 'Debe ser un número válido'
                ]"></v-text-field>
              </v-col>
            </v-row>
            
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="guardar()" :disabled="!formValido">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right>
    {{ snackbar.text }}
  </v-snackbar>

  <div>
    <v-dialog v-model="dialogEliminar" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 bg-red-lighten-5 d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Confirmar eliminación
        </v-card-title>
        
        <v-card-text class="pt-4">
          <p class="text-body-1 mb-2">
            ¿Estás seguro que deseas eliminar al técnico?
          </p>
          <p class="text-h6 font-weight-bold text-center my-3">
            {{ tecnicoAEliminar?.nombres }} {{ tecnicoAEliminar?.apellidos }}
          </p>
          <p class="text-caption text-medium-emphasis">
            Esta acción no se puede deshacer y eliminará permanentemente al técnico del sistema.
          </p>
          
          <!-- Información adicional del técnico -->
          <v-row class="mt-2 text-caption">
            <v-col cols="6" class="py-1">
              <span class="font-weight-bold">Documento:</span>
            </v-col>
            <v-col cols="6" class="py-1 text-right">
              {{ tecnicoAEliminar?.tipoDocumento }}: {{ tecnicoAEliminar?.numeroDocumento }}
            </v-col>
            <v-col cols="6" class="py-1">
              <span class="font-weight-bold">Teléfono:</span>
            </v-col>
            <v-col cols="6" class="py-1 text-right">
              {{ tecnicoAEliminar?.telefono || 'No especificado' }}
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-divider></v-divider>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            variant="text" 
            @click="dialogEliminar = false"
            :disabled="eliminando"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="error" 
            @click="ejecutarEliminar"
            :loading="eliminando"
            :disabled="eliminando"
          >
            <v-icon left>mdi-delete</v-icon>
            Sí, eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right>
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
//import { useTecnicosStore } from '../../store/tecnicos';
import { getTecnicos, crearTecnico, modificarTecnico, buscarTecnico, buscarTecnicoPorEmailTelefono, eliminarTecnico } 
from '@/services/tecnicoService';
const dialogEliminar = ref(false);
const tecnicoAEliminar = ref(null);
const eliminando = ref(false);
//const tecnicosStore = useTecnicosStore();
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});
const headers = [
  { title: 'Nombres', key: 'nombres' },
  { title: 'Apellidos', key: 'apellidos' },
  { title: 'Tipo Documento', key: 'tipoDocumento' },
  { title: 'Número Documento', key: 'numeroDocumento' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Dirección', key: 'direccion' },
  { title: 'Costo', key: 'costo' },
  { title: 'Acciones', key: 'acciones', sortable: false }
];

const dialog = ref(false);
const formRef = ref(null);
const form = ref({});
const tecnicos = ref([]);
const searchNombre = ref('');
const searchDocumento = ref('');
onMounted(async () => {
  tecnicos.value = await getTecnicos();
});
const agregar = async () => {
  const nuevo = await crearTecnico({ 
    nombres: "Nuevo", 
    apellidos: "Prueba", 
    numeroDocumento: "11122233" 
  });
  tecnicos.value.push(nuevo);
};
// Computed que filtra por nombre o documento
const tecnicosFiltrados = computed(() => {
  return tecnicos.value.filter(t => {
    const matchNombre = searchNombre.value
      ? (t.nombres.toLowerCase().includes(searchNombre.value.toLowerCase()) ||
         t.apellidos.toLowerCase().includes(searchNombre.value.toLowerCase()))
      : true;
    const matchDocumento = searchDocumento.value
      ? t.numeroDocumento.includes(searchDocumento.value)
      : true;
    return matchNombre && matchDocumento;
  });
});
const reglasNumeroDocumento = computed(() => {
  return [
    v => !!v || 'Número de documento es obligatorio',
    v => {
      if (!v) return true;
      const tipo = form.value.tipoDocumento;
      if (tipo === 'DNI') {
        return (v.length === 8 && /^\d+$/.test(v)) || 'DNI debe tener 8 dígitos numéricos';
      } else if (tipo === 'Carnet de Extranjería') {
        return (v.length === 9 && /^\d+$/.test(v)) || 'Carnet de Extranjería debe tener 9 dígitos numéricos';
      } else if (tipo === 'Pasaporte') {
        return (v.length <= 12) || 'Pasaporte debe tener máximo 12 caracteres';
      }
      return true;
    }
  ];
});
const formValido = computed(() => {
  if (!form.value) return false;
  
  // Campos obligatorios (excepto costo)
  const obligatorios = [
    form.value.nombres,
    form.value.apellidos,
    form.value.tipoDocumento,
    form.value.numeroDocumento,
    form.value.direccion,
    form.value.email,
    form.value.fechaNacimiento,
    form.value.telefono
  ];
  
  if (obligatorios.some(campo => !campo)) return false;
  
  // Validación específica de documento
  const tipoDoc = form.value.tipoDocumento;
  const numDoc = form.value.numeroDocumento;
  
  if (tipoDoc === 'DNI' && (!/^\d{8}$/.test(numDoc))) return false;
  if (tipoDoc === 'Carnet de Extranjería' && (!/^\d{9}$/.test(numDoc))) return false;
  if (tipoDoc === 'Pasaporte' && numDoc.length > 12) return false;
  
  // Validación email
  if (!/.+@.+\..+/.test(form.value.email)) return false;
  
  // Validación teléfono
  if (!/^\d{9}$/.test(form.value.telefono)) return false;
  
  // Validación mayor de edad
  if (validarMayorEdad(form.value.fechaNacimiento) !== true) return false;
  
  return true;
});
const reglasEmail = [
  v => !!v || 'Email es obligatorio',
  v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Email debe tener un formato válido'
];
const reglasTelefono = [
  v => !!v || 'Teléfono es obligatorio',
  v => /^\d{9}$/.test(v) || 'Teléfono debe tener 9 dígitos numéricos'
];
function confirmarEliminar(tecnico) {
  tecnicoAEliminar.value = tecnico;
  dialogEliminar.value = true;
}

async function ejecutarEliminar() {
  if (!tecnicoAEliminar.value) return;
  
  eliminando.value = true;
  
  try {
    const respuesta = await eliminarTecnico(tecnicoAEliminar.value.id);
    console.log('Respuesta al eliminar:', respuesta);
    
    if (respuesta === 1) {
      mostrarSnackbar('Técnico eliminado correctamente', 'success');
      tecnicos.value = await getTecnicos();
    } else {
      mostrarSnackbar('Error al eliminar técnico', 'error');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    mostrarSnackbar('Error al eliminar técnico', 'error');
  } finally {
    eliminando.value = false;
    dialogEliminar.value = false;
    tecnicoAEliminar.value = null;
  }
}
function abrirFormulario(tecnico = null) {
  form.value = tecnico ? { ...tecnico } : {};
  if (form.value.fechaNacimiento) {
    form.value.fechaNacimiento = convertirFecha(form.value.fechaNacimiento);
  }
  dialog.value = true;
}
function convertirFecha(fechaIso) {
  const partes = fechaIso.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return fechaIso;
}
function convertirFechaISO(fecha) {
  const partes = fecha.split("/");
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return fecha;
}
async function guardar() {
  try {
    let tecnico = { ...form.value }
    if (tecnico.fechaNacimiento) {
      tecnico.fechaNacimiento = convertirFechaISO(tecnico.fechaNacimiento);
    }
    const tecnicoExistente = await buscarTecnico(null, tecnico.numeroDocumento, tecnico.tipoDocumento);
    console.log('Técnico existente encontrado:', tecnicoExistente);
    
    const tecnicoEmailExistente = await buscarTecnicoPorEmailTelefono(tecnico.email, tecnico.telefono);
    console.log('Técnico con email o teléfono existente:', tecnicoEmailExistente);
    
    console.log('Guardando técnico:', tecnico);
    if (tecnico.id) {
      console.log('Modificando técnico con ID:', tecnico.id);
      const actualizado = await modificarTecnico(tecnico.id, tecnico);
      console.log('Técnico modificado:', actualizado);  
      if (actualizado === 1) {
        mostrarSnackbar('Técnico actualizado correctamente', 'success');
        tecnicos.value = await getTecnicos();
      }
    } else {
      if (tecnicoEmailExistente && tecnicoEmailExistente.length > 0) {
        mostrarSnackbar('Ya existe un técnico con el mismo email o teléfono', 'error');
        return;
      }
      if (tecnicoExistente && tecnicoExistente.length > 0) {
      mostrarSnackbar('Ya existe un técnico con el mismo nombre y número de documento', 'error');
        return;
      }
      console.log('Creando nuevo técnico');
      const creado = await crearTecnico(tecnico);
      console.log('Técnico creado con ID:', creado);
      if (creado === 1) {
        mostrarSnackbar('Técnico registrado correctamente', 'success');
        tecnicos.value = await getTecnicos();
      }
    }
    dialog.value = false;
  } catch (err) {
    mostrarSnackbar('Error al guardar técnico', 'error');
    console.error("Error al guardar técnico:", err);
  }
  
}
function mostrarSnackbar(text, color = 'success') {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
}
async function eliminar(id) {
  const delet = await eliminarTecnico(id);
  console.log('Respuesta al eliminar:', delet);
  if (delet === 1) {
    mostrarSnackbar('Técnico eliminado correctamente', 'success');
    tecnicos.value = await getTecnicos();
  } else {
    mostrarSnackbar('Error al eliminar técnico', 'error');
  }
}
function formatFecha(value) {
  console.log('Formato antes:', value);
  if (!value) return '';

  // quitar todo lo que no sea número
  value = value.replace(/\D/g, '');

  // insertar slashes según la longitud
  if (value.length > 2) {
    let dia = value.slice(0, 2);
    let mes = value.slice(2, 4);

    // Validar mes (si es mayor a 12, regresamos al "/")
    if (mes && parseInt(mes) > 12) {
      value = dia + '/';
    } else if (value.length <= 4) {
      value = dia + '/' + mes;
    } else {
      let anio = value.slice(4, 8);
      value = dia + '/' + mes + '/' + anio;
    }
  }


  return value.substring(0, 10); // limitar a 10 caracteres
}
const validarMayorEdad = (fecha) => {
  if (!fecha) return 'Fecha de nacimiento es obligatoria';
  
  const partes = fecha.split('/');
  if (partes.length !== 3) return 'Formato de fecha inválido';
  
  const dia = parseInt(partes[0]);
  const mes = parseInt(partes[1]) - 1;
  const anio = parseInt(partes[2]);
  
  const fechaNac = new Date(anio, mes, dia);
  const hoy = new Date();
  
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mesDiff = hoy.getMonth() - fechaNac.getMonth();
  
  if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  return edad >= 18 || 'Debe ser mayor de 18 años';
};

const reglasFechaNacimiento = [
  v => !!v || 'Fecha de nacimiento es obligatoria',
  v => validarMayorEdad(v)
];
</script>
