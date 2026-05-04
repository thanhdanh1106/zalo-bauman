import { getThumbnailUrl } from '@shared/utils/Hooks';
import dayjs from 'dayjs';
import React from 'react';
import { FaCalendarAlt, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

interface BlogBannerProps {
  data: BlogPost;
}

const BlogBanner: React.FC<BlogBannerProps> = ({ data }) => {
  return (
    <div className="bg-gray-50 relative rounded-[35px] overflow-hidden border h-[500px] border-slate-200   shadow-md duration-300 ease-in-out">
      {data?.featured_image ? (
        <img
          className="mb-4 object-cover absolute h-full w-full"
          src={
            getThumbnailUrl(data?.featured_image)}
          alt={`[Ảnh của ${data?.title}]`}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.onerror = null;
            img.src =
              'https://placehold.co/800x500/E2E8F0/FF0000?text=L%E1%BB%97i+t%E1%BA%A3i+ảnh';
          }}
        />
      ) : (
        <div className="absolute h-full w-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500"></div>
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/55"></div>
      <div className="absolute z-2 max-w-3xl bottom-0 p-[35px]">
        <div className="mb-4">
          <Link to={`/blog/${data.slug}`}>
            <h3 className="lg:text-5xl text-3xl font-semibold text-gray-200 mb-2 line-clamp-2">
              {data?.title}
            </h3>
          </Link>
          <p className="text-base text-gray-300 line-clamp-2">
            {data?.excerpt}
          </p>
        </div>
        <div className="flex mb-5 items-center gap-5">
          <div className="flex items-center gap-2">
            {data?.author?.avatar ? (
              <img
                src={getThumbnailUrl(data?.author?.avatar)}
                alt={data?.author?.name || ''}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-400"></div>
            )}
            <span className="text-sm text-gray-200">
              {data?.author?.name || 'Admin'}
            </span>
          </div>

          <div className="flex flex-wrap text-gray-300 text-xs gap-4 mb-2">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-sm" />
              <span>{dayjs(data.published_at).format('DD/MM/YYYY')}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaComments className="text-sm" />
              <span>{data.comments_count || 0} comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogBanner;


