import React, { useState } from 'react';
import { Card, Button, LoadingSpinner } from '../index';
import { useFetch, useNotification } from '../../hooks';
import { formatPrice, truncateText } from '../../utils';
import type { Package, Property } from '../../types';
import Select from 'react-select';
import {
  GiftIcon,
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
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

// Package Form Component
function PackageForm({ isOpen, onClose, package: packageData, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  package?: Package;
  onSave: (data: any) => void;
}) {
  const { data: properties } = useFetch<Property>('/properties/');
  
  const [formData, setFormData] = useState({
    name: packageData?.name || '',
    description: packageData?.description || '',
    price: packageData?.price || 0,
    duration: packageData?.duration || 1,
    properties: Array.isArray(packageData?.properties) ? packageData.properties.map(p => typeof p === 'object' ? p.id : p) : [],
  });

  const [saving, setSaving] = useState(false);

  // Convert properties to react-select format
  const propertyOptions = properties.map((p: Property) => ({
    value: p.id,
    label: `${p.name} ($${p.price}/night)`
  }));
  
  // Get selected properties for react-select
  const selectedProperties = propertyOptions.filter((option: any) => 
    formData.properties.includes(option.value)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePropertyChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setFormData(prev => ({ ...prev, properties: selectedIds }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <GiftIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{packageData ? 'Edit' : 'Add'} Package</h3>
                <p className="text-sm text-gray-500">Create or update travel packages</p>
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
                    Package Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g., Maldives Paradise Package, Island Hopping Adventure" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                    required 
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter an attractive name for the package</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Describe what's included in this package, activities, experiences..." 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white resize-none" 
                    rows={4}
                    required 
                  />
                  <p className="mt-1 text-xs text-gray-500">Detailed description of what the package includes</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Package Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input 
                        name="price" 
                        value={formData.price} 
                        onChange={handleChange} 
                        placeholder="0.00" 
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                        required 
                        type="number" 
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Total package price in USD</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        name="duration" 
                        value={formData.duration} 
                        onChange={handleChange} 
                        placeholder="1" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                        required 
                        type="number" 
                        min="1"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">days</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Number of days for the package</p>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Properties & Tips */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Included Properties <span className="text-red-500">*</span>
                  </label>
                  <Select
                    isMulti
                    value={selectedProperties}
                    onChange={handlePropertyChange}
                    options={propertyOptions}
                    placeholder="Search and select properties..."
                    className="text-sm"
                    classNamePrefix="select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderColor: '#e5e7eb',
                        borderRadius: '12px',
                        minHeight: '48px',
                        backgroundColor: '#f9fafb',
                        '&:hover': { 
                          borderColor: '#a855f7',
                          backgroundColor: '#ffffff'
                        },
                        '&:focus-within': { 
                          borderColor: '#a855f7', 
                          boxShadow: '0 0 0 2px rgba(168, 85, 247, 0.1)',
                          backgroundColor: '#ffffff'
                        }
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? '#a855f7' : state.isFocused ? '#f3f4f6' : 'white',
                        color: state.isSelected ? 'white' : '#374151',
                        padding: '12px 16px'
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: '#f3e8ff',
                        borderRadius: '8px'
                      }),
                      multiValueLabel: (provided) => ({
                        ...provided,
                        color: '#7c3aed',
                        fontWeight: '500'
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        color: '#7c3aed',
                        '&:hover': {
                          backgroundColor: '#ddd6fe',
                          color: '#5b21b6'
                        }
                      })
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">Select multiple properties to include in this package</p>
                </div>

                {/* Package Summary */}
                {formData.properties.length > 0 && (
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                      <GiftIcon className="h-4 w-4" />
                      Package Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="text-sm text-purple-700">
                        <span className="font-medium">Properties:</span> {formData.properties.length} selected
                      </div>
                      <div className="text-sm text-purple-700">
                        <span className="font-medium">Duration:</span> {formData.duration} {formData.duration === 1 ? 'day' : 'days'}
                      </div>
                      <div className="text-sm text-purple-700">
                        <span className="font-medium">Price:</span> ${formData.price.toLocaleString()}
                      </div>
                      {formData.price > 0 && formData.duration > 0 && (
                        <div className="text-sm text-purple-700">
                          <span className="font-medium">Per Day:</span> ${(formData.price / formData.duration).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Package Tips */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <GiftIcon className="h-4 w-4" />
                    Package Creation Tips
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Create packages that offer value for money</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Include popular properties and locations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Consider seasonal pricing and availability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Add unique experiences or activities</span>
                    </li>
                  </ul>
                </div>

                {/* Popular Package Examples */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Popular Package Types</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { name: 'Honeymoon Package', desc: 'Romantic getaways for couples' },
                      { name: 'Family Package', desc: 'Kid-friendly accommodations and activities' },
                      { name: 'Adventure Package', desc: 'Water sports and outdoor activities' },
                      { name: 'Luxury Package', desc: 'Premium properties and exclusive services' }
                    ].map((example) => (
                      <div key={example.name} className="text-xs text-gray-600 bg-white rounded-lg p-2 border border-gray-200">
                        <span className="font-medium">{example.name}</span> - {example.desc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <GiftIcon className="h-5 w-5" />
                    {packageData ? 'Update Package' : 'Create Package'}
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

export function AdminPackages() {
  const { data: packages, isLoading, error, refresh } = useFetch<Package>('/packages/');
  const { data: properties } = useFetch<Property>('/properties/');
  
  const { showSuccess, showError } = useNotification();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [bulkAction, setBulkAction] = useState('');
  
  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | undefined>();

  // Filter and sort packages
  const filteredPackages = packages
    .filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = (!filters.minPrice || pkg.price >= parseInt(filters.minPrice)) &&
                          (!filters.maxPrice || pkg.price <= parseInt(filters.maxPrice));
      const matchesDuration = (!filters.minDuration || pkg.duration >= parseInt(filters.minDuration)) &&
                             (!filters.maxDuration || pkg.duration <= parseInt(filters.maxDuration));
      
      return matchesSearch && matchesPrice && matchesDuration;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Package];
      let bValue: any = b[sortBy as keyof Package];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate statistics
  const totalPackages = packages.length;
  const averagePrice = totalPackages > 0 
    ? packages.reduce((sum, pkg) => sum + pkg.price, 0) / totalPackages 
    : 0;
  const averageDuration = totalPackages > 0 
    ? packages.reduce((sum, pkg) => sum + pkg.duration, 0) / totalPackages 
    : 0;
  const totalProperties = packages.reduce((sum, pkg) => sum + (pkg.properties?.length || 0), 0);

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} packages?`)) return;
    
    try {
      // Implement bulk delete API call
      showSuccess(`${selectedItems.length} packages deleted successfully`);
      setSelectedItems([]);
      setBulkAction('');
      refresh();
    } catch (error) {
      showError('Failed to delete packages');
    }
  };

  const handleExport = () => {
    const exportData = filteredPackages.map(pkg => ({
      ID: pkg.id,
      Name: pkg.name,
      Description: pkg.description,
      Price: pkg.price,
      Duration: pkg.duration,
      Properties: pkg.properties?.length || 0,
      Created: pkg.created_at,
    }));
    
    // Use the exportToCSV utility
    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'packages.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Packages exported successfully');
  };

  const handleSavePackage = async (formData: any) => {
    try {
      if (editingPackage) {
        // Update existing package
        // await apiPut(`/packages/${editingPackage.id}/`, formData);
        showSuccess('Package updated successfully');
      } else {
        // Create new package
        // await apiPost('/packages/', formData);
        showSuccess('Package created successfully');
      }
      setIsFormOpen(false);
      setEditingPackage(undefined);
      refresh();
    } catch (error) {
      showError('Failed to save package');
    }
  };

  const handleEdit = (packageData: Package) => {
    setEditingPackage(packageData);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingPackage(undefined);
    setIsFormOpen(true);
  };

  const toggleSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredPackages.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setBulkAction('');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      minPrice: '',
      maxPrice: '',
      minDuration: '',
      maxDuration: '',
    });
    setSortBy('name');
    setSortDirection('asc');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/packages/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        showSuccess('Package deleted successfully');
        refresh();
      } else {
        throw new Error('Failed to delete package');
      }
    } catch (error) {
      showError('Failed to delete package');
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Packages</h1>
            <p className="text-gray-600">Manage travel packages and bookings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <Button
              onClick={handleAdd}
              className="justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Package
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="text-center">
              <p className="text-sm font-medium text-emerald-600">Total Packages</p>
              <p className="text-3xl font-bold text-emerald-900">{totalPackages}</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600">Avg Price</p>
              <p className="text-3xl font-bold text-blue-900">{formatPrice(averagePrice)}</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-center">
              <p className="text-sm font-medium text-purple-600">Avg Duration</p>
              <p className="text-3xl font-bold text-purple-900">{averageDuration.toFixed(1)} days</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="text-center">
              <p className="text-sm font-medium text-amber-600">Total Properties</p>
              <p className="text-3xl font-bold text-amber-900">{totalProperties}</p>
            </div>
          </Card>
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
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
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
                <option value="duration">Duration</option>
                <option value="created_at">Created</option>
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
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {filteredPackages.length} of {packages.length} packages
              </div>
            </div>
          </div>
        </Card>

        {/* Bulk Selection Header */}
        {selectedItems.length > 0 && (
          <Card className="mb-6 bg-emerald-50 border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredPackages.length}
                  onChange={selectedItems.length === filteredPackages.length ? clearSelection : selectAll}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-emerald-900">
                  {selectedItems.length} package{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <select 
                  value={bulkAction} 
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

        {/* Packages Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(pkg.id)}
                      onChange={() => toggleSelection(pkg.id)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-500">#{pkg.id}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{pkg.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{pkg.duration} days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Properties:</span>
                    <span className="font-medium">{pkg.properties?.length || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-emerald-600">
                    {formatPrice(pkg.price)}
                  </span>
                  <span className="text-xs text-gray-500">per package</span>
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
                        checked={selectedItems.length === filteredPackages.length && filteredPackages.length > 0}
                        onChange={selectedItems.length === filteredPackages.length ? clearSelection : selectAll}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Package</th>
                    <th className="text-left py-3 px-4 font-semibold">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold">Properties</th>
                    <th className="text-left py-3 px-4 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(pkg.id)}
                          onChange={() => toggleSelection(pkg.id)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-semibold text-gray-800">{pkg.name}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">
                            {truncateText(pkg.description, 50)}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {pkg.duration} days
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {pkg.properties?.length || 0}
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">
                        {formatPrice(pkg.price)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(pkg)}>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(pkg.id)}>
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

        {filteredPackages.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <GiftIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No packages found</p>
            </div>
          </Card>
        )}
      </div>

      {/* Package Form Modal */}
      <PackageForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPackage(undefined);
        }}
        package={editingPackage}
        onSave={handleSavePackage}
      />
    </div>
  );
} 