import { metaProps } from "@shared/types/meta";
import { postProps } from "@shared/types/post";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { findManyPosts } from "@shared/utils/Posts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
dayjs.extend(relativeTime);
type Props = {};

const TrendingPosts: React.FC = () => {
  const [data, setData] = useState<postProps[]>([]);

  async function handleFindManyBlogs() {
    const response: {
      meta: metaProps;
      data: postProps[];
      error: boolean;
    } = await findManyPosts({
      is_featured: 1,
      per_page: 6,
    });

    if (response && !response.error) {
      const { meta, data } = response;
      setData(data);
    }
  }

  useEffect(() => {
    handleFindManyBlogs();
  }, []);

  return (
    <div className="flex flex-col gap-stack-md">
      {Array.isArray(data) && data.length ? (
        data.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="flex gap-4 bg-surface-container-lowest p-3 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-surface-variant active:scale-[0.98] transition-transform"
          >
            <img
              src={getThumbnailUrl(post?.thumbnail)}
              alt={post.title}
              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src = "https://placehold.co/80x60/2a2d2e/cbb27c?text=📝";
              }}
            />
            <div className="flex flex-col justify-between pt-1 pb-1">
              <h4 className="font-headline-sm font-bold text-[15px] font-serif line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <span className="font-label-md text-[11px] text-gray-500 mt-2">
                {dayjs(post.created_at).format("DD/MM/YYYY")}
              </span>
            </div>
          </Link>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Chưa có bài viết liên quan</p>
        </div>
      )}
    </div>
  );
};

export default TrendingPosts;


