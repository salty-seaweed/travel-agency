import React, { useState } from 'react';
import { Card, Button, LoadingSpinner } from '../../index';
import { useNotification } from '../../../hooks';
import { usePropertyTypes } from '../../../hooks/useQueries';
import { unifiedApi } from '../../../services/unified-api';
import type { PropertyType } from '../../../types';
import {
  HomeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export function AdminPropertyTypes() {
  const { data: propertyTypes, isLoading, error, refetch } = usePropertyTypes();
  const { showSuccess, showError } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPropertyType, setEditingPropertyType] = useState<PropertyType | undefined>();
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Debug logging
  console.log('Property types data:', propertyTypes);
  console.log('Search term:', searchTerm);

  const filteredPropertyTypes = propertyTypes?.filter((item: any) => {
    const nameMatch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || descriptionMatch;
  }) || [];

  console.log('Filtered property types:', filteredPropertyTypes);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property type?')) return;
    
    try {
      const response = await fetch(`/api/property-types/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        showSuccess('Property type deleted successfully');
        // Invalidate cache and refetch
        unifiedApi.utils.invalidateCache('property-types');
        refetch();
      } else {
        throw new Error('Failed to delete property type');
      }
    } catch (error) {
      showError('Failed to delete property type');
    }
  };

  const handleEdit = (propertyType: any) => {
    setEditingPropertyType(propertyType);
    setFormData({ name: propertyType.name, description: propertyType.description || '' });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting property type form data:', formData);
    console.log('Editing property type:', editingPropertyType);
    
    try {
      const url = editingPropertyType 
        ? `/api/property-types/${editingPropertyType.id}/`
        : '/api/property-types/';
      
      const method = editingPropertyType ? 'PUT' : 'POST';
      
      console.log('Making request to:', url, 'with method:', method);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        showSuccess(`Property type ${editingPropertyType ? 'updated' : 'created'} successfully`);
        setIsFormOpen(false);
        setEditingPropertyType(undefined);
        setFormData({ name: '', description: '' });
        // Invalidate cache and refetch
        unifiedApi.utils.invalidateCache('property-types');
        refetch();
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Failed to save property type: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Failed to ${editingPropertyType ? 'update' : 'create'} property type: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading property types: {error?.message || 'Unknown error'}</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <HomeIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Property Types</h2>
            <p className="text-sm text-gray-600">Manage accommodation categories</p>
          </div>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Property Type
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search property types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredPropertyTypes.length} of {propertyTypes?.length || 0} property types
          </div>
        )}
      </div>

      {/* Property Types List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPropertyTypes.map((propertyType: any) => (
                <tr key={propertyType.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-800">{propertyType.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600">{propertyType.description || 'No description'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(propertyType)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(propertyType.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPropertyTypes.length === 0 && (
            <div className="text-center py-8">
              <HomeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No property types found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HomeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingPropertyType ? 'Edit Property Type' : 'Add New Property Type'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {editingPropertyType ? 'Update property type details' : 'Create a new accommodation category'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Guesthouse, Hotel, Resort, Villa"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the name of the accommodation type</p>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    rows={4}
                    placeholder="Describe what this property type offers to guests..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional description to help guests understand the property type</p>
                </div>

                {/* Preview Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                  <div className="bg-white rounded border p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <HomeIcon className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-800">
                        {formData.name || 'Property Type Name'}
                      </span>
                    </div>
                    {formData.description && (
                      <p className="text-sm text-gray-600 mt-1 ml-8">
                        {formData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {editingPropertyType ? (
                    <>
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Update Property Type
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Property Type
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPropertyTypes; 