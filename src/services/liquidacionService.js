import api from './api';

const resource = '/liquidaciones';

// ========== CRUD BÁSICO ==========

/**
 * Listar liquidaciones con paginación y filtros
 * @param {Object} params - { page, size, coLiquidacion, dniCliente, nombreCliente, tipoInstalacion, estadoRevision, tipoPropiedad, fechaDesde, fechaHasta }
 * @returns {Object} { content, total }
 */
export const listarLiquidacionesService = async ({
    page = 0,
    size = 20,
    coLiquidacion = "",
    dniCliente = "",
    nombreCliente = "",
    tipoInstalacion = "",
    estadoRevision = "",
    tipoPropiedad = "",
    fechaDesde = "",
    fechaHasta = ""
}) => {
    try {
        const response = await api.get(resource, {
            params: {
                page,
                size,
                coLiquidacion,
                dniCliente,
                nombreCliente,
                tipoInstalacion,
                estadoRevision,
                tipoPropiedad,
                fechaDesde,
                fechaHasta
            }
        });
        
        console.log('Respuesta listar liquidaciones:', response.data);
        
        // Adaptar a estructura esperada por Vue
        return {
            content: response.data.content || [],
            total: response.data.total || 0,
            page: response.data.page || page,
            size: response.data.size || size,
            totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / size)
        };
    } catch (error) {
        console.error("Error al listar liquidaciones:", error);
        
        // Manejo de errores de red
        if (error.code === 'ECONNREFUSED' || 
            error.code === 'ERR_NETWORK' ||
            error.message?.includes('Network Error')) {
            const err = new Error('Servicio no disponible. Verifique la conexión.');
            err.code = 'ECONNREFUSED';
            throw err;
        }
        
        return { content: [], total: 0, page: page, size: size, totalPages: 0 };
    }
};

/**
 * Obtener una liquidación por ID
 */
export const obtenerLiquidacionPorIdService = async (id) => {
    try {
        const response = await api.get(`${resource}/${id}`);
        
        console.log('Respuesta obtener liquidación por ID:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al obtener liquidación por ID:", error);
        
        if (error.code === 'ECONNREFUSED' || 
            error.code === 'ERR_NETWORK' ||
            error.message?.includes('Network Error')) {
            const err = new Error('Servicio no disponible');
            err.code = 'ECONNREFUSED';
            throw err;
        }
        
        if (error.response?.status === 404) {
            const err = new Error('Liquidación no encontrada');
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
        
        throw error;
    }
};

/**
 * Crear una nueva liquidación
 */
export const crearLiquidacionService = async (liquidacion) => {
    try {
        const response = await api.post(resource, liquidacion);
        
        console.log('Respuesta crear liquidación:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al crear liquidación:", error);
        
        if (error.code === 'ECONNREFUSED' || 
            error.code === 'ERR_NETWORK' ||
            error.message?.includes('Network Error')) {
            const err = new Error('Servicio no disponible');
            err.code = 'ECONNREFUSED';
            throw err;
        }
        
        if (error.response?.status === 400) {
            const mensaje = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Datos de liquidación inválidos';
            const err = new Error(mensaje);
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
        
        throw error;
    }
};

/**
 * Actualizar una liquidación existente
 */
export const actualizarLiquidacionService = async (id, liquidacion) => {
    try {
        const response = await api.put(`${resource}/${id}`, liquidacion);
        
        console.log('Respuesta actualizar liquidación:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al actualizar liquidación:", error);
        
        if (error.code === 'ECONNREFUSED' || 
            error.code === 'ERR_NETWORK' ||
            error.message?.includes('Network Error')) {
            const err = new Error('Servicio no disponible');
            err.code = 'ECONNREFUSED';
            throw err;
        }
        
        if (error.response?.status === 404) {
            const err = new Error('Liquidación no encontrada');
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
        
        throw error;
    }
};

/**
 * Eliminar una liquidación
 */
export const eliminarLiquidacionService = async (id) => {
    try {
        const response = await api.delete(`${resource}/${id}`);
        
        console.log('Respuesta eliminar liquidación:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al eliminar liquidación:", error);
        
        if (error.code === 'ECONNREFUSED' || 
            error.code === 'ERR_NETWORK' ||
            error.message?.includes('Network Error')) {
            const err = new Error('Servicio no disponible');
            err.code = 'ECONNREFUSED';
            throw err;
        }
        
        if (error.response?.status === 404) {
            const err = new Error('Liquidación no encontrada');
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
        
        throw error;
    }
};

// ========== OPERACIONES ESPECIALES ==========

/**
 * Actualizar estado de revisión de una liquidación
 */
export const actualizarEstadoRevisionService = async (id, estadoRevision, usuario, comentario = "") => {
    try {
        const response = await api.put(`${resource}/${id}/estado-revision`, {
            estadoRevision,
            usuario,
            comentario
        });
        
        console.log('Respuesta actualizar estado revisión:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado de revisión:", error);
        
        if (error.code === 'ECONNREFUSED' || 
            error.code === 'ERR_NETWORK' ||
            error.message?.includes('Network Error')) {
            const err = new Error('Servicio no disponible');
            err.code = 'ECONNREFUSED';
            throw err;
        }
        
        if (error.response?.status === 404) {
            const err = new Error('Liquidación no encontrada');
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
        
        throw error;
    }
};

/**
 * Importar liquidaciones desde archivo Excel
 */
export const importarExcelLiquidacionesService = async (file, usuario) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('usuario', usuario);
        
        const response = await api.post(`${resource}/importar-excel`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('Respuesta importar Excel:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al importar Excel:", error);
        
        if (error.code === 'ECONNREFUSED' || 
            error.code === 'ERR_NETWORK' ||
            error.message?.includes('Network Error')) {
            const err = new Error('Servicio no disponible');
            err.code = 'ECONNREFUSED';
            throw err;
        }
        
        if (error.response?.status === 400) {
            const mensaje = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Formato de archivo inválido';
            const err = new Error(mensaje);
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
        
        throw error;
    }
};

/**
 * Exportar liquidaciones a Excel
 */
export const exportarExcelLiquidacionesService = async (params = {}) => {
    try {
        // Abrir en nueva ventana para descarga
        const queryParams = new URLSearchParams(params).toString();
        const url = `${api.defaults.baseURL}${resource}/exportar-excel?${queryParams}`;
        window.open(url, '_blank');
        
        return { success: true, message: 'Exportación iniciada' };
    } catch (error) {
        console.error("Error al exportar Excel:", error);
        throw new Error('Error al iniciar la exportación');
    }
};

// ========== CONFIGURACIONES Y FILTROS ==========

/**
 * Obtener tipos de instalación para filtros
 */
export const obtenerTiposInstalacionService = async () => {
    try {
        const response = await api.get(`${resource}/tipos-instalacion`);
        
        console.log('Respuesta tipos instalación:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al obtener tipos de instalación:", error);
        
        // Retornar valores por defecto en caso de error
        return [
            { codigo: 'INSTALACION_NUEVA', nombre: 'Instalación Nueva' },
            { codigo: 'MIGRACION', nombre: 'Migración' },
            { codigo: 'REINSTALACION', nombre: 'Reinstalación' },
            { codigo: 'CAMBIO_EQUIPO', nombre: 'Cambio de Equipo' },
            { codigo: 'SOPORTE_TECNICO', nombre: 'Soporte Técnico' }
        ];
    }
};

/**
 * Obtener estados de revisión para filtros
 */
export const obtenerEstadosRevisionService = async () => {
    try {
        const response = await api.get(`${resource}/estados-revision`);
        
        console.log('Respuesta estados revisión:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al obtener estados de revisión:", error);
        
        // Retornar valores por defecto en caso de error
        return [
            { codigo: 'PENDIENTE', nombre: 'Pendiente' },
            { codigo: 'REVISADO', nombre: 'Revisado' },
            { codigo: 'APROBADO', nombre: 'Aprobado' },
            { codigo: 'RECHAZADO', nombre: 'Rechazado' },
            { codigo: 'LIQUIDADO', nombre: 'Liquidado' }
        ];
    }
};

/**
 * Obtener tipos de propiedad para filtros
 */
export const obtenerTiposPropiedadService = async () => {
    try {
        const response = await api.get(`${resource}/tipos-propiedad`);
        
        console.log('Respuesta tipos propiedad:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al obtener tipos de propiedad:", error);
        
        // Retornar valores por defecto en caso de error
        return [
            { codigo: 'CONDOMINIO', nombre: 'Condominio' },
            { codigo: 'RESIDENCIAL', nombre: 'Residencial' }
        ];
    }
};

// ========== BÚSQUEDA Y REPORTES ==========

/**
 * Buscar liquidaciones por término (para autocomplete)
 */
export const buscarLiquidacionesService = async (termino, limit = 10) => {
    try {
        const response = await api.get(`${resource}/buscar`, {
            params: { termino, limit }
        });
        
        console.log('Respuesta buscar liquidaciones:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al buscar liquidaciones:", error);
        return [];
    }
};

/**
 * Obtener estadísticas de liquidaciones
 */
export const obtenerEstadisticasLiquidacionesService = async (params = {}) => {
    try {
        const response = await api.get(`${resource}/estadisticas`, { params });
        
        console.log('Respuesta estadísticas liquidaciones:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        
        // Retornar valores por defecto en caso de error
        return {
            total: 0,
            pendientes: 0,
            revisados: 0,
            aprobados: 0,
            rechazados: 0,
            liquidados: 0
        };
    }
};

// ========== MÉTODOS DE UTILIDAD ==========

/**
 * Formatear fecha para display
 */
export const formatearFecha = (fecha) => {
    if (!fecha) return '';
    
    try {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return '';
    }
};

/**
 * Formatear fecha y hora para display
 */
export const formatearFechaLarga = (fecha) => {
    if (!fecha) return '';
    
    try {
        const date = new Date(fecha);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error al formatear fecha larga:', error);
        return '';
    }
};

/**
 * Obtener color según tipo de instalación
 */
export const getColorTipoInstalacion = (codigo) => {
    const colores = {
        'INSTALACION_NUEVA': 'success',
        'MIGRACION': 'info',
        'REINSTALACION': 'warning',
        'CAMBIO_EQUIPO': 'primary',
        'SOPORTE_TECNICO': 'grey'
    };
    return colores[codigo] || 'grey';
};

/**
 * Obtener color según estado de revisión
 */
export const getColorEstadoRevision = (codigo) => {
    const colores = {
        'PENDIENTE': 'info',
        'FINALIZADO': 'primary',
        'LIQUIDADO': 'success',
        'DEVUELTO': 'error'
    };
    return colores[codigo] || 'grey';
};

/**
 * Validar datos de liquidación antes de enviar
 */
export const validarLiquidacion = (liquidacionData) => {
    const errores = [];
    
    if (!liquidacionData.coLiquidacion || liquidacionData.coLiquidacion.trim() === '') {
        errores.push('El código de liquidación es requerido');
    }
    
    if (!liquidacionData.dniCliente || liquidacionData.dniCliente.trim() === '') {
        errores.push('El DNI del cliente es requerido');
    }
    
    if (!liquidacionData.nombreCliente || liquidacionData.nombreCliente.trim() === '') {
        errores.push('El nombre del cliente es requerido');
    }
    
    if (!liquidacionData.direccion || liquidacionData.direccion.trim() === '') {
        errores.push('La dirección es requerida');
    }
    
    if (!liquidacionData.tipoInstalacion) {
        errores.push('El tipo de instalación es requerido');
    }
    
    return {
        valido: errores.length === 0,
        errores
    };
};

/**
 * Generar nombre de archivo para exportación
 */
export const generarNombreArchivoExportacion = () => {
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hora = new Date().toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '');
    return `Liquidaciones_${fecha}_${hora}`;
};