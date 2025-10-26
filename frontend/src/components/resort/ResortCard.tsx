import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { ResortCardProps } from '../../types';
import { LazyImage } from '../LazyImage';
import './ResortCard.css';

export function ResortCard({ resort, className = '', loading = false, onBook, onViewDetails }: ResortCardProps) {
  if (loading) {
    return (
      <div className={`resort-card resort-card-loading ${className}`}>
        <div className="resort-card-image-skeleton"></div>
        <div className="resort-card-content-skeleton">
          <div className="resort-card-title-skeleton"></div>
          <div className="resort-card-location-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/resorts/${resort.id}`} className={`resort-card-link ${className}`}>
      <div className="resort-card">
        {/* Image */}
        <div className="resort-card-image-container">
          <LazyImage
            src={resort.hero_image_url || resort.hero_image || '/images/resort-placeholder.jpg'}
            alt={resort.name}
            className="resort-card-image"
          />
          
          {/* Star Rating Badge */}
          <div className="resort-card-rating-badge">
            <StarIconSolid className="resort-card-rating-icon" />
            <span className="resort-card-rating-text">{resort.star_rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="resort-card-content">
          <h3 className="resort-card-title">
            {resort.name}
          </h3>
          
          <div className="resort-card-location">
            <MapPinIcon className="resort-card-location-icon" />
            <span className="resort-card-location-text">
              {resort.full_location || `${resort.island_name}, ${resort.atoll}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}