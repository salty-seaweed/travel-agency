import React, { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner } from '../../index';
import { useNotification } from '../../../hooks';
import { MediaLibrary } from './MediaLibrary';
import {
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  CalendarIcon,
  UserIcon,
  PlusIcon,
  TrashIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
}

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  blocks?: Block[];
  meta_description?: string;
  meta_keywords?: string;
  is_published: boolean;
  locale: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

interface EnhancedPageEditorProps {
  pageId?: number;
  onSave?: (page: Page) => void;
  onCancel?: () => void;
}

const BLOCK_TYPES = [
  { id: 'text', name: 'Text Block', icon: DocumentTextIcon },
  { id: 'image', name: 'Image Block', icon: PhotoIcon },
  { id: 'gallery', name: 'Gallery Block', icon: PhotoIcon },
  { id: 'video', name: 'Video Block', icon: PhotoIcon },
  { id: 'quote', name: 'Quote Block', icon: DocumentTextIcon },
  { id: 'cta', name: 'Call to Action', icon: LinkIcon },
];

export function EnhancedPageEditor({ pageId, onSave, onCancel }: EnhancedPageEditorProps) {
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(!!pageId);
  const [isSaving, setIsSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    blocks: [] as Block[],
    meta_description: '',
    meta_keywords: '',
    is_published: false,
    locale: 'en',
  });

  useEffect(() => {
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadPage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/pages/${pageId}/`);
      if (response.ok) {
        const page = await response.json();
        setFormData({
          title: page.title || '',
          slug: page.slug || '',
          content: page.content || '',
          blocks: page.blocks || [],
          meta_description: page.meta_description || '',
          meta_keywords: page.meta_keywords || '',
          is_published: page.is_published || false,
          locale: page.locale || 'en',
        });
      } else {
        showError('Failed to load page');
      }
    } catch (error) {
      showError('Failed to load page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showError('Title is required');
      return;
    }

    if (!formData.slug.trim()) {
      showError('Slug is required');
      return;
    }

    try {
      setIsSaving(true);
      const url = pageId ? `/api/pages/${pageId}/` : '/api/pages/';
      const method = pageId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedPage = await response.json();
        showSuccess(`Page ${pageId ? 'updated' : 'created'} successfully`);
        onSave?.(savedPage);
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Failed to save page');
      }
    } catch (error) {
      showError('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
    
    // Auto-generate slug if empty
    if (!formData.slug) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: `block_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      order: formData.blocks.length,
    };
    
    setFormData(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
  };

  const removeBlock = (blockId: string) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
    }));
  };

  const updateBlock = (blockId: string, content: any) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, content } : block
      ),
    }));
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      const blocks = [...prev.blocks];
      const index = blocks.findIndex(block => block.id === blockId);
      
      if (direction === 'up' && index > 0) {
        [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
      } else if (direction === 'down' && index < blocks.length - 1) {
        [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
      }
      
      return { ...prev, blocks };
    });
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: '' };
      case 'image':
        return { url: '', alt: '', caption: '' };
      case 'gallery':
        return { images: [] };
      case 'video':
        return { url: '', title: '', description: '' };
      case 'quote':
        return { text: '', author: '' };
      case 'cta':
        return { title: '', description: '', buttonText: '', buttonUrl: '' };
      default:
        return {};
    }
  };

  const insertMedia = (mediaUrl: string, altText: string) => {
    if (selectedBlock && selectedBlock.type === 'image') {
      updateBlock(selectedBlock.id, {
        url: mediaUrl,
        alt: altText,
        caption: '',
      });
    }
    setShowMediaLibrary(false);
    setSelectedBlock(null);
  };

  const renderBlockEditor = (block: Block) => {
    const { type, content } = block;
    
    switch (type) {
      case 'text':
        return (
          <textarea
            value={content.text || ''}
            onChange={(e) => updateBlock(block.id, { ...content, text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            placeholder="Enter your text content..."
          />
        );
      
      case 'image':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={content.url || ''}
                onChange={(e) => updateBlock(block.id, { ...content, url: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Image URL"
              />
              <Button
                onClick={() => {
                  setSelectedBlock(block);
                  setShowMediaLibrary(true);
                }}
                variant="secondary"
                size="sm"
              >
                <PhotoIcon className="h-4 w-4 mr-1" />
                Select
              </Button>
            </div>
            <input
              type="text"
              value={content.alt || ''}
              onChange={(e) => updateBlock(block.id, { ...content, alt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Alt text"
            />
            <input
              type="text"
              value={content.caption || ''}
              onChange={(e) => updateBlock(block.id, { ...content, caption: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Caption (optional)"
            />
            {content.url && (
              <img
                src={content.url}
                alt={content.alt}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>
        );
      
      case 'quote':
        return (
          <div className="space-y-3">
            <textarea
              value={content.text || ''}
              onChange={(e) => updateBlock(block.id, { ...content, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Quote text..."
            />
            <input
              type="text"
              value={content.author || ''}
              onChange={(e) => updateBlock(block.id, { ...content, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Author"
            />
          </div>
        );
      
      case 'cta':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => updateBlock(block.id, { ...content, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Title"
            />
            <textarea
              value={content.description || ''}
              onChange={(e) => updateBlock(block.id, { ...content, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Description"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={content.buttonText || ''}
                onChange={(e) => updateBlock(block.id, { ...content, buttonText: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Button text"
              />
              <input
                type="text"
                value={content.buttonUrl || ''}
                onChange={(e) => updateBlock(block.id, { ...content, buttonUrl: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Button URL"
              />
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-500">Block type not supported</div>;
    }
  };

  const renderBlockPreview = (block: Block) => {
    const { type, content } = block;
    
    switch (type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <p>{content.text || 'No text content'}</p>
          </div>
        );
      
      case 'image':
        return content.url ? (
          <div className="space-y-2">
            <img
              src={content.url}
              alt={content.alt}
              className="w-full h-48 object-cover rounded-lg"
            />
            {content.caption && (
              <p className="text-sm text-gray-600 text-center">{content.caption}</p>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <PhotoIcon className="h-12 w-12 text-gray-400" />
          </div>
        );
      
      case 'quote':
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
            <p className="text-lg italic">"{content.text || 'No quote text'}"</p>
            {content.author && (
              <footer className="text-sm text-gray-600 mt-2">— {content.author}</footer>
            )}
          </blockquote>
        );
      
      case 'cta':
        return (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">{content.title || 'Call to Action'}</h3>
            <p className="mb-4">{content.description || 'No description'}</p>
            {content.buttonText && content.buttonUrl && (
              <a
                href={content.buttonUrl}
                className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {content.buttonText}
              </a>
            )}
          </div>
        );
      
      default:
        return <div className="text-gray-500">Preview not available</div>;
    }
  };

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
            {pageId ? 'Edit Page' : 'Create New Page'}
          </h2>
          <p className="text-gray-600">
            {pageId ? 'Update your page content and settings' : 'Create a new page for your website'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="secondary"
          >
            {showPreview ? (
              <>
                <EyeSlashIcon className="h-5 w-5 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <EyeIcon className="h-5 w-5 mr-2" />
                Preview
              </>
            )}
          </Button>
          
          <Button
            onClick={handleSave}
            variant="primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : (pageId ? 'Update Page' : 'Create Page')}
          </Button>
          
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="secondary"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter page title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="page-slug"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Locale
                </label>
                <select
                  value={formData.locale}
                  onChange={(e) => setFormData(prev => ({ ...prev, locale: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="ru">Russian</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Block Editor */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Content Blocks</h3>
              
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addBlock(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Add Block</option>
                  {BLOCK_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {formData.blocks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No content blocks yet. Add your first block to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.blocks.map((block, index) => (
                  <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          {BLOCK_TYPES.find(t => t.id === block.type)?.name || block.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => moveBlock(block.id, 'up')}
                          variant="secondary"
                          size="sm"
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          onClick={() => moveBlock(block.id, 'down')}
                          variant="secondary"
                          size="sm"
                          disabled={index === formData.blocks.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          onClick={() => removeBlock(block.id)}
                          variant="secondary"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {renderBlockEditor(block)}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Preview */}
          {showPreview && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="prose max-w-none">
                <h1>{formData.title}</h1>
                {formData.blocks.map(block => (
                  <div key={block.id} className="mb-6">
                    {renderBlockPreview(block)}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description for search engines"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </Card>

          {/* Publishing */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>
              
              {pageId && (
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Created: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>Author: Admin</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button
                onClick={handleSave}
                variant="primary"
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              
              <Button
                onClick={() => {
                  setFormData(prev => ({ ...prev, is_published: true }));
                  handleSave();
                }}
                variant="primary"
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? 'Publishing...' : 'Publish Page'}
              </Button>
              
              {onCancel && (
                <Button
                  onClick={onCancel}
                  variant="secondary"
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Media</h3>
                  <Button
                    onClick={() => setShowMediaLibrary(false)}
                    variant="secondary"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
                
                <MediaLibrary
                  onSelect={(asset) => insertMedia(asset.file_url, asset.alt_text)}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedPageEditor; 