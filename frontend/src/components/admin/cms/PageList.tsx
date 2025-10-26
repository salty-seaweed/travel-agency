import React, { useState, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import { apiGet, apiPost, apiDelete } from '../../../api';
import { useNotification } from '../../../hooks/useNotification';
import type { Page } from '../../../types';
import { PageHeader } from './components/PageHeader';
import { PageFilters } from './components/PageFilters';
import { PageTable } from './components/PageTable';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { LoadingSpinner } from './components/LoadingSpinner';

interface PageListProps {
  onCreatePage: () => void;
  onViewPage: (page: Page) => void;
  onEditPage: (page: Page) => void;
  onAdvancedEditPage?: (page: Page) => void;
}

export const PageList: React.FC<PageListProps> = ({
  onCreatePage,
  onViewPage,
  onEditPage,
  onAdvancedEditPage,
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [localeFilter, setLocaleFilter] = useState('all');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { showNotification } = useNotification();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await apiGet('pages/');
      const pagesData = response.results || response.data || [];
      setPages(pagesData);
    } catch (error) {
      showNotification('Error loading pages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicatePage = async (pageId: string) => {
    try {
      const response = await apiPost(`pages/${pageId}/duplicate/`, {});
      const newPage = response.data || response;
      setPages(prev => [newPage, ...prev]);
      showNotification('Page duplicated successfully', 'success');
    } catch (error) {
      showNotification('Error duplicating page', 'error');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      await apiDelete(`pages/${pageId}/`);
      setPages(prev => prev.filter(p => p.id.toString() !== pageId));
      showNotification('Page deleted successfully', 'success');
    } catch (error) {
      showNotification('Error deleting page', 'error');
    }
  };

  const handleBulkAction = async (action: 'publish' | 'archive' | 'delete') => {
    if (selectedPages.length === 0) {
      showNotification('Please select pages first', 'warning');
      return;
    }

    try {
      setBulkActionLoading(true);
      
      if (action === 'delete') {
        setShowDeleteModal(true);
        return;
      }

      const response = await apiPost(`pages/bulk_${action}/`, {
        page_ids: selectedPages
      });
      
      setSelectedPages([]);
      await loadPages();
      showNotification(response.message || `${action} successful`, 'success');
    } catch (error) {
      showNotification(`Error performing bulk ${action}`, 'error');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setBulkActionLoading(true);
      await apiPost('pages/bulk_delete/', {
        page_ids: selectedPages
      });
      
      setSelectedPages([]);
      setShowDeleteModal(false);
      await loadPages();
      showNotification('Pages deleted successfully', 'success');
    } catch (error) {
      showNotification('Error deleting pages', 'error');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesLocale = localeFilter === 'all' || page.locale === localeFilter;
    
    return matchesSearch && matchesStatus && matchesLocale;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPages(filteredPages.map(p => p.id.toString()));
    } else {
      setSelectedPages([]);
    }
  };

  const handleSelectPage = (pageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPages(prev => [...prev, pageId]);
    } else {
      setSelectedPages(prev => prev.filter(id => id !== pageId));
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading pages..." />;
  }

  return (
    <VStack spacing={6} align="stretch">
      <PageHeader
        pageCount={filteredPages.length}
        onCreatePage={onCreatePage}
      />

      <PageFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        localeFilter={localeFilter}
        onLocaleFilterChange={setLocaleFilter}
        selectedCount={selectedPages.length}
        onBulkAction={handleBulkAction}
        bulkActionLoading={bulkActionLoading}
      />

      <PageTable
        pages={filteredPages}
        selectedPages={selectedPages}
        onSelectAll={handleSelectAll}
        onSelectPage={handleSelectPage}
        onViewPage={onViewPage}
        onEditPage={onEditPage}
        onAdvancedEditPage={onAdvancedEditPage}
        onDuplicatePage={handleDuplicatePage}
        onDeletePage={handleDeletePage}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title="Confirm Bulk Delete"
        message={`Are you sure you want to delete ${selectedPages.length} pages? This action cannot be undone.`}
        itemCount={selectedPages.length}
        itemType="Pages"
        isLoading={bulkActionLoading}
      />
    </VStack>
  );
};
