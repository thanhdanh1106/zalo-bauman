import { metaProps } from "@shared/types/meta";
import { postProps } from "@shared/types/post";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { findManyServices } from "@shared/utils/Services";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
dayjs.extend(relativeTime);

type Props = {};

const TrendingPosts: React.FC = () => {
  const [data, setData] = useState<postProps[]>([]);

  async function handleFindManyBlogs() {
    const response: {
      meta: metaProps;
      data: postProps[];
      error: boolean;
    } = await findManyServices({
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
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6    ">
      <h3 className="text-xl font-bold text-gray-800  mb-4">Trending Now</h3>
      <ul>
        {Array.isArray(data) && data.length
          ? data.map((post) => (
              <li key={post.id} className="flex items-center mb-4 last:mb-0">
                <img
                  src={getThumbnailUrl(post?.thumbnail)}
                  alt={post.title}
                  className="w-20 h-16 aspect-square object-center object-cover rounded-lg mr-4"
                />
                <div>
                  <p className="text-gray-800  font-medium text-sm leading-tight mb-1">
                    {post.title}
                  </p>
                  <p className="text-gray-500  text-xs">
                    {dayjs(post.created_at).fromNow()}
                  </p>
                </div>
              </li>
            ))
          : ""}
      </ul>
    </div>
  );
};

export default TrendingPosts;


