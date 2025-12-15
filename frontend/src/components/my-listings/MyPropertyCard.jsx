import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Edit3,
  MoreVertical,
  Eye,
  MessageSquare,
  Heart,
  Camera,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pause,
  Play,
  Copy,
  Trash2,
  ExternalLink,
  Star,
  Settings,
  Upload,
  BarChart3,
  RefreshCw,
  Check,
  Award,
  TrendingUp,
  Edit,
  Archive
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatusChangeDialog from './StatusChangeDialog';
import { formatPrice } from '../../utils/propertyHelpers';

const statusConfig = {
  active: { 
    label: 'Online', 
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle 
  },
  paused: { 
    label: 'Offline', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: Pause 
  },
  pending: { 
    label: 'Pending approval', 
    color: 'bg-blue-100 text-blue-800',
    icon: AlertCircle 
  },
  rejected: { 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-800',
    icon: XCircle 
  },
  expired: { 
    label: 'Expired', 
    color: 'bg-gray-100 text-gray-800',
    icon: Clock 
  },
  draft: { 
    label: 'Draft', 
    color: 'bg-gray-100 text-gray-800',
    icon: Edit3 
  },
  sold: { 
    label: 'Sold', 
    color: 'bg-purple-100 text-purple-800',
    icon: Check 
  },
  archived: { 
    label: 'Archived', 
    color: 'bg-gray-100 text-gray-600',
    icon: Archive 
  },
  // Transaction type statuses (treat as active for display)
  'For Sale': { 
    label: 'For Sale', 
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle 
  },
  'For Rent': { 
    label: 'For Rent', 
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle 
  }
};

const planConfig = {
  free: { label: 'Free', color: 'bg-gray-100 text-gray-700' },
  featured: { label: 'Featured', color: 'bg-yellow-100 text-yellow-700' },
  premium: { label: 'Premium', color: 'bg-purple-100 text-purple-700' }
};

export default function MyPropertyCard({ 
  property, 
  viewMode = 'list',
  isSelected = false,
  onSelect,
  onEdit,
  onFullEdit,
  onEditPhotos,
  onChangeStatus,
  onMarkSold,
  onRenew,
  onBoost,
  onDuplicate,
  onDelete,
  onViewPublic,
  onAnalytics,
  API_BASE_URL 
}) {
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDialogAction, setStatusDialogAction] = useState(null);
  
  const {
    id, type, location, price, status, images = [], bhk, bathrooms, 
    area, buildingName, description, keyHighlights = [], 
    createdAt, updatedAt, isFeatured, furnishing, planType = 'free',
    viewsLast7Days = 0, viewsLast30Days = 0, leadsLast7Days = 0, 
    leadsLast30Days = 0, shortlistsCount = 0, priceValue = 0,
    media = {}
  } = property;

  // Enhanced image normalization - handles both legacy and new media structures
  const normalizeImage = (img) => {
    const placeholder = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
    if (!img) return placeholder;
    
    try {
      if (typeof img === 'string') {
        // Handle string URLs - replace backslashes with forward slashes
        const clean = img.replace(/\\\\/g, '/').replace(/\\/g, '/');
        if (clean.startsWith('http')) return clean;
        // Ensure the path starts with / for proper API_BASE_URL concatenation
        const normalizedPath = clean.startsWith('/') ? clean : `/${clean}`;
        return `${API_BASE_URL}${normalizedPath}`;
      }
      if (typeof img === 'object') {
        // Handle image objects - get the best available URL
        const medium = img.medium || img.optimized || img.thumbnail || img.url;
        if (!medium) return placeholder;
        const clean = medium.replace(/\\\\/g, '/').replace(/\\/g, '/');
        if (clean.startsWith('http')) return clean;
        const normalizedPath = clean.startsWith('/') ? clean : `/${clean}`;
        return `${API_BASE_URL}${normalizedPath}`;
      }
    } catch (error) {
      console.warn('Error normalizing image:', error, img);
    }
    return placeholder;
  };

  // Get all images from both legacy and new structures
  const getAllImages = () => {
    let allImages = [];
    
    // Get images from legacy structure
    if (images && Array.isArray(images)) {
      allImages = [...allImages, ...images];
    }
    
    // Get images from new media structure
    if (media && media.photos && Array.isArray(media.photos)) {
      // Convert new media structure to match legacy format for consistency
      const mediaPhotos = media.photos.map(photo => {
        // Handle different photo object structures
        if (photo.url) {
          return {
            medium: photo.medium || photo.optimized || photo.url,
            thumbnail: photo.thumbnail || photo.medium || photo.url,
            original: photo.original || photo.url
          };
        }
        return photo;
      });
      allImages = [...allImages, ...mediaPhotos];
    }
    
    return allImages;
  };

  // Get the main image (first available image from any source)
  const getMainImage = () => {
    const allImages = getAllImages();
    return allImages.length > 0 ? normalizeImage(allImages[0]) : 
           'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
  };

  // Get total image count from all sources
  const getTotalImageCount = () => {
    let count = 0;
    
    // Count legacy images
    if (images && Array.isArray(images)) {
      count += images.length;
    }
    
    // Count new media photos
    if (media && media.photos && Array.isArray(media.photos)) {
      count += media.photos.length;
    }
    
    return count;
  };

  const mainImage = getMainImage();
  const totalImageCount = getTotalImageCount();
  
  // More robust status lookup with case-insensitive matching
  const getStatusInfo = (statusValue) => {
    if (!statusValue) return statusConfig.draft;
    
    // Try exact match first
    if (statusConfig[statusValue]) return statusConfig[statusValue];
    
    // Try case-insensitive match
    const lowercaseStatus = statusValue.toLowerCase();
    if (statusConfig[lowercaseStatus]) return statusConfig[lowercaseStatus];
    
    // Try capitalize first letter
    const capitalizedStatus = statusValue.charAt(0).toUpperCase() + statusValue.slice(1).toLowerCase();
    if (statusConfig[capitalizedStatus]) return statusConfig[capitalizedStatus];
    
    // Default to draft if no match found
    console.warn('Unknown property status:', statusValue, 'defaulting to draft');
    return statusConfig.draft;
  };
  
  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;
  const planInfo = planConfig[planType] || planConfig.free;

  // Calculate quality score
  const calculateQualityScore = () => {
    let score = 0;
    const maxScore = 100;
    
    // Photos (30 points) - use total image count from both sources
    const photoCount = totalImageCount;
    if (photoCount >= 10) score += 30;
    else if (photoCount >= 5) score += 25;
    else if (photoCount >= 3) score += 20;
    else if (photoCount >= 1) score += 10;
    
    // Description (25 points)
    const descLength = description?.length || 0;
    if (descLength >= 500) score += 25;
    else if (descLength >= 300) score += 20;
    else if (descLength >= 100) score += 15;
    else if (descLength >= 50) score += 10;
    
    // Price information (15 points)
    if (price && priceValue) score += 15;
    
    // Amenities (15 points)
    const amenityCount = property.amenities?.length || 0;
    if (amenityCount >= 10) score += 15;
    else if (amenityCount >= 5) score += 12;
    else if (amenityCount >= 3) score += 8;
    else if (amenityCount >= 1) score += 5;
    
    // Key highlights (10 points)
    const highlightCount = keyHighlights?.length || 0;
    if (highlightCount >= 5) score += 10;
    else if (highlightCount >= 3) score += 7;
    else if (highlightCount >= 1) score += 5;
    
    // Furnishing status (5 points)
    if (furnishing && furnishing !== 'Unfurnished') score += 5;
    
    return Math.min(score, maxScore);
  };

  const qualityScore = calculateQualityScore();

  // Get quality color
  const getQualityColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAction = async (action) => {
    setShowActionsMenu(false);
    
    try {
      switch (action) {
        case 'edit':
          onEdit?.(property);
          break;
        case 'full-edit':
          onFullEdit?.(property);
          break;
        case 'edit-photos':
          onEditPhotos?.(property);
          break;
        case 'toggle-status':
          setStatusDialogAction('toggle-status');
          setStatusDialogOpen(true);
          break;
        case 'mark-sold':
          setStatusDialogAction('mark-sold');
          setStatusDialogOpen(true);
          break;
        case 'renew':
          setStatusDialogAction('renew');
          setStatusDialogOpen(true);
          break;
        case 'analytics':
          onAnalytics?.(property);
          break;
        case 'boost':
          onBoost?.(property);
          break;
        case 'duplicate':
          onDuplicate?.(property);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this property?')) {
            onDelete?.(property);
          }
          break;
        case 'view-public':
          onViewPublic?.(property);
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error('Action failed: ' + error.message);
    }
  };

  // Handle status dialog confirm
  const handleStatusConfirm = async (data) => {
    try {
      switch (statusDialogAction) {
        case 'toggle-status':
          await onChangeStatus?.(property, data.status);
          break;
        case 'mark-sold':
          await onMarkSold?.(property, data);
          break;
        case 'renew':
          await onRenew?.(property, data);
          break;
      }
      setStatusDialogOpen(false);
      setStatusDialogAction(null);
    } catch (error) {
      throw error;
    }
  };

  const calculateTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'grid') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-lg ${
        isSelected ? 'border-blue-500' : 'border-gray-200'
      }`}>
        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect?.(property.id, e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Image Section */}
        <div className="relative aspect-video">
          <img
            src={mainImage}
            alt={type}
            className="w-full h-full object-cover rounded-t-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {isFeatured && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star size={12} fill="currentColor" />
                Featured
              </span>
            )}
            <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${statusInfo.color}`}>
              <StatusIcon size={12} />
              {statusInfo.label}
            </span>
          </div>

          {/* Image Count - Updated to use totalImageCount */}
          {totalImageCount > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <Camera size={12} />
              {totalImageCount}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {buildingName && <span className="text-sm text-gray-500 block">{buildingName}</span>}
                {type}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                <MapPin size={14} />
                <span className="truncate">{location}</span>
              </div>
            </div>
            
            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={16} />
              </button>
              
              {showActionsMenu && (
                <PropertyActionsMenu onAction={handleAction} />
              )}
            </div>
          </div>

          {/* Price and Basic Info */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <span className="text-xl font-bold text-blue-600 block">{formatPrice(price, null, priceValue)}</span>
              <span className="text-xs text-gray-500">Price</span>
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-800 block">{bhk} BHK</span>
              <span className="text-xs text-gray-500">sq.ft</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-200 pt-3 mb-3">
            <div>
              <span className="text-lg font-bold text-gray-800 block">{viewsLast30Days}</span>
              <span className="text-xs text-gray-500">Views (30d)</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-800 block">{leadsLast30Days}</span>
              <span className="text-xs text-gray-500">Leads (30d)</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-800 block">{shortlistsCount}</span>
              <span className="text-xs text-gray-500">Saved</span>
            </div>
          </div>

          {/* Plan, Quality Score and Dates */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full ${planInfo.color}`}>
                {planInfo.label}
              </span>
              <button
                onClick={() => onAnalytics?.(property)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${
                  qualityScore >= 80 
                    ? 'bg-green-100 text-green-700'
                    : qualityScore >= 60
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <Award size={12} />
                {qualityScore}%
              </button>
            </div>
            <div className="text-right">
              <div>Listed: {formatDate(createdAt)}</div>
              <div>Updated: {calculateTimeAgo(updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-lg ${
      isSelected ? 'border-blue-500' : 'border-gray-200'
    }`}>
      <div className="flex items-center p-4 gap-4">
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect?.(property.id, e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
        />

        {/* Thumbnail */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <img
            src={mainImage}
            alt={type}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/80x80/e2e8f0/64748b?text=No+Image';
            }}
          />
          {totalImageCount > 1 && (
            <div className="absolute -bottom-1 -right-1 bg-black/60 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Camera size={10} />
              {totalImageCount}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {buildingName && (
                  <span className="text-sm text-gray-500">
                    {buildingName}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900 truncate">{type}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                  <StatusIcon size={12} />
                  {statusInfo.label}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                <MapPin size={14} />
                <span className="truncate">{location}</span>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-blue-600">{formatPrice(price, null, priceValue)}</span>
                  <div className="text-gray-500">Price</div>
                </div>
                <div>
                  <span className="font-semibold">{bhk} BHK</span>
                  <div className="text-gray-500">sq.ft</div>
                </div>
                <div>
                  <span className="font-semibold">{bathrooms || 1} Bath</span>
                  <div className="text-gray-500">Bathrooms</div>
                </div>
                <div>
                  <span className="font-semibold">{viewsLast30Days}</span>
                  <div className="text-gray-500">Views (30d)</div>
                </div>
              </div>

              {/* Meta Info and Quality Score */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className={`px-2 py-1 rounded-full ${planInfo.color}`}>
                    {planInfo.label}
                  </span>
                  <span>Listed: {formatDate(createdAt)}</span>
                  <span>Updated: {calculateTimeAgo(updatedAt)}</span>
                </div>
                
                <button
                  onClick={() => onAnalytics?.(property)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${
                    qualityScore >= 80 
                      ? 'bg-green-100 text-green-700'
                      : qualityScore >= 60
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  <Award size={12} />
                  {qualityScore}%
                </button>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              
              {showActionsMenu && (
                <PropertyActionsMenu onAction={handleAction} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Dialog */}
      <StatusChangeDialog
        isOpen={statusDialogOpen}
        onClose={() => {
          setStatusDialogOpen(false);
          setStatusDialogAction(null);
        }}
        onConfirm={handleStatusConfirm}
        property={property}
        action={statusDialogAction}
        currentStatus={status}
      />
    </div>
  );
}

// Separate component for the actions menu
function PropertyActionsMenu({ onAction }) {
  const menuItems = [
    { key: 'full-edit', label: 'Edit Property (Full)', icon: Edit, description: 'Complete editing with all features' },
    { key: 'edit', label: 'Quick Edit (Modal)', icon: Edit3, description: 'Basic details only' },
    { key: 'edit-photos', label: 'Edit photos & media', icon: Upload },
    { key: 'toggle-status', label: 'Change status', icon: Settings },
    { key: 'mark-sold', label: 'Mark as Sold / Rented', icon: Check },
    { key: 'renew', label: 'Renew / Relist', icon: RefreshCw },
    { key: 'analytics', label: 'View analytics', icon: BarChart3 },
    { key: 'boost', label: 'Boost / Upgrade plan', icon: Star },
    { key: 'duplicate', label: 'Duplicate listing', icon: Copy },
    { key: 'view-public', label: 'View listing (public page)', icon: ExternalLink },
    { key: 'delete', label: 'Delete (archive)', icon: Trash2 }
  ];

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {menuItems.map(item => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => onAction(item.key)}
            className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              item.key === 'full-edit' ? 'bg-blue-50 border-b border-blue-200' : ''
            }`}
          >
            <IconComponent size={16} className={item.key === 'full-edit' ? 'text-blue-600 mt-0.5' : 'text-gray-400 mt-0.5'} />
            <div className="flex-1">
              <span className={`text-sm font-medium ${item.key === 'full-edit' ? 'text-blue-900' : 'text-gray-700'}`}>
                {item.label}
              </span>
              {item.description && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
