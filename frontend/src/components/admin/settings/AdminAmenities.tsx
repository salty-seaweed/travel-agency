import React, { useState } from 'react';
import { Card, Button, LoadingSpinner } from '../../index';
import { useNotification } from '../../../hooks';
import { useAmenities } from '../../../hooks/useQueries';
import { unifiedApi } from '../../../services/unified-api';
import type { Amenity } from '../../../types';
import {
  SparklesIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export function AdminAmenities() {
  const { data: amenities, isLoading, error, refetch } = useAmenities();
  const { showSuccess, showError } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | undefined>();
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Debug logging
  console.log('Amenities data:', amenities);
  console.log('Search term:', searchTerm);

  const filteredAmenities = amenities?.filter((item: any) => {
    const nameMatch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || descriptionMatch;
  }) || [];

  console.log('Filtered amenities:', filteredAmenities);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this amenity?')) return;
    
    try {
      const response = await fetch(`/api/amenities/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        showSuccess('Amenity deleted successfully');
        // Invalidate cache and refetch
        unifiedApi.utils.invalidateCache('amenities');
        refetch();
      } else {
        throw new Error('Failed to delete amenity');
      }
    } catch (error) {
      showError('Failed to delete amenity');
    }
  };

  const handleEdit = (amenity: any) => {
    setEditingAmenity(amenity);
    setFormData({ name: amenity.name, description: amenity.description || '' });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting form data:', formData);
    console.log('Editing amenity:', editingAmenity);
    
    try {
      const url = editingAmenity 
        ? `/api/amenities/${editingAmenity.id}/`
        : '/api/amenities/';
      
      const method = editingAmenity ? 'PUT' : 'POST';
      
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
        showSuccess(`Amenity ${editingAmenity ? 'updated' : 'created'} successfully`);
        setIsFormOpen(false);
        setEditingAmenity(undefined);
        setFormData({ name: '', description: '' });
        // Invalidate cache and refetch
        unifiedApi.utils.invalidateCache('amenities');
        refetch();
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Failed to save amenity: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Failed to ${editingAmenity ? 'update' : 'create'} amenity: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading amenities: {error?.message || 'Unknown error'}</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <SparklesIcon className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
            <p className="text-sm text-gray-600">Manage property amenities and features</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => {
              console.log('Test search with "wifi"');
              setSearchTerm('wifi');
            }}
          >
            Test Search
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Amenity
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredAmenities.length} of {amenities?.length || 0} amenities
          </div>
        )}
      </div>

      {/* Amenities List */}
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
              {filteredAmenities.map((amenity: any) => (
                <tr key={amenity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-800">{amenity.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600">{amenity.description || 'No description'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(amenity)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(amenity.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAmenities.length === 0 && (
            <div className="text-center py-8">
              <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No amenities found</p>
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
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {editingAmenity ? 'Update amenity details' : 'Create a new property amenity'}
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
                    Amenity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="e.g., WiFi, Swimming Pool, Air Conditioning"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a descriptive name for the amenity</p>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                    rows={4}
                    placeholder="Describe what this amenity offers to guests..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional description to help guests understand the amenity</p>
                </div>

                {/* Preview Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                  <div className="bg-white rounded border p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                        <SparklesIcon className="h-3 w-3 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-800">
                        {formData.name || 'Amenity Name'}
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {editingAmenity ? (
                    <>
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Update Amenity
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Amenity
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

export default AdminAmenities; 