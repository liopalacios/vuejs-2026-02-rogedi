import api from './api';

const resource = '/tecnicos';

// Obtener todos los técnicos
export const getTecnicos = async () => {
  const response = await api.get(resource);
  return response.data;
};

// Buscar técnico por nombre y documento
export const buscarTecnico = async (nombre, documento, tipo) => {
  if (tipo === undefined || tipo === null || tipo === '') {
    tipo = null;
  }
  const response = await api.get(`${resource}/buscar`, {
    params: { nombre, documento, tipo }
  });
  return response.data;
};

export const buscarTecnicoPorEmailTelefono = async (email, telefono) => {
  if (email === undefined || email === null || email === '') {
    email = null;
  }
  if (telefono === undefined || telefono === null || telefono === '') {
    telefono = null;
  }
  const response = await api.get(`${resource}/buscar-email-telefono`, {
    params: { email, telefono }
  });
  return response.data;
};
// Crear técnico
export const crearTecnico = async (tecnico) => {
  const response = await api.post(resource, tecnico);
  return response.data; // devuelve el técnico creado con ID
};

// Modificar técnico
export const modificarTecnico = async (id, tecnico) => {
  const response = await api.put(`${resource}/${id}`, tecnico);
  return response.data; // devuelve el técnico actualizado
};

// Eliminar técnico
export const eliminarTecnico = async (id) => {
  try {
    const response = await api.delete(`${resource}/${id}`);
    console.log('Respuesta al eliminar:', response);
    return response.data === 1 ? 1 : 0; // 👈 RETORNA
  } catch (error) {
    console.error('Error al eliminar:', error);
    throw error; // 👈 O lanza el error
  }
};