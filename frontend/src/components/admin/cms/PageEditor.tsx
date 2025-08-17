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
} from '@heroicons/react/24/outline';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  is_published: boolean;
  locale: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

interface PageEditorProps {
  pageId?: number;
  onSave?: (page: Page) => void;
  onCancel?: () => void;
}

export function PageEditor({ pageId, onSave, onCancel }: PageEditorProps) {
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(!!pageId);
  const [isSaving, setIsSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
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

  const insertMedia = (mediaUrl: string, altText: string) => {
    const imageMarkdown = `![${altText}](${mediaUrl})`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n' + imageMarkdown,
    }));
    setShowMediaLibrary(false);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:');
    
    if (url && text) {
      const linkMarkdown = `[${text}](${url})`;
      setFormData(prev => ({
        ...prev,
        content: prev.content + '\n' + linkMarkdown,
      }));
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

          {/* Content Editor */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Content</h3>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowMediaLibrary(true)}
                  variant="secondary"
                  size="sm"
                >
                  <PhotoIcon className="h-4 w-4 mr-1" />
                  Insert Media
                </Button>
                
                <Button
                  onClick={insertLink}
                  variant="secondary"
                  size="sm"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Insert Link
                </Button>
              </div>
            </div>
            
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Write your page content here... You can use Markdown formatting."
            />
            
            <div className="mt-2 text-xs text-gray-500">
              <p>Supports Markdown formatting. Use **bold**, *italic*, [links](url), ![images](url), etc.</p>
            </div>
          </Card>

          {/* Preview */}
          {showPreview && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="prose max-w-none">
                <h1>{formData.title}</h1>
                <div 
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ 
                    __html: formData.content 
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
                      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
                      .replace(/\n/g, '<br>')
                  }}
                />
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

export default PageEditor;
