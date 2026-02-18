import api from './api';

const resource = '/materiales';

// Obtener todos los técnicos
export const getMateriales = async () => {
  const response = await api.get(resource);
  return response.data;
};


// Crear técnico
export const crearMaterial = async (tecnico) => {
  const response = await api.post(resource, tecnico);
  return response.data; // devuelve el técnico creado con ID
};

// Modificar técnico
export const modificarMaterial = async (id, tecnico) => {
  const response = await api.put(`${resource}/${id}`, tecnico);
  return response.data; // devuelve el técnico actualizado
};

// Eliminar técnico
export const eliminarMaterial = async (id) => {
  await api.delete(`${resource}/${id}`);
};

/**
 * Listar series con paginación y filtro por código de material
 * @param {Object} params - { page, size, codigoMaterial }
 * @returns {Object} { content, total }
 */
export const listarMaterialesService = async ({ page = 0, size = 10, codigo = "", descripcion = "" }) => {
  try {
    const response = await api.get(resource+'/listar-por-codigo', {
      params: {
        page,
        size,
        codigo,
        descripcion
      },
    });
    console.log(response);
    // Estructura esperada del backend: { content: [], totalElements: 100 }
    return {
      content: response.data.content || [],
      total: response.data.totalElements || 0,
    };
  } catch (error) {
    console.error("Error al listar series:", error);
    return { content: [], total: 0 };
  }
};