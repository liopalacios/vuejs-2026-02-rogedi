import api from './api';

const resource = '/materiales-detalle';

/**
 * Listar series con paginación y filtro por código de material
 * @param {Object} params - { page, size, codigoMaterial }
 * @returns {Object} { content, total }
 */
export const listarSeriesService = async ({ page = 0, size = 10, codigo = "", descripcion = "" }) => {
  try {
    const response = await api.get(resource, {
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


/**
 * Crear una nueva serie
 */
export const crearSerie = async (serie) => {
  try {
    const response = await axios.post(API_URL, serie);
    return response.data;
  } catch (error) {
    console.error("Error al crear serie:", error);
    throw error;
  }
};

/**
 * Eliminar una serie por ID
 */
export const eliminarSerie = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Error al eliminar serie:", error);
    return false;
  }
};

/**
 * Importar múltiples series desde un archivo Excel
 * @param {Array} series - Array de objetos con {numeroSerie, modelo, anioFabricacion}
 * @returns {Object} { success, message, importadas, total }
 */
export const importarSeries = async (series) => {
  try {
    const response = await api.post(`${resource}/importar`, series);
    return response.data;
  } catch (error) {
    console.error("Error al importar series:", error);
    throw error;
  }
};
