// src/components/properties/PropertiesSectionSkeleton.jsx
import React from 'react';
import SkeletonCard from '../SkeletonCard'; // Make sure SkeletonCard is in src/components/

export default function PropertiesSectionSkeleton({ title }) {
  return (
    <section className="p-4 sm:p-6 mt-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </section>
  );
}