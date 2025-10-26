import React, { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner } from '../../index';
import { useNotification } from '../../../hooks';
import {
  Bars3Icon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LinkIcon,
  DocumentTextIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface Menu {
  id: number;
  name: string;
  slug: string;
  locale: string;
  created_at: string;
  updated_at: string;
}

interface MenuItem {
  id: number;
  menu: number;
  title: string;
  url: string;
  link_type: 'external' | 'internal' | 'page';
  page?: number;
  order: number;
  parent?: number;
  created_at: string;
  updated_at: string;
}

interface MenuFormData {
  name: string;
  slug: string;
  locale: string;
}

interface MenuItemFormData {
  title: string;
  url: string;
  link_type: 'external' | 'internal' | 'page';
  page?: number;
  order: number;
  parent?: number;
}

export function MenuManager() {
  const { showSuccess, showError } = useNotification();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

  const [menuFormData, setMenuFormData] = useState<MenuFormData>({
    name: '',
    slug: '',
    locale: 'en',
  });

  const [itemFormData, setItemFormData] = useState<MenuItemFormData>({
    title: '',
    url: '',
    link_type: 'external',
    order: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load menus
      const menusResponse = await fetch('/api/menus/');
      if (menusResponse.ok) {
        const menusData = await menusResponse.json();
        setMenus(menusData.results || menusData.data || menusData);
      }

      // Load menu items
      const itemsResponse = await fetch('/api/menu-items/');
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        setMenuItems(itemsData.results || itemsData.data || itemsData);
      }
    } catch (error) {
      showError('Failed to load menus and menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMenu = async () => {
    try {
      const url = editingMenu ? `/api/menus/${editingMenu.id}/` : '/api/menus/';
      const method = editingMenu ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuFormData),
      });

      if (response.ok) {
        const savedMenu = await response.json();
        
        if (editingMenu) {
          setMenus(prev => prev.map(menu => 
            menu.id === editingMenu.id ? savedMenu : menu
          ));
        } else {
          setMenus(prev => [savedMenu, ...prev]);
        }
        
        showSuccess(`Menu ${editingMenu ? 'updated' : 'created'} successfully`);
        setShowMenuForm(false);
        setEditingMenu(null);
        setMenuFormData({ name: '', slug: '', locale: 'en' });
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Failed to save menu');
      }
    } catch (error) {
      showError('Failed to save menu');
    }
  };

  const handleSaveMenuItem = async () => {
    if (!selectedMenu) {
      showError('Please select a menu first');
      return;
    }

    try {
      const url = editingItem ? `/api/menu-items/${editingItem.id}/` : '/api/menu-items/';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...itemFormData,
          menu: selectedMenu,
        }),
      });

      if (response.ok) {
        const savedItem = await response.json();
        
        if (editingItem) {
          setMenuItems(prev => prev.map(item => 
            item.id === editingItem.id ? savedItem : item
          ));
        } else {
          setMenuItems(prev => [savedItem, ...prev]);
        }
        
        showSuccess(`Menu item ${editingItem ? 'updated' : 'created'} successfully`);
        setShowItemForm(false);
        setEditingItem(null);
        setItemFormData({ title: '', url: '', link_type: 'external', order: 0 });
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Failed to save menu item');
      }
    } catch (error) {
      showError('Failed to save menu item');
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    if (!confirm('Are you sure you want to delete this menu? This will also delete all its items.')) {
      return;
    }

    try {
      const response = await fetch(`/api/menus/${menuId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenus(prev => prev.filter(menu => menu.id !== menuId));
        setMenuItems(prev => prev.filter(item => item.menu !== menuId));
        showSuccess('Menu deleted successfully');
      } else {
        showError('Failed to delete menu');
      }
    } catch (error) {
      showError('Failed to delete menu');
    }
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/menu-items/${itemId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
        showSuccess('Menu item deleted successfully');
      } else {
        showError('Failed to delete menu item');
      }
    } catch (error) {
      showError('Failed to delete menu item');
    }
  };

  const toggleMenuExpansion = (menuId: number) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const getMenuItems = (menuId: number) => {
    return menuItems.filter(item => item.menu === menuId);
  };

  const getLinkIcon = (linkType: string) => {
    switch (linkType) {
      case 'external':
        return GlobeAltIcon;
      case 'internal':
        return LinkIcon;
      case 'page':
        return DocumentTextIcon;
      default:
        return LinkIcon;
    }
  };

  const filteredMenus = menus.filter(menu => {
    if (!menu || !menu.name || !menu.slug) return false;
    return true;
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
          <h2 className="text-2xl font-bold text-gray-900">Menu Manager</h2>
          <p className="text-gray-600">Manage navigation menus and menu items</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setShowMenuForm(true);
              setEditingMenu(null);
              setMenuFormData({ name: '', slug: '', locale: 'en' });
            }}
            variant="primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Menu
          </Button>
        </div>
      </div>

      {/* Menus List */}
      <div className="space-y-4">
        {filteredMenus.length === 0 ? (
          <Card className="p-8 text-center">
            <Bars3Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No menus found</h3>
            <p className="text-gray-600 mb-4">Create your first menu to get started</p>
            <Button
              onClick={() => {
                setShowMenuForm(true);
                setEditingMenu(null);
                setMenuFormData({ name: '', slug: '', locale: 'en' });
              }}
              variant="primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Menu
            </Button>
          </Card>
        ) : (
          filteredMenus.map((menu) => {
            const isExpanded = expandedMenus.has(menu.id);
            const menuItemsList = getMenuItems(menu.id);
            
            return (
              <Card key={menu.id} className="overflow-hidden">
                {/* Menu Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleMenuExpansion(menu.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                        <p className="text-sm text-gray-600">/{menu.slug} • {menu.locale}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setSelectedMenu(menu.id);
                          setShowItemForm(true);
                          setEditingItem(null);
                          setItemFormData({ title: '', url: '', link_type: 'external', order: 0 });
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                      
                      <Button
                        onClick={() => {
                          setEditingMenu(menu);
                          setMenuFormData({
                            name: menu.name,
                            slug: menu.slug,
                            locale: menu.locale,
                          });
                          setShowMenuForm(true);
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handleDeleteMenu(menu.id)}
                        variant="secondary"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                {isExpanded && (
                  <div className="p-4">
                    {menuItemsList.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No menu items yet</p>
                    ) : (
                      <div className="space-y-2">
                        {menuItemsList.map((item) => {
                          const LinkIcon = getLinkIcon(item.link_type);
                          
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <LinkIcon className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="font-medium text-gray-900">{item.title}</p>
                                  <p className="text-sm text-gray-600">{item.url}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Order: {item.order}</span>
                                
                                <Button
                                  onClick={() => {
                                    setEditingItem(item);
                                    setItemFormData({
                                      title: item.title,
                                      url: item.url,
                                      link_type: item.link_type,
                                      page: item.page,
                                      order: item.order,
                                      parent: item.parent,
                                    });
                                    setShowItemForm(true);
                                  }}
                                  variant="secondary"
                                  size="sm"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  onClick={() => handleDeleteMenuItem(item.id)}
                                  variant="secondary"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Menu Form Modal */}
      {showMenuForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingMenu ? 'Edit Menu' : 'Create Menu'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Menu Name
                  </label>
                  <input
                    type="text"
                    value={menuFormData.name}
                    onChange={(e) => setMenuFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Main Navigation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={menuFormData.slug}
                    onChange={(e) => setMenuFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="main-navigation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locale
                  </label>
                  <select
                    value={menuFormData.locale}
                    onChange={(e) => setMenuFormData(prev => ({ ...prev, locale: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveMenu}
                  variant="primary"
                  className="flex-1"
                >
                  {editingMenu ? 'Update Menu' : 'Create Menu'}
                </Button>
                <Button
                  onClick={() => {
                    setShowMenuForm(false);
                    setEditingMenu(null);
                    setMenuFormData({ name: '', slug: '', locale: 'en' });
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

      {/* Menu Item Form Modal */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={itemFormData.title}
                    onChange={(e) => setItemFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Home"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Type
                  </label>
                  <select
                    value={itemFormData.link_type}
                    onChange={(e) => setItemFormData(prev => ({ 
                      ...prev, 
                      link_type: e.target.value as 'external' | 'internal' | 'page' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="external">External URL</option>
                    <option value="internal">Internal Path</option>
                    <option value="page">Page</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL/Path
                  </label>
                  <input
                    type="text"
                    value={itemFormData.url}
                    onChange={(e) => setItemFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={itemFormData.link_type === 'external' ? 'https://example.com' : '/home'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={itemFormData.order}
                    onChange={(e) => setItemFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveMenuItem}
                  variant="primary"
                  className="flex-1"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button
                  onClick={() => {
                    setShowItemForm(false);
                    setEditingItem(null);
                    setItemFormData({ title: '', url: '', link_type: 'external', order: 0 });
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

export default MenuManager; 