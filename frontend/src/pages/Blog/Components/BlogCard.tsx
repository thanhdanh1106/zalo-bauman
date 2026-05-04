import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaEye, FaComments, FaBeer } from 'react-icons/fa';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  published_at: string;
  views_count?: number;
  comments_count?: number;
  category?: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
}

interface BlogCardProps {
  data: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

const BlogCard: React.FC<BlogCardProps> = ({ data, variant = 'default' }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="flex">
          {data.featured_image && (
            <div className="w-32 h-24 flex-shrink-0">
              <img
                src={data.featured_image}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              <Link
                to={`/blog/${data.slug}`}
                className="hover:text-amber-600 transition-colors"
              >
                {data.title}
              </Link>
            </h3>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center">
                <FaCalendarAlt className="mr-1" />
                {formatDate(data.published_at)}
              </span>
              {data.views_count && (
                <span className="flex items-center">
                  <FaEye className="mr-1" />
                  {data.views_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        {data.featured_image && (
          <div className="relative h-64">
            <img
              src={data.featured_image}
              alt={data.title}
              className="w-full h-full object-cover"
            />
            {data.category && (
              <div className="absolute top-4 left-4">
                <Link
                  to={`/blog/category/${data.category.slug}`}
                  className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  {data.category.name}
                </Link>
              </div>
            )}
          </div>
        )}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            <Link
              to={`/blog/${data.slug}`}
              className="hover:text-amber-600 transition-colors"
            >
              {data.title}
            </Link>
          </h2>
          {data.excerpt && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {truncateText(data.excerpt, 150)}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {data.author && (
                <span className="flex items-center">
                  <FaUser className="mr-1" />
                  {data.author.name}
                </span>
              )}
              <span className="flex items-center">
                <FaCalendarAlt className="mr-1" />
                {formatDate(data.published_at)}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              {data.views_count && (
                <span className="flex items-center">
                  <FaEye className="mr-1" />
                  {data.views_count}
                </span>
              )}
              {data.comments_count && (
                <span className="flex items-center">
                  <FaComments className="mr-1" />
                  {data.comments_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {data.featured_image && (
        <div className="relative h-48">
          <img
            src={data.featured_image}
            alt={data.title}
            className="w-full h-full object-cover"
          />
          {data.category && (
            <div className="absolute top-3 left-3">
              <Link
                to={`/blog/category/${data.category.slug}`}
                className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-amber-600 transition-colors"
              >
                {data.category.name}
              </Link>
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link
            to={`/blog/${data.slug}`}
            className="hover:text-amber-600 transition-colors"
          >
            {data.title}
          </Link>
        </h3>
        {data.excerpt && (
          <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-3">
            {truncateText(data.excerpt, 120)}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {data.author && (
              <span className="flex items-center">
                <FaUser className="mr-1" />
                {data.author.name}
              </span>
            )}
            <span className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              {formatDate(data.published_at)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {data.views_count && (
              <span className="flex items-center">
                <FaEye className="mr-1" />
                {data.views_count}
              </span>
            )}
            {data.comments_count && (
              <span className="flex items-center">
                <FaComments className="mr-1" />
                {data.comments_count}
              </span>
            )}
          </div>
        </div>
        {data.tags && data.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {data.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.slug}
                to={`/blog/tag/${tag.slug}`}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs hover:bg-amber-100 hover:text-amber-700 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;

