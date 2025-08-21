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
  created_at: string;
  created_by?: number;
}

interface MediaLibraryProps {
  onSelect?: (asset: MediaAsset) => void;
  multiSelect?: boolean;
  selectedAssets?: MediaAsset[];
  onSelectionChange?: (assets: MediaAsset[]) => void;
}

export function MediaLibrary({ 
  onSelect, 
  multiSelect = false, 
  selectedAssets = [], 
  onSelectionChange 
}: MediaLibraryProps) {
  const { showSuccess, showError } = useNotification();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
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
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-600">Manage your media assets</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
            <ArrowUpTrayIcon className="h-5 w-5 inline mr-2" />
            Upload Files
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
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
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors cursor-pointer">
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Upload Files
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
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

export default MediaLibrary; 