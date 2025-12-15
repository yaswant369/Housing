import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// Initial state for search
const initialSearchState = {
  // Search query
  searchQuery: '',
  location: '',
  
  // Property filters
  listingType: 'buy', // buy, rent, commercial, pg
  propertyTypes: [], // Apartment, Villa, Plot, etc.
  bhkTypes: [], // 1, 2, 3, 4, 5+
  furnishing: [], // Furnished, Semi-Furnished, Unfurnished
  constructionStatus: [], // Ready to Move, Under Construction
  sellerTypes: [], // Owner, Broker, Builder
    
  // Budget filters
  priceRange: {
    min: null,
    max: null,
    predefined: null // 0-25L, 25-50L, etc.
  },
   
  // Area filters
  areaRange: {
    min: null,
    max: null
  },
   
  // Amenities
  amenities: [], // Swimming Pool, Gym, Parking, etc.
    
  // Availability
  availability: [], // Immediate, Within 3 months, Within 6 months
  
  // View and sorting
  viewMode: 'grid', // grid, list
  sortBy: 'relevance', // newest, price_low_high, price_high_low, area, relevance
  
  // Pagination
  currentPage: 1,
  pageSize: 12,
  
  // UI state
  showFilters: false,
  isLoading: false,
  
  // Results
  totalResults: 0,
  filteredProperties: [],
  savedPropertyIds: new Set(),
  comparedProperties: []
};

// Action types
const SEARCH_ACTIONS = {
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_LOCATION: 'SET_LOCATION',
  SET_LISTING_TYPE: 'SET_LISTING_TYPE',
  SET_PROPERTY_TYPES: 'SET_PROPERTY_TYPES',
  SET_BHK_TYPES: 'SET_BHK_TYPES',
  SET_FURNISHING: 'SET_FURNISHING',
  SET_CONSTRUCTION_STATUS: 'SET_CONSTRUCTION_STATUS',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_AREA_RANGE: 'SET_AREA_RANGE',
  SET_AMENITIES: 'SET_AMENITIES',
  SET_SELLER_TYPES: 'SET_SELLER_TYPES',
  SET_AVAILABILITY: 'SET_AVAILABILITY',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  SET_SORT_BY: 'SET_SORT_BY',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
  TOGGLE_FILTERS: 'TOGGLE_FILTERS',
  SET_LOADING: 'SET_LOADING',
  SET_RESULTS: 'SET_RESULTS',
  RESET_FILTERS: 'RESET_FILTERS',
  TOGGLE_SAVED_PROPERTY: 'TOGGLE_SAVED_PROPERTY',
  ADD_TO_COMPARISON: 'ADD_TO_COMPARISON',
  REMOVE_FROM_COMPARISON: 'REMOVE_FROM_COMPARISON',
  CLEAR_COMPARISON: 'CLEAR_COMPARISON'
};

// Reducer function
function searchReducer(state, action) {
  switch (action.type) {
    case SEARCH_ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case SEARCH_ACTIONS.SET_LOCATION:
      return { ...state, location: action.payload };
    
    case SEARCH_ACTIONS.SET_LISTING_TYPE:
      return { ...state, listingType: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.SET_PROPERTY_TYPES:
      return { ...state, propertyTypes: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.SET_BHK_TYPES:
      return { ...state, bhkTypes: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.SET_FURNISHING:
      return { ...state, furnishing: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.SET_CONSTRUCTION_STATUS:
      return { ...state, constructionStatus: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.SET_PRICE_RANGE:
      return { 
        ...state, 
        priceRange: { ...state.priceRange, ...action.payload },
        currentPage: 1 
      };
    
    case SEARCH_ACTIONS.SET_AREA_RANGE:
      return { 
        ...state, 
        areaRange: { ...state.areaRange, ...action.payload },
        currentPage: 1 
      };
    
    case SEARCH_ACTIONS.SET_AMENITIES:
      return { ...state, amenities: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.SET_SELLER_TYPES:
      return { ...state, sellerTypes: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.SET_AVAILABILITY:
      return { ...state, availability: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };
    
    case SEARCH_ACTIONS.SET_SORT_BY:
      return { ...state, sortBy: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    
    case SEARCH_ACTIONS.SET_PAGE_SIZE:
      return { ...state, pageSize: action.payload, currentPage: 1 };
    
    case SEARCH_ACTIONS.TOGGLE_FILTERS:
      return { ...state, showFilters: !state.showFilters };
    
    case SEARCH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case SEARCH_ACTIONS.SET_RESULTS:
      return { 
        ...state, 
        filteredProperties: action.payload.properties,
        totalResults: action.payload.totalCount,
        isLoading: false 
      };
    
    case SEARCH_ACTIONS.RESET_FILTERS:
      return { 
        ...state,
        ...initialSearchState,
        savedPropertyIds: state.savedPropertyIds,
        comparedProperties: state.comparedProperties
      };
    
    case SEARCH_ACTIONS.TOGGLE_SAVED_PROPERTY:
      return {
        ...state,
        savedPropertyIds: new Set(
          action.payload
            ? [...state.savedPropertyIds, action.propertyId]
            : [...state.savedPropertyIds].filter(id => id !== action.propertyId)
        )
      };
    
    case SEARCH_ACTIONS.ADD_TO_COMPARISON:
      if (state.comparedProperties.length >= 4) return state;
      if (state.comparedProperties.some(p => p.id === action.payload.id)) return state;
      return {
        ...state,
        comparedProperties: [...state.comparedProperties, action.payload]
      };
    
    case SEARCH_ACTIONS.REMOVE_FROM_COMPARISON:
      return {
        ...state,
        comparedProperties: state.comparedProperties.filter(p => p.id !== action.payload)
      };
    
    case SEARCH_ACTIONS.CLEAR_COMPARISON:
      return {
        ...state,
        comparedProperties: []
      };
    
    default:
      return state;
  }
}

// Create context
const SearchContext = createContext();

// Context provider component
export function SearchProvider({ children }) {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  // Action creators
  const actions = {
    setSearchQuery: useCallback((query) => 
      dispatch({ type: SEARCH_ACTIONS.SET_SEARCH_QUERY, payload: query }), []
    ),
    
    setLocation: useCallback((location) => 
      dispatch({ type: SEARCH_ACTIONS.SET_LOCATION, payload: location }), []
    ),
    
    setListingType: useCallback((type) => 
      dispatch({ type: SEARCH_ACTIONS.SET_LISTING_TYPE, payload: type }), []
    ),
    
    setPropertyTypes: useCallback((types) => 
      dispatch({ type: SEARCH_ACTIONS.SET_PROPERTY_TYPES, payload: types }), []
    ),
    
    setBHKTypes: useCallback((types) => 
      dispatch({ type: SEARCH_ACTIONS.SET_BHK_TYPES, payload: types }), []
    ),
    
    setFurnishing: useCallback((furnishing) => 
      dispatch({ type: SEARCH_ACTIONS.SET_FURNISHING, payload: furnishing }), []
    ),
    
    setConstructionStatus: useCallback((status) =>
      dispatch({ type: SEARCH_ACTIONS.SET_CONSTRUCTION_STATUS, payload: status }), []
    ),
     
    setSellerTypes: useCallback((types) =>
      dispatch({ type: SEARCH_ACTIONS.SET_SELLER_TYPES, payload: types }), []
    ),
     
    setPriceRange: useCallback((range) =>
      dispatch({ type: SEARCH_ACTIONS.SET_PRICE_RANGE, payload: range }), []
    ),
    
    setAreaRange: useCallback((range) => 
      dispatch({ type: SEARCH_ACTIONS.SET_AREA_RANGE, payload: range }), []
    ),
    
    setAmenities: useCallback((amenities) => 
      dispatch({ type: SEARCH_ACTIONS.SET_AMENITIES, payload: amenities }), []
    ),
    
    setAvailability: useCallback((availability) =>
      dispatch({ type: SEARCH_ACTIONS.SET_AVAILABILITY, payload: availability }), []
    ),
    
    setViewMode: useCallback((mode) => 
      dispatch({ type: SEARCH_ACTIONS.SET_VIEW_MODE, payload: mode }), []
    ),
    
    setSortBy: useCallback((sortBy) => 
      dispatch({ type: SEARCH_ACTIONS.SET_SORT_BY, payload: sortBy }), []
    ),
    
    setCurrentPage: useCallback((page) => 
      dispatch({ type: SEARCH_ACTIONS.SET_CURRENT_PAGE, payload: page }), []
    ),
    
    setPageSize: useCallback((size) => 
      dispatch({ type: SEARCH_ACTIONS.SET_PAGE_SIZE, payload: size }), []
    ),
    
    toggleFilters: useCallback(() => 
      dispatch({ type: SEARCH_ACTIONS.TOGGLE_FILTERS }), []
    ),
    
    setLoading: useCallback((loading) => 
      dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: loading }), []
    ),
    
    setResults: useCallback((results) => 
      dispatch({ type: SEARCH_ACTIONS.SET_RESULTS, payload: results }), []
    ),
    
    resetFilters: useCallback(() => 
      dispatch({ type: SEARCH_ACTIONS.RESET_FILTERS }), []
    ),
    
    toggleSavedProperty: useCallback((propertyId) => {
      const isSaved = state.savedPropertyIds.has(propertyId);
      dispatch({ 
        type: SEARCH_ACTIONS.TOGGLE_SAVED_PROPERTY, 
        payload: !isSaved, 
        propertyId 
      });
    }, [state.savedPropertyIds]),
    
    addToComparison: useCallback((property) => 
      dispatch({ type: SEARCH_ACTIONS.ADD_TO_COMPARISON, payload: property }), []
    ),
    
    removeFromComparison: useCallback((propertyId) => 
      dispatch({ type: SEARCH_ACTIONS.REMOVE_FROM_COMPARISON, payload: propertyId }), []
    ),
    
    clearComparison: useCallback(() => 
      dispatch({ type: SEARCH_ACTIONS.CLEAR_COMPARISON }), []
    )
  };

  // Computed values
  const computedValues = useMemo(() => ({
    hasActiveFilters: Boolean(
      state.searchQuery ||
      state.location ||
      state.propertyTypes.length > 0 ||
      state.bhkTypes.length > 0 ||
      state.furnishing.length > 0 ||
      state.constructionStatus.length > 0 ||
      state.priceRange.min || state.priceRange.max || state.priceRange.predefined ||
      state.areaRange.min || state.areaRange.max ||
      state.amenities.length > 0 ||
      state.sellerTypes.length > 0 ||
      state.availability.length > 0
    ),
    
    activeFiltersCount: [
      state.propertyTypes.length,
      state.bhkTypes.length,
      state.furnishing.length,
      state.constructionStatus.length,
      state.sellerTypes.length,
      state.amenities.length,
      state.availability.length,
      (state.priceRange.min || state.priceRange.max || state.priceRange.predefined) ? 1 : 0,
      (state.areaRange.min || state.areaRange.max) ? 1 : 0
    ].reduce((sum, count) => sum + (count > 0 ? 1 : 0), 0),
    
    canLoadMore: state.currentPage * state.pageSize < state.totalResults,
    
    isEmpty: !state.isLoading && state.filteredProperties.length === 0
  }), [state]);

  const value = useMemo(() => ({
    ...state,
    ...actions,
    ...computedValues
  }), [state, actions, computedValues]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use search context
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export default SearchContext;
