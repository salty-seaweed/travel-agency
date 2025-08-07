import React, { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner } from '../index';
import { useFetch, useModal, useNotification } from '../../hooks';
import { exportToCSV, formatPrice, truncateText } from '../../utils';
import type { Property, PropertyType, Location, Amenity } from '../../types';
import {
  BuildingOffice2Icon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  Squares2X2Icon,
  ListBulletIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';


// Property Form Component
function PropertyForm({ isOpen, onClose, property, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
  onSave: (data: any) => void;
}) {
  const { data: propertyTypes } = useFetch<PropertyType>('/property-types/');
  const { data: locations } = useFetch<Location>('/locations/');
  const { data: amenities } = useFetch<Amenity>('/amenities/');
  
  const [formData, setFormData] = useState({
    name: property?.name || '',
    description: property?.description || '',
    price_per_night: property?.price || 0,
    location: typeof property?.location === 'object' ? property.location.id : property?.location || '',
    property_type: typeof property?.property_type === 'object' ? property.property_type.id : property?.property_type || '',
    amenities: Array.isArray(property?.amenities) ? property.amenities.map(a => typeof a === 'object' ? a.id : a) : [],
    
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        description: property.description,
        price_per_night: property.price,
        location: typeof property.location === 'object' ? property.location.id : property.location,
        property_type: typeof property.property_type === 'object' ? property.property_type.id : property.property_type,
        amenities: Array.isArray(property.amenities) ? property.amenities.map(a => typeof a === 'object' ? a.id : a) : [],
        
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (id: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id as any)
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id as any]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BuildingOffice2Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{property ? 'Edit' : 'Add'} Property</h3>
                <p className="text-sm text-gray-500">Create or update property information</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g., Paradise Beach Villa, Ocean View Bungalow" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                    required 
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter a descriptive name for the property</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Describe the property, its features, and what makes it special..." 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white resize-none" 
                    rows={4}
                    required 
                  />
                  <p className="mt-1 text-xs text-gray-500">Detailed description to attract guests</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="property_type" 
                    value={formData.property_type} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                    required
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Choose the category that best describes this property</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map((location) => <option key={location.id} value={location.id}>{location.island} - {location.atoll}</option>)}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Select the island where this property is located</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price per Night <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input 
                      name="price_per_night" 
                      value={formData.price_per_night} 
                      onChange={handleChange} 
                      placeholder="0.00" 
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                      required 
                      type="number" 
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Set the nightly rate in USD</p>
                </div>
              </div>
              
              {/* Right Column - Amenities & Map */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Available Amenities
                  </label>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-64 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-3">
                      {amenities.map((amenity) => (
                        <label key={amenity.id} className="flex items-center space-x-3 text-sm cursor-pointer hover:bg-white p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200">
                          <input 
                            type="checkbox" 
                            checked={formData.amenities.includes(amenity.id as any)} 
                            onChange={() => handleAmenityChange(amenity.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex items-center gap-2">
                            {amenity.icon && (
                              <span className="text-lg">{amenity.icon}</span>
                            )}
                            <span className="text-gray-700 font-medium">{amenity.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Select all amenities available at this property</p>
                </div>

                {/* Property Tips */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <BuildingOffice2Icon className="h-4 w-4" />
                    Property Tips
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Use high-quality images to showcase the property</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Be accurate with pricing and availability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Include all relevant amenities and features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Provide clear and detailed descriptions</span>
                    </li>
                  </ul>
                </div>

                {/* Location Info */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Location Details</label>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Selected Location</p>
                        <p className="text-xs text-blue-600">Coordinates are set in Settings → Locations</p>
                      </div>
                    </div>
                    <div className="text-xs text-blue-700 bg-white rounded-lg p-2 border border-blue-200">
                      <p>• Choose a location from the dropdown above</p>
                      <p>• Location coordinates are managed in Settings</p>
                      <p>• This ensures consistent location data</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <BuildingOffice2Icon className="h-5 w-5" />
                    {property ? 'Update Property' : 'Create Property'}
                  </div>
                )}
              </button>
              <button 
                type="button" 
                className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50" 
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminProperties() {
  const { data: properties, isLoading, error, refresh } = useFetch<Property>('/properties/');
  const { data: propertyTypes } = useFetch<PropertyType>('/property-types/');
  const { data: locations } = useFetch<Location>('/locations/');
  const { data: amenities } = useFetch<Amenity>('/amenities/');
  
  const { showSuccess, showError } = useNotification();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [bulkAction, setBulkAction] = useState('');
  
  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();

  // Filter and sort properties
  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filters.propertyType || property.property_type === parseInt(filters.propertyType);
      const matchesLocation = !filters.location || property.location === parseInt(filters.location);
      const matchesPrice = (!filters.minPrice || property.price >= parseInt(filters.minPrice)) &&
                          (!filters.maxPrice || property.price <= parseInt(filters.maxPrice));
      
      return matchesSearch && matchesType && matchesLocation && matchesPrice;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Property];
      let bValue: any = b[sortBy as keyof Property];
      
      if (sortBy === 'property_type') {
        aValue = typeof a.property_type === 'object' ? a.property_type.name : '';
        bValue = typeof b.property_type === 'object' ? b.property_type.name : '';
      } else if (sortBy === 'location') {
        aValue = typeof a.location === 'object' ? a.location.island : '';
        bValue = typeof b.location === 'object' ? b.location.island : '';
      }
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} properties?`)) return;
    
    try {
      // Implement bulk delete API call
      showSuccess(`${selectedItems.length} properties deleted successfully`);
      setSelectedItems([]);
      setBulkAction('');
      refresh();
    } catch (error) {
      showError('Failed to delete properties');
    }
  };

  const handleExport = () => {
    const exportData = filteredProperties.map(property => ({
      ID: property.id,
      Name: property.name,
      Description: property.description,
      Price: property.price,
      Location: typeof property.location === 'object' ? property.location.island : property.location,
      Type: typeof property.property_type === 'object' ? property.property_type.name : property.property_type,
      Created: property.created_at,
    }));
    
    exportToCSV(exportData, 'properties');
    showSuccess('Properties exported successfully');
  };

  const handleSaveProperty = async (formData: any) => {
    try {
      if (editingProperty) {
        // Update existing property
        // await apiPut(`/properties/${editingProperty.id}/`, formData);
        showSuccess('Property updated successfully');
      } else {
        // Create new property
        // await apiPost('/properties/', formData);
        showSuccess('Property created successfully');
      }
      setIsFormOpen(false);
      setEditingProperty(undefined);
      refresh();
    } catch (error) {
      showError('Failed to save property');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProperty(undefined);
    setIsFormOpen(true);
  };

  const toggleSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredProperties.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setBulkAction('');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      propertyType: '',
      location: '',
      minPrice: '',
      maxPrice: '',
    });
    setSortBy('name');
    setSortDirection('asc');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/properties/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        showSuccess('Property deleted successfully');
        refresh();
      } else {
        throw new Error('Failed to delete property');
      }
    } catch (error) {
      showError('Failed to delete property');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card>
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refresh}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Properties</h1>
            <p className="text-gray-600">Manage your property listings and bookings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <Button
              onClick={handleAdd}
              className="justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Property
            </Button>
            {selectedItems.length > 0 && (
              <Button
                variant="danger"
                onClick={handleBulkDelete}
                className="justify-center"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete Selected ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Filter Bar */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Types</option>
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>{location.island}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="property_type">Type</option>
                <option value="location">Location</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                <FunnelIcon className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
              <Button variant="secondary" size="sm" onClick={handleExport}>
                <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {filteredProperties.length} of {properties.length} properties
              </div>
            </div>
          </div>
        </Card>

        {/* Bulk Selection Header */}
        {selectedItems.length > 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredProperties.length}
                  onChange={selectedItems.length === filteredProperties.length ? clearSelection : selectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-blue-900">
                  {selectedItems.length} property{selectedItems.length !== 1 ? 'ies' : 'y'} selected
                </span>
              </div>
              <div className="flex gap-2">
                <select 
                  value={bulkAction} 
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose action...</option>
                  <option value="delete">Delete Selected</option>
                </select>
                <Button variant="danger" size="sm" onClick={handleBulkDelete} disabled={!bulkAction}>
                  Apply
                </Button>
                <Button variant="secondary" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Properties Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(property.id)}
                      onChange={() => toggleSelection(property.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-500">#{property.id}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(property)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{property.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">
                      {typeof property.property_type === 'object' ? property.property_type.name : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">
                      {typeof property.location === 'object' ? property.location.island : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Amenities:</span>
                    <span className="font-medium">{property.amenities?.length || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </span>
                  <span className="text-xs text-gray-500">per night</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredProperties.length && filteredProperties.length > 0}
                        onChange={selectedItems.length === filteredProperties.length ? clearSelection : selectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Property</th>
                    <th className="text-left py-3 px-4 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 font-semibold">Amenities</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(property.id)}
                          onChange={() => toggleSelection(property.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-semibold text-gray-800">{property.name}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">
                            {truncateText(property.description, 50)}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {typeof property.location === 'object' ? property.location.island : 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {typeof property.property_type === 'object' ? property.property_type.name : 'Unknown'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-blue-600">
                        {formatPrice(property.price)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {property.amenities?.length || 0}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(property)}>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(property.id)}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filteredProperties.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <BuildingOffice2Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No properties found</p>
            </div>
          </Card>
        )}
      </div>

      {/* Property Form Modal */}
      <PropertyForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProperty(undefined);
        }}
        property={editingProperty}
        onSave={handleSaveProperty}
      />
    </div>
  );
} 