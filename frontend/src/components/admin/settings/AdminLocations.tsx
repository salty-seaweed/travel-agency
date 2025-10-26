import React, { useState } from 'react';
import { Card, Button, LoadingSpinner } from '../../index';
import { useNotification } from '../../../hooks';
import { useLocations } from '../../../hooks/useQueries';
import { unifiedApi } from '../../../services/unified-api';
import { LocationMapPicker } from '../../LocationMapPicker';
import type { Location } from '../../../types';
import {
  MapPinIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export function AdminLocations() {
  const { data: locations, isLoading, error, refetch } = useLocations();
  const { showSuccess, showError } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>();
  const [formData, setFormData] = useState({ 
    island: '', 
    atoll: '', 
    description: '',
    latitude: 3.2028,
    longitude: 73.2207
  });

  // Debug logging
  console.log('Locations data:', locations);
  console.log('Search term:', searchTerm);

  const filteredLocations = locations?.filter((item: any) => {
    const islandMatch = item.island?.toLowerCase().includes(searchTerm.toLowerCase());
    const atollMatch = item.atoll?.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return islandMatch || atollMatch || descriptionMatch;
  }) || [];

  console.log('Filtered locations:', filteredLocations);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    try {
      const response = await fetch(`/api/locations/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        showSuccess('Location deleted successfully');
        // Invalidate cache and refetch
        unifiedApi.utils.invalidateCache('locations');
        refetch();
      } else {
        throw new Error('Failed to delete location');
      }
    } catch (error) {
      showError('Failed to delete location');
    }
  };

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setFormData({ 
      island: location.island, 
      atoll: location.atoll, 
      description: location.description || '',
      latitude: location.latitude || 3.2028,
      longitude: location.longitude || 73.2207
    });
    setIsFormOpen(true);
  };

  const handleMapLocationSelect = (locationData: { island: string; atoll: string; fullName: string }) => {
    setFormData(prev => ({
      ...prev,
      island: locationData.island,
      atoll: locationData.atoll
    }));
  };

  const handleMapCoordinatesChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting location form data:', formData);
    console.log('Editing location:', editingLocation);
    
    try {
      const url = editingLocation 
        ? `/api/locations/${editingLocation.id}/`
        : '/api/locations/';
      
      const method = editingLocation ? 'PUT' : 'POST';
      
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
        showSuccess(`Location ${editingLocation ? 'updated' : 'created'} successfully`);
        setIsFormOpen(false);
        setEditingLocation(undefined);
        setFormData({ island: '', atoll: '', description: '', latitude: 3.2028, longitude: 73.2207 });
        // Invalidate cache and refetch
        unifiedApi.utils.invalidateCache('locations');
        refetch();
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Failed to save location: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Failed to ${editingLocation ? 'update' : 'create'} location: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading locations: {error?.message || 'Unknown error'}</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <MapPinIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
            <p className="text-sm text-gray-600">Manage Maldives destinations</p>
          </div>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredLocations.length} of {locations?.length || 0} locations
          </div>
        )}
      </div>

      {/* Locations List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Island</th>
                <th className="text-left py-3 px-4 font-semibold">Atoll</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
                <th className="text-left py-3 px-4 font-semibold">Coordinates</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((location: any) => (
                <tr key={location.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-800">{location.island}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600">{location.atoll}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600">{location.description || 'No description'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs text-gray-500 font-mono">
                      {location.latitude ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Not set'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(location)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(location.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLocations.length === 0 && (
            <div className="text-center py-8">
              <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No locations found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingLocation ? 'Edit Location' : 'Add New Location'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {editingLocation ? 'Update location details' : 'Create a new Maldives destination'}
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* Island Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Island Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.island}
                      onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="e.g., Maafushi, Hulhumale, Male"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the name of the island</p>
                  </div>

                  {/* Atoll Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atoll <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.atoll}
                      onChange={(e) => setFormData({ ...formData, atoll: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="e.g., North Male Atoll, South Male Atoll"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the atoll where the island is located</p>
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
                      rows={4}
                      placeholder="Describe what makes this location special for tourists..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional description to help guests understand the location</p>
                  </div>

                  {/* Preview Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                    <div className="bg-white rounded border p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-100 rounded flex items-center justify-center">
                          <MapPinIcon className="h-3 w-3 text-emerald-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">
                            {formData.island || 'Island Name'}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {formData.atoll || 'Atoll'}
                          </span>
                        </div>
                      </div>
                      {formData.description && (
                        <p className="text-sm text-gray-600 mt-1 ml-8">
                          {formData.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Map Picker */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Picker <span className="text-red-500">*</span>
                    </label>
                    <LocationMapPicker
                      lat={formData.latitude}
                      lng={formData.longitude}
                      onChange={handleMapCoordinatesChange}
                      onLocationSelect={handleMapLocationSelect}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                <Button 
                  type="submit" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {editingLocation ? (
                    <>
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Update Location
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Location
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

export default AdminLocations; 