import React, { useState, useEffect } from 'react';
import { clientAPI, type Cliente } from '../../services/api';
import EditClientModal from './EditClientModal'; 

interface ClientesTableProps {
  refreshTrigger?: boolean;
   onRefresh?: () => void;
}

const ClientesTable: React.FC<ClientesTableProps> = ({ refreshTrigger }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para edición/eliminación
  const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // Cargar clientes
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientAPI.getAll();
      
      if (response.success) {
        setClientes(response.data);
      } else {
        setError(response.error || 'Error al cargar clientes');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [refreshTrigger]);

  // Manejar edición
  const handleEdit = (cliente: Cliente) => {
    setClienteAEditar(cliente);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchClientes(); // Recargar lista
  };

  // Manejar eliminación
  const handleDeleteClick = (id: number) => {
    setClienteAEliminar(id);
  };

  const confirmDelete = async () => {
    if (!clienteAEliminar) return;
    
    setEliminando(true);
    
    try {
      const response = await clientAPI.delete(clienteAEliminar);
      
      if (response.success) {
        // Eliminar de la lista local
        setClientes(prev => prev.filter(c => c.id !== clienteAEliminar));
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (err) {
      alert('Error al eliminar cliente');
      console.error('Error deleting client:', err);
    } finally {
      setEliminando(false);
      setClienteAEliminar(null);
    }
  };

  const cancelDelete = () => {
    setClienteAEliminar(null);
  };

  // Traducir tipo
  const getTipoTexto = (tipo: string) => {
    const tipos: Record<string, string> = {
      'buyer': 'Comprador',
      'seller': 'Vendedor', 
      'tenant': 'Inquilino',
      'landlord': 'Propietario'
    };
    return tipos[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p className="font-medium">Error al cargar clientes</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={fetchClientes}
          className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabla de clientes */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{cliente.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{cliente.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{cliente.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        cliente.type === 'buyer' ? 'bg-blue-100 text-blue-800' :
                        cliente.type === 'seller' ? 'bg-green-100 text-green-800' :
                        cliente.type === 'tenant' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getTipoTexto(cliente.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{cliente.total_visits || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {cliente.created_at_formatted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md text-sm transition-colors"
                          title="Editar cliente"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        
                        <button
                          onClick={() => handleDeleteClick(cliente.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-sm transition-colors"
                          title="Eliminar cliente"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && clienteAEditar && (
        <EditClientModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
          cliente={clienteAEditar}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {clienteAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar este cliente? 
                Esta acción no se puede deshacer.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={eliminando}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={eliminando}
                >
                  {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesTable;