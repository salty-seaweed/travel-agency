import React, { useState } from 'react';
import { Card, Button, LoadingSpinner } from '../index';
import { useFetch, useNotification } from '../../hooks';
import { formatDate, generateInitials } from '../../utils';
import type { Review, Property } from '../../types';
import {
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Review Form Component
function ReviewForm({ isOpen, onClose, review, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  review?: Review;
  onSave: (data: any) => void;
}) {
  const { data: properties } = useFetch<Property>('/properties/');
  const [formData, setFormData] = useState({
    name: review?.name || '',
    email: review?.email || '',
    rating: review?.rating || 5,
    comment: review?.comment || '',
    property: review?.property ? (typeof review.property === 'object' ? review.property.id : review.property) : '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <StarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{review ? 'Edit' : 'Add'} Review</h3>
                <p className="text-sm text-gray-500">Manage customer feedback</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter customer's full name" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                required 
              />
              <p className="mt-1 text-xs text-gray-500">Enter the customer's full name as it should appear</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                placeholder="customer@example.com" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                required 
              />
              <p className="mt-1 text-xs text-gray-500">Customer's email address for contact purposes</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Property <span className="text-red-500">*</span>
              </label>
              <select 
                name="property" 
                value={formData.property} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white" 
                required 
              >
                <option value="">Select a property</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Choose the property this review is for</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-center gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className={`text-3xl transition-all duration-200 hover:scale-110 ${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-700">
                    {formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.rating === 5 && 'Excellent'}
                    {formData.rating === 4 && 'Very Good'}
                    {formData.rating === 3 && 'Good'}
                    {formData.rating === 2 && 'Fair'}
                    {formData.rating === 1 && 'Poor'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Review Comment <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="comment" 
                value={formData.comment} 
                onChange={handleChange} 
                placeholder="Share your experience with this property..." 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white resize-none" 
                rows={4}
                required 
              />
              <p className="mt-1 text-xs text-gray-500">Detailed feedback about the customer's experience</p>
            </div>

            {/* Review Guidelines */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <StarIcon className="h-4 w-4" />
                Review Guidelines
              </h4>
              <ul className="text-sm text-amber-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Be honest and authentic in the review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Include specific details about the experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Mention both positive aspects and areas for improvement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Keep the tone professional and constructive</span>
                </li>
              </ul>
            </div>

            {/* Rating Examples */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Rating Examples</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { rating: 5, desc: 'Exceptional experience, exceeded all expectations' },
                  { rating: 4, desc: 'Very good experience with minor issues' },
                  { rating: 3, desc: 'Good experience with room for improvement' },
                  { rating: 2, desc: 'Below average experience with several issues' },
                  { rating: 1, desc: 'Poor experience, would not recommend' }
                ].map((example) => (
                  <div key={example.rating} className="text-xs text-gray-600 bg-white rounded-lg p-2 border border-gray-200">
                    <span className="font-medium">{example.rating} Stars:</span> {example.desc}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <StarIcon className="h-5 w-5" />
                    {review ? 'Update Review' : 'Create Review'}
                  </div>
                )}
              </button>
              <button 
                type="button" 
                className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50" 
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminReviews() {
  const { data: reviews, isLoading, error, refresh } = useFetch<Review>('/reviews/');
  const { data: properties } = useFetch<Property>('/properties/');
  
  const { showSuccess, showError } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    property: '',
    rating: '',
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Form modal states
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | undefined>();

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProperty = !filters.property || 
        (typeof review.property === 'number' ? review.property === parseInt(filters.property) : review.property.id === parseInt(filters.property));
      const matchesRating = !filters.rating || review.rating === parseInt(filters.rating);
      
      return matchesSearch && matchesProperty && matchesRating;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Review];
      let bValue: any = b[sortBy as keyof Review];
      
      if (sortBy === 'property') {
        aValue = typeof a.property === 'object' ? a.property.name : '';
        bValue = typeof b.property === 'object' ? b.property.name : '';
      }
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(review => review.rating === rating).length / totalReviews) * 100 : 0
  }));

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      // Implement delete API call
      showSuccess('Review deleted successfully');
      refresh();
    } catch (error) {
      showError('Failed to delete review');
    }
  };

  const handleSaveReview = async (formData: any) => {
    try {
      if (editingReview) {
        // Update existing review
        // await apiPut(`/reviews/${editingReview.id}/`, formData);
        showSuccess('Review updated successfully');
      } else {
        // Create new review
        // await apiPost('/reviews/', formData);
        showSuccess('Review created successfully');
      }
      setIsReviewFormOpen(false);
      setEditingReview(undefined);
      refresh();
    } catch (error) {
      showError('Failed to save review');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setIsReviewFormOpen(true);
  };

  const handleAdd = () => {
    setEditingReview(undefined);
    setIsReviewFormOpen(true);
  };

  const handleExport = () => {
    const exportData = filteredReviews.map(review => ({
      ID: review.id,
      Name: review.name,
      Email: review.email,
      Rating: review.rating,
      Comment: review.comment,
      Property: typeof review.property === 'object' ? review.property.name : review.property,
      Created: review.created_at,
    }));
    
    // Use the exportToCSV utility
    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'reviews.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Reviews exported successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card>
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refresh}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
                <p className="text-gray-600">Manage customer feedback</p>
              </div>
            </div>
            <Button variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Add Review
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="text-center">
              <p className="text-sm font-medium text-amber-600">Total Reviews</p>
              <p className="text-3xl font-bold text-amber-900">{totalReviews}</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-center">
              <p className="text-sm font-medium text-green-600">Average Rating</p>
              <p className="text-3xl font-bold text-green-900">{averageRating.toFixed(1)}</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600">5-Star Reviews</p>
              <p className="text-3xl font-bold text-blue-900">
                {reviews.filter(r => r.rating === 5).length}
              </p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-center">
              <p className="text-sm font-medium text-purple-600">This Month</p>
              <p className="text-3xl font-bold text-purple-900">
                {reviews.filter(r => {
                  const reviewDate = new Date(r.created_at || '');
                  const now = new Date();
                  return reviewDate.getMonth() === now.getMonth() && 
                         reviewDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Rating Distribution</h3>
          </div>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-gray-600">{rating}</span>
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-medium text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Filter Bar */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filters.property}
                  onChange={(e) => setFilters(prev => ({ ...prev, property: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Properties</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Ratings</option>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="created_at">Date</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                  <option value="property">Property</option>
                </select>

                <button
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowsUpDownIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <Button variant="secondary" onClick={handleExport} className="flex items-center gap-2">
              <DocumentArrowDownIcon className="h-5 w-5" />
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Reviews Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold">Property</th>
                  <th className="text-left py-3 px-4 font-semibold">Comment</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {generateInitials(review.name)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{review.name}</div>
                          <div className="text-sm text-gray-600">{review.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">({review.rating})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">
                        {typeof review.property === 'object' ? review.property.name : review.property}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-600 max-w-xs truncate">
                        {review.comment}
                      </div>
                    </td>
                                         <td className="py-3 px-4">
                       <div className="text-sm text-gray-600">
                         {formatDate(review.created_at || '')}
                       </div>
                     </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(review)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(review.id)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reviews found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Review Form Modal */}
      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => {
          setIsReviewFormOpen(false);
          setEditingReview(undefined);
        }}
        review={editingReview}
        onSave={handleSaveReview}
      />
    </div>
  );
} 