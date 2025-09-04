import React, { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner } from '../../index';
import { useNotification } from '../../../hooks';

import {
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface MediaAsset {
  id: number;
  file: string;
  file_url: string;
  thumbnail_url?: string;
  alt_text: string;
  caption?: string;
  mime_type: string;
  file_size: number;
  usage_count: number;
  usage_locations?: string[];
  created_at: string;
  created_by?: number;
  width?: number;
  height?: number;
  tags?: string;
}

interface MediaLibraryProps {
  onSelect?: (asset: MediaAsset) => void;
  multiSelect?: boolean;
  selectedAssets?: MediaAsset[];
  onSelectionChange?: (assets: MediaAsset[]) => void;
  usageContext?: 'page-hero' | 'package-image' | 'destination-image' | 'experience-image' | 'general';
  showUsageInfo?: boolean;
  allowUpload?: boolean;
}

export function MediaLibrary({
  onSelect,
  multiSelect = false,
  selectedAssets = [],
  onSelectionChange,
  usageContext = 'general',
  showUsageInfo = true,
  allowUpload = true
}: MediaLibraryProps) {
  const { showSuccess, showError } = useNotification();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editForm, setEditForm] = useState({
    alt_text: '',
    caption: ''
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/media/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAssets(data.results || data.data || data);
      } else {
        showError('Failed to load media assets');
      }
    } catch (error) {
      showError('Failed to load media assets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add alt text if available
      const altText = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      formData.append('alt_text', altText);

      try {
        const response = await fetch('/api/media/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
          },
          body: formData,
        });
        if (response.ok) {
          const asset = await response.json();
          showSuccess(`Uploaded ${file.name} successfully`);
          return asset;
        } else {
          showError(`Failed to upload ${file.name}`);
          return null;
        }
      } catch (error) {
        showError(`Failed to upload ${file.name}`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(result => result !== null);
    
    if (successfulUploads.length > 0) {
      setAssets(prev => [...successfulUploads, ...prev]);
    }
    
    setIsUploading(false);
    event.target.value = ''; // Reset input
  };

  const handleDelete = async (assetId: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const response = await fetch(`/api/media/${assetId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });
      if (response.ok) {
        setAssets(prev => prev.filter(asset => asset.id !== assetId));
        showSuccess('Asset deleted successfully');
      } else {
        showError('Failed to delete asset');
      }
    } catch (error) {
      showError('Failed to delete asset');
    }
  };

  const handleEdit = async () => {
    if (!editingAsset) return;

    try {
      const response = await fetch(`/api/media/${editingAsset.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({
          alt_text: editForm.alt_text,
          caption: editForm.caption
        }),
      });

      if (response.ok) {
        const updatedAsset = await response.json();
        setAssets(prev => prev.map(asset => 
          asset.id === editingAsset.id ? updatedAsset : asset
        ));
        showSuccess('Asset updated successfully');
        setEditingAsset(null);
        setEditForm({ alt_text: '', caption: '' });
      } else {
        showError('Failed to update asset');
      }
    } catch (error) {
      showError('Failed to update asset');
    }
  };

  const handleAssetSelect = (asset: MediaAsset) => {
    if (multiSelect) {
      const isSelected = selectedAssets.some(selected => selected.id === asset.id);
      let newSelection: MediaAsset[];
      
      if (isSelected) {
        newSelection = selectedAssets.filter(selected => selected.id !== asset.id);
      } else {
        newSelection = [...selectedAssets, asset];
      }
      
      onSelectionChange?.(newSelection);
    } else {
      onSelect?.(asset);
    }
  };

  const isAssetSelected = (asset: MediaAsset) => {
    return selectedAssets.some(selected => selected.id === asset.id);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return PhotoIcon;
    if (mimeType.startsWith('video/')) return VideoCameraIcon;
    return DocumentIcon;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAssets = assets.filter(asset => {
    if (!asset) return false;
    
    const matchesSearch = asset.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.caption?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'images' && asset.mime_type.startsWith('image/')) ||
                         (filterType === 'videos' && asset.mime_type.startsWith('video/')) ||
                         (filterType === 'documents' && !asset.mime_type.startsWith('image/') && !asset.mime_type.startsWith('video/'));
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Media Library
            {usageContext !== 'general' && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({usageContext.replace('-', ' ')})
              </span>
            )}
          </h2>
          <p className="text-gray-600">
            {usageContext === 'general'
              ? 'Manage your media assets'
              : `Select images for ${usageContext.replace('-', ' ')}`
            }
          </p>
        </div>

        {allowUpload && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              disabled={isUploading}
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
              Upload Files
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="images">Images</option>
          <option value="videos">Videos</option>
          <option value="documents">Documents</option>
        </select>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">Uploading files...</span>
          </div>
        </div>
      )}

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <Card className="p-8 text-center">
          <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Upload your first media asset to get started'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
              Upload Files
            </button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => {
            const FileIcon = getFileIcon(asset.mime_type);
            const isSelected = isAssetSelected(asset);
            
            return (
              <Card key={asset.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}>
                {/* Asset Preview */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {asset.mime_type.startsWith('image/') ? (
                    <img
                      src={asset.file_url}
                      alt={asset.alt_text}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FileIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Selection Overlay */}
                  {multiSelect && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handleAssetSelect(asset)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-600 hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        {isSelected ? (
                          <CheckIcon className="h-5 w-5" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-current rounded"></div>
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => {
                        setEditingAsset(asset);
                        setEditForm({
                          alt_text: asset.alt_text || '',
                          caption: asset.caption || ''
                        });
                      }}
                      className="p-1.5 bg-white/90 backdrop-blur-sm rounded hover:bg-white transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-1.5 bg-white/90 backdrop-blur-sm rounded hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Asset Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate mb-1">
                    {asset.alt_text || 'Untitled'}
                  </h3>
                  {asset.caption && (
                    <p className="text-sm text-gray-600 truncate mb-2">
                      {asset.caption}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(asset.file_size)}</span>
                    <span>{asset.usage_count} uses</span>
                  </div>
                  {showUsageInfo && asset.usage_locations && asset.usage_locations.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {asset.usage_locations.slice(0, 3).map((location, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {location.replace('-', ' ')}
                          </span>
                        ))}
                        {asset.usage_locations.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{asset.usage_locations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Select Button for Single Select */}
                {!multiSelect && onSelect && (
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleAssetSelect(asset)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                    >
                      Select Asset
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Asset</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={editForm.alt_text}
                    onChange={(e) => setEditForm(prev => ({ ...prev, alt_text: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caption
                  </label>
                  <textarea
                    value={editForm.caption}
                    onChange={(e) => setEditForm(prev => ({ ...prev, caption: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleEdit}
                  variant="primary"
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setEditingAsset(null);
                    setEditForm({ alt_text: '', caption: '' });
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Unified Image Picker Component
interface ImagePickerProps {
  value?: MediaAsset | null;
  onChange: (asset: MediaAsset | null) => void;
  usageContext: 'page-hero' | 'package-image' | 'destination-image' | 'experience-image';
  placeholder?: string;
  allowClear?: boolean;
  showPreview?: boolean;
}

export function ImagePicker({
  value,
  onChange,
  usageContext,
  placeholder = "Select an image...",
  allowClear = true,
  showPreview = true
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (asset: MediaAsset) => {
    onChange(asset);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {value && showPreview ? (
        <div className="relative">
          <img
            src={value.file_url}
            alt={value.alt_text}
            className="w-full h-32 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => setIsOpen(true)}
              className="p-1 bg-white/90 backdrop-blur-sm rounded hover:bg-white transition-colors"
              title="Change image"
            >
              <PencilIcon className="h-4 w-4 text-gray-600" />
            </button>
            {allowClear && (
              <button
                onClick={handleClear}
                className="p-1 bg-white/90 backdrop-blur-sm rounded hover:bg-red-100 transition-colors"
                title="Remove image"
              >
                <XMarkIcon className="h-4 w-4 text-red-600" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
        >
          <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">{placeholder}</span>
        </button>
      )}

      {/* Media Library Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select {usageContext.replace('-', ' ')} Image
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <MediaLibrary
                usageContext={usageContext}
                showUsageInfo={false}
                onSelect={handleSelect}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modern Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Upload Media Assets</h2>
                  <p className="text-gray-600 mt-1">Add images, videos, and documents to your media library</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <UploadModalContent
                onUploadComplete={(assets) => {
                  setAssets(prev => [...assets, ...prev]);
                  setShowUploadModal(false);
                }}
                onClose={() => setShowUploadModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Modern Upload Modal Content Component
function UploadModalContent({ onUploadComplete, onClose }: {
  onUploadComplete: (assets: MediaAsset[]) => void;
  onClose: () => void;
}) {
  const { showSuccess, showError } = useNotification();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadedAssets, setUploadedAssets] = useState<MediaAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];

      if (file.size > maxSize) {
        showError(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        showError(`${file.name} is not a supported file type.`);
        return false;
      }

      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      // Add alt text based on filename
      const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      formData.append('alt_text', altText);

      try {
        setUploadingFiles(prev => new Set([...prev, file.name]));

        const response = await fetch('/api/media/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
          },
          body: formData,
        });

        if (response.ok) {
          const asset = await response.json();
          showSuccess(`Uploaded ${file.name} successfully`);
          return asset;
        } else {
          showError(`Failed to upload ${file.name}`);
          return null;
        }
      } catch (error) {
        showError(`Failed to upload ${file.name}`);
        return null;
      } finally {
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(file.name);
          return newSet;
        });
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(result => result !== null);

    if (successfulUploads.length > 0) {
      setUploadedAssets(successfulUploads);
      onUploadComplete(successfulUploads);
    }

    setIsUploading(false);
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 rounded-2xl">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `radial-gradient(circle at 20px 20px, rgba(59, 130, 246, 0.3) 2px, transparent 2px)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="mx-auto w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
            <CloudArrowUpIcon className={`h-10 w-10 ${isDragOver ? 'text-blue-600' : 'text-gray-400'} transition-colors`} />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isDragOver ? 'Drop your files here' : 'Upload Media Files'}
          </h3>

          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Drag and drop your files here, or click to browse. Supports images, videos, and documents.
          </p>

          {/* File type badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">JPG</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">PNG</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">WebP</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">GIF</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">MP4</span>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            disabled={isUploading}
          >
            Choose Files
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Maximum file size: 10MB per file
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Selected Files ({selectedFiles.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>

                {/* File preview for images */}
                {file.type.startsWith('image/') && (
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                  </div>
                )}

                {/* Upload progress */}
                {uploadingFiles.has(file.name) && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={() => setSelectedFiles([])}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={uploadFiles}
                disabled={isUploading || selectedFiles.length === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} Files`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800 font-medium">Uploading files...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaLibrary; 