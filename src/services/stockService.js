import api from './api'

const resource = '/stock'
const resourceDespacho = 'http://localhost:8201/api/despacho'

export const listarStockGeneral = async ({
  contratista = '',
  condicion = '',
  zonal = '',
  sap = '',
  articulo = '',
  page = 0,
  size = 20
}) => {
  try {
    console.log('Parámetros para listarStockGeneral:', {
      contratista,
      condicion,
        zonal,
        sap,
        articulo,
        page,
        size
    });
    const response = await api.get(`${resource}/general`, {
      params: {
        contratista,
        condicion,
        zonal,
        sap,
        articulo,
        page,
        size
      }
    })

    console.log('Respuesta stock general:', response.data)

    return {
      content: response.data.content || [],
      total: response.data.totalElements || 0,
      totalPages: response.data.totalPages || 0,
      currentPage: response.data.currentPage || 0
    }
  } catch (error) {
    console.error('Error al listar stock general:', error)
    throw error
  }
}
export const listarStockSeries = async ({
  contratista = '',
  condicion = '',
  zonal = '',
  sap = '',
  articulo = '',
  serie = '',
  page = 0,
  size = 20
}) => {
  try {
    const response = await api.get('/stock/series', {
      params: {
        contratista,
        condicion,
        zonal,
        sap,
        articulo,
        serie,
        page,
        size
      }
    })

    return {
      content: response.data.content || [],
      total: response.data.totalElements || 0,
      totalPages: response.data.totalPages || 0,
      currentPage: response.data.currentPage || 0
    }
  } catch (error) {
    console.error('Error al listar stock series:', error)
    throw error
  }
}
export async function listarStockAtendidos(params) {
  try {
    const response = await api.get('/stock/atendidos', { params })
    return {
      content: response.data.content || [],
      total: response.data.totalElements || 0
    }
  } catch (error) {
    console.error('Error al listar stock atendidos:', error)
    throw error
  }
}
export async function listarStockDevueltos(params) {
  try {
    const response = await api.get('/stock/devueltos', { params })
    return {
      content: response.data.content || [],
      total: response.data.totalElements || 0
    }
  } catch (error) {
    console.error('Error al listar stock devueltos:', error)
    throw error
  }
}
export const listarContratistas = async () => {
  try {
    const response = await api.get(`${resource}/contratistas`)
    return response.data || []
  } catch (error) {
    console.error('Error al listar contratistas:', error)
    return []
  }
}

export const listarZonales = async () => {
  try {
    const response = await api.get(`${resource}/zonales`)
    return response.data || []
  } catch (error) {
    console.error('Error al listar zonales:', error)
    return []
  }
}

export function abrirPDFEnNuevaPestaña(movimientoId) {
  const response = `${resourceDespacho}/pdf/${movimientoId}`
  console.log('URL del PDF generado:', response)
  window.open(response, '_blank')
}

export async function generarPDFDespacho(movimientoId) {
  try {
    const response = await api.get(`${resourceDespacho}/pdf/${movimientoId}`, {
      responseType: 'blob', // Importante: recibir como blob
      headers: {
        'Accept': 'application/pdf'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error al generar PDF:', error)
    throw new Error('No se pudo generar el PDF')
  }
}