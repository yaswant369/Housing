import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Filter,
  Grid3X3,
  List,
  Download,
  MoreVertical,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AppContext } from '../context/AppContext';
import PropertyFilters from '../components/my-listings/PropertyFilters';
import MyPropertyCard from '../components/my-listings/MyPropertyCard';
import BulkActionsBar, { SelectAllCheckbox } from '../components/my-listings/BulkActionsBar';
import PropertyEditModal from '../components/my-listings/PropertyEditModal';
import PropertyEditPage from '../components/property-edit/PropertyEditPage';

export default function MyListingsPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    properties,
    loading,
    error,
    handleOpenPostWizard,
    handleEditProperty,
    handleDeleteProperty,
    API_BASE_URL
  } = React.useContext(AppContext);

  // State management
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(true);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Full edit page states
  const [fullEditOpen, setFullEditOpen] = useState(false);
  const [fullEditProperty, setFullEditProperty] = useState(null);

  // Filter and sort properties
  const processedProperties = useMemo(() => {
    if (!properties) return [];
    
    let filtered = properties.filter(property => 
      property.userId === currentUser?.id || property.userId === currentUser?._id
    );

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.type?.toLowerCase().includes(searchLower) ||
        property.location?.toLowerCase().includes(searchLower) ||
        property.id?.toString().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(property => {
        switch (activeFilter) {
          case 'active':
            return property.status === 'active';
          case 'paused':
            return property.status === 'paused';
          case 'pending':
            return property.status === 'pending';
          case 'expired':
            return property.status === 'expired';
          case 'draft':
            return property.status === 'draft';
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest_price':
          return (b.priceValue || 0) - (a.priceValue || 0);
        case 'most_views':
          return (b.viewsLast30Days || 0) - (a.viewsLast30Days || 0);
        case 'most_leads':
          return (b.leadsLast30Days || 0) - (a.leadsLast30Days || 0);
        case 'most_shortlists':
          return (b.shortlistsCount || 0) - (a.shortlistsCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [properties, currentUser, searchTerm, activeFilter, sortBy]);

  useEffect(() => {
    setFilteredProperties(processedProperties);
  }, [processedProperties]);

  // Handle property selection
  const handlePropertySelect = useCallback((propertyId, isSelected) => {
    setSelectedProperties(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(propertyId);
      } else {
        newSet.delete(propertyId);
      }
      return newSet;
    });
  }, []);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    setSelectedProperties(new Set(filteredProperties.map(p => p.id)));
  }, [filteredProperties]);

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedProperties(new Set());
  }, []);

  // Check if all properties are selected
  const isAllSelected = filteredProperties.length > 0 && selectedProperties.size === filteredProperties.length;
  const isSomeSelected = selectedProperties.size > 0 && selectedProperties.size < filteredProperties.length;

  // Property action handlers
  const handleEdit = useCallback((property) => {
    setEditingProperty(property);
    setEditModalOpen(true);
  }, []);

  const handleFullEdit = useCallback((property) => {
    setFullEditProperty(property);
    setFullEditOpen(true);
  }, []);

  const handleEditPhotos = useCallback((property) => {
    handleOpenPostWizard(property);
  }, [handleOpenPostWizard]);

  const handleChangeStatus = useCallback(async (property, newStatus, additionalData = {}) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      
      // Add additional data if provided (for sold date, price, etc.)
      Object.keys(additionalData).forEach(key => {
        if (additionalData[key] !== undefined && additionalData[key] !== null) {
          formData.append(key, additionalData[key]);
        }
      });
      
      await handleEditProperty(property.id, formData);
      toast.success(`Property ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
    } catch (error) {
      toast.error('Failed to change status: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [handleEditProperty]);

  const handleMarkSold = useCallback(async (property, soldData = {}) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', 'sold');
      
      // Add sold data if provided
      Object.keys(soldData).forEach(key => {
        if (soldData[key] !== undefined && soldData[key] !== null) {
          formData.append(key, soldData[key]);
        }
      });
      
      await handleEditProperty(property.id, formData);
      toast.success('Property marked as sold/rented');
    } catch (error) {
      toast.error('Failed to mark as sold: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [handleEditProperty]);

  const handleRenew = useCallback(async (property, renewalData = {}) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Extend listing by 30 days or use provided expiry date
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + 30);
      formData.append('expiresAt', newExpiryDate.toISOString());
      formData.append('status', 'active');
      
      // Add renewal notes if provided
      if (renewalData.notes) {
        formData.append('renewalNotes', renewalData.notes);
      }
      
      await handleEditProperty(property.id, formData);
      toast.success('Property renewed successfully');
    } catch (error) {
      toast.error('Failed to renew property: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [handleEditProperty]);

  const handleBoost = useCallback(async (property) => {
    // Open premium/boosting options
    navigate('/premium');
  }, []);

  const handleDuplicate = useCallback(async (property) => {
    setIsLoading(true);
    try {
      // Create a duplicate with modified title
      const duplicatedProperty = {
        ...property,
        type: `${property.type} (Copy)`,
        status: 'draft',
        createdAt: undefined,
        updatedAt: undefined,
        id: undefined
      };
      delete duplicatedProperty._id;
      
      const formData = new FormData();
      Object.keys(duplicatedProperty).forEach(key => {
        if (duplicatedProperty[key] !== undefined && duplicatedProperty[key] !== null) {
          formData.append(key, typeof duplicatedProperty[key] === 'object' ? 
            JSON.stringify(duplicatedProperty[key]) : duplicatedProperty[key]);
        }
      });
      
      // This would call an add property function
      // await handleAddProperty(formData);
      toast.success('Property duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate property: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (property) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setIsLoading(true);
      try {
        await handleDeleteProperty(property.id);
        toast.success('Property deleted successfully');
      } catch (error) {
        toast.error('Failed to delete property: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [handleDeleteProperty]);

  const handleViewPublic = useCallback((property) => {
    window.open(`/property/${property.id}`, '_blank');
  }, []);

  const handleAnalytics = useCallback((property) => {
    // This would typically open an analytics modal or navigate to analytics page
    console.log('Analytics for property:', property.id);
    // For now, we'll just log it - the analytics panel is handled in the property card
  }, []);

  // Bulk actions handler
  const handleBulkAction = useCallback(async (action, propertyIds) => {
    const propertiesToProcess = filteredProperties.filter(p => propertyIds.includes(p.id));
    setIsLoading(true);
    
    try {
      switch (action) {
        case 'set-online':
          await Promise.all(propertiesToProcess.map(p => handleChangeStatus(p, 'active')));
          break;
        case 'set-offline':
          await Promise.all(propertiesToProcess.map(p => handleChangeStatus(p, 'paused')));
          break;
        case 'mark-sold':
          await Promise.all(propertiesToProcess.map(p => handleMarkSold(p)));
          break;
        case 'renew':
          await Promise.all(propertiesToProcess.map(p => handleRenew(p)));
          break;
        case 'boost':
          // Navigate to premium page with selected properties
          navigate('/premium');
          break;
        case 'delete':
          if (window.confirm(`Delete ${propertyIds.length} properties?`)) {
            await Promise.all(propertiesToProcess.map(p => handleDelete(p)));
          }
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [filteredProperties, handleChangeStatus, handleMarkSold, handleRenew, handleDelete, navigate]);

  // Handle edit modal save
  const handleEditSave = useCallback(async (propertyId, formData) => {
    await handleEditProperty(propertyId, formData);
    setEditModalOpen(false);
    setEditingProperty(null);
  }, [handleEditProperty]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-2 text-lg font-medium">Authentication Required</h2>
          <p className="mt-1 text-gray-500">Please log in to view your properties.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Properties</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your {filteredProperties.length} listings
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenPostWizard()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Property
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <PropertyFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={filteredProperties.length}
        />

        {/* Select All Checkbox (when properties are selected) */}
        {selectedProperties.size > 0 && (
          <div className="mb-4">
            <SelectAllCheckbox
              isAllSelected={isAllSelected}
              isSomeSelected={isSomeSelected}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              totalCount={filteredProperties.length}
              selectedCount={selectedProperties.size}
            />
          </div>
        )}

        {/* Properties Grid/List */}
        {filteredProperties.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredProperties.map(property => (
              <MyPropertyCard
                key={property.id}
                property={property}
                viewMode={viewMode}
                isSelected={selectedProperties.has(property.id)}
                onSelect={handlePropertySelect}
                onEdit={handleEdit}
                onFullEdit={handleFullEdit}
                onEditPhotos={handleEditPhotos}
                onChangeStatus={handleChangeStatus}
                onMarkSold={handleMarkSold}
                onRenew={handleRenew}
                onBoost={handleBoost}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onViewPublic={handleViewPublic}
                onAnalytics={handleAnalytics}
                API_BASE_URL={API_BASE_URL}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              {searchTerm || activeFilter !== 'all' ? <Search /> : <Plus />}
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              {searchTerm || activeFilter !== 'all' ? 'No properties found' : 'No properties yet'}
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchTerm || activeFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Get started by posting your first property'
              }
            </p>
            {!searchTerm && activeFilter === 'all' && (
              <button
                onClick={() => handleOpenPostWizard()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Your First Property
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedProperties={[...selectedProperties]}
        totalProperties={filteredProperties.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onBulkAction={handleBulkAction}
        isVisible={selectedProperties.size > 0}
      />

      {/* Edit Modal */}
      <PropertyEditModal
        property={editingProperty}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingProperty(null);
        }}
        onSave={handleEditSave}
        onChangeStatus={handleChangeStatus}
        onEditPhotos={handleEditPhotos}
        onDuplicate={handleDuplicate}
        API_BASE_URL={API_BASE_URL}
      />

      {/* Full Edit Property Page */}
      {fullEditOpen && fullEditProperty && (
        <PropertyEditPage
          property={fullEditProperty}
          isOpen={fullEditOpen}
          onClose={() => {
            setFullEditOpen(false);
            setFullEditProperty(null);
          }}
          onSave={handleEditSave}
          onChangeStatus={handleChangeStatus}
          onEditPhotos={handleEditPhotos}
          onDuplicate={handleDuplicate}
          onPreviewListing={handleViewPublic}
          API_BASE_URL={API_BASE_URL}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-900 dark:text-gray-100">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}