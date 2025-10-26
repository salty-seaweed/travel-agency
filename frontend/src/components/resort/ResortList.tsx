import React from 'react';
import { ResortListProps } from '../../types';
import { ResortCard } from './ResortCard';
import { LoadingSpinner } from '../LoadingSpinner';
import './ResortList.css';

export function ResortList({ resorts, loading = false, onResortClick, onBookResort }: ResortListProps) {
  if (loading) {
    return (
      <div className="resort-list-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (resorts.length === 0) {
    return (
      <div className="resort-list-empty">
        <h3 className="resort-list-empty-title">No properties found</h3>
        <p className="resort-list-empty-description">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="resort-list-grid">
      {resorts.map((resort) => (
        <ResortCard
          key={resort.id}
          resort={resort}
          onBook={onBookResort ? () => onBookResort(resort) : undefined}
          onViewDetails={onResortClick ? () => onResortClick(resort) : undefined}
        />
      ))}
    </div>
  );
}