import { postProps } from '@shared/types/post';
import { getThumbnailUrl } from '@shared/utils/Hooks';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface BlogListProps {
  title?: string | ReactNode;
  subtitle?: string;
  posts: postProps[];
  columns?: 1 | 2 | 3 | 4;
  showViewAll?: boolean;
  viewAllText?: string;
  onViewAll?: () => void;
  className?: string;
  isLoading?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  title,
  subtitle,
  posts,
  columns = 3,
  showViewAll = true,
  viewAllText = 'Xem Tất Cả Bài Viết',
  onViewAll,
  className = '',
  isLoading = false,
}) => {
  const getGridColumns = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-3';
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log('View all posts');
    }
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-primary font-serif mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Posts Grid */}
        <div className={`grid ${getGridColumns()} gap-8`}>
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: columns * 2 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="border border-[#eee] rounded-lg overflow-hidden">
                  <div className="aspect-[16/10] bg-surface border border-[#eee]"></div>
                  <div className="p-6">
                    <div className="h-5 bg-surface border border-[#eee] rounded mb-2"></div>
                    <div className="h-4 bg-surface border border-[#eee] rounded mb-1"></div>
                    <div className="h-4 bg-surface border border-[#eee] rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-surface border border-[#eee] rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group border border-[#eee] rounded-lg overflow-hidden hover:border-[#cbb27c] transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={
                      typeof post.thumbnail === 'string'
                        ? post.thumbnail
                        : getThumbnailUrl(post.thumbnail) ||
                          '/api/placeholder/400/250'
                    }
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-primary font-serif mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {post.description || ''}
                  </p>
                  <div className="text-primary text-sm font-medium">
                    Đọc thêm →
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                Không có bài viết nào để hiển thị
              </p>
            </div>
          )}
        </div>

        {/* View All Button */}
        {showViewAll && posts.length > 0 && !isLoading && (
          <div className="text-center mt-12">
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 border border-[#cbb27c] text-primary hover:bg-primary hover:text-[#181a1b] px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              {viewAllText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;


