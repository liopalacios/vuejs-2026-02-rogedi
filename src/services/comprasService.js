import api from './api';

const resource = '/compras';

/**
 * Listar compras con paginación y filtro por código de material
 * @param {Object} params - { page, size, codigoMaterial }
 * @returns {Object} { content, total }
 */
export const listarComprasService = async (
    { page = 0, size = 10, tipoDocumento = "", numeroDocumento = "" , estado=""}) => {
  try {
    const response = await api.get(resource, {
      params: {
        page,
        size,
        tipoDocumento,
        numeroDocumento,
        estado
      },
    });
    console.log(response);
    // Estructura esperada del backend: { content: [], totalElements: 100 }
    return {
      content: response.data.content || [],
      total: response.data.totalElements || 0,
    };
  } catch (error) {
    console.error("Error al listar compras:", error);
    return { content: [], total: 0 };
  }
};


/**
 * Crear una nueva compra
 */
export const crearCompra = async (compra) => {
  try {
    const response = await api.post(resource, compra);
    return response.data;
  } catch (error) {
    console.error("Error al crear compra:", error);
    throw error;
  }
};

/**
 * Eliminar una compra por ID
 */
export const eliminarCompra = async (id) => {
  try {
    await axios.delete(`${resource}/${id}`);
    return true;
  } catch (error) {
    console.error("Error al eliminar compra:", error);
    return false;
  }
};

export const finalizarCompraService = async (id) => {
  try {
    const response = await api.put(`${resource}/${id}/finalizar`);
    
    console.log('Respuesta finalizar compra:', response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error al finalizar compra:", error);
    
    // Manejo de errores específicos
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error')) {
      const err = new Error('Servicio no disponible');
      err.code = 'ECONNREFUSED';
      throw err;
    }
    
    if (error.response?.status === 500) {
      const mensaje = error.response?.data?.message || 
                     error.response?.data?.error || 
                     error.response?.data?.causa ||
                     'Error interno del servidor';
      const err = new Error(mensaje);
      err.response = error.response;
      throw err;
    }
    
    if (error.response?.status === 400) {
      const mensaje = error.response?.data?.message || 
                     'No se puede finalizar la compra';
      const err = new Error(mensaje);
      err.response = error.response;
      throw err;
    }
    
    if (error.response?.status === 404) {
      const err = new Error('Compra no encontrada');
      err.response = error.response;
      throw err;
    }
    
    // Re-lanzar el error con toda la información
    throw error;
  }
};
export const anularCompraService = async (id) => {
  try {
    const response = await api.put(`${resource}/${id}/anular`);
    
    console.log('Respuesta anular compra:', response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error al anular compra:", error);
    
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error')) {
      const err = new Error('Servicio no disponible');
      err.code = 'ECONNREFUSED';
      throw err;
    }
    
    if (error.response?.status === 500) {
      const mensaje = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Error interno del servidor';
      const err = new Error(mensaje);
      err.response = error.response;
      throw err;
    }
    
    throw error;
  }
};
export const obtenerCompraPorId = async (id) => {
  try {
    const response = await api.get(`${resource}/${id}`);
    
    console.log('Respuesta obtener compra por ID:', response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error al obtener compra por ID:", error);
    
    // Manejo de errores específicos
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error')) {
      const err = new Error('Servicio no disponible');
      err.code = 'ECONNREFUSED';
      throw err;
    }
    
    if (error.response?.status === 404) {
      const err = new Error('Compra no encontrada');
      err.response = error.response;
      throw err;
    }
    
    if (error.response?.status === 500) {
      const mensaje = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Error interno del servidor';
      const err = new Error(mensaje);
      err.response = error.response;
      throw err;
    }
    
    // Re-lanzar el error con toda la información
    throw error;
  }
};
export const actualizarCompra = async (id, compra) => {
  try {
    const response = await api.put(`${resource}/${id}`, compra);
    
    console.log('Respuesta actualizar compra:', response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error al actualizar compra:", error);
    
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error')) {
      const err = new Error('Servicio no disponible');
      err.code = 'ECONNREFUSED';
      throw err;
    }
    
    if (error.response?.status === 500) {
      const mensaje = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Error interno del servidor';
      const err = new Error(mensaje);
      err.response = error.response;
      throw err;
    }
    
    throw error;
  }
};