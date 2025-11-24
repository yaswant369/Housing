import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import FilterModal from '../features/FilterModal';

export default function FilterPage() {
  const { filters, handleFilterChange } = useContext(AppContext);
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onApplyFilters = (newFilters) => {
    handleFilterChange(newFilters);
    navigate('/'); // Navigate to home after applying filters
  };

  return <FilterModal onApplyFilters={onApplyFilters} currentFilters={filters} />;
}
