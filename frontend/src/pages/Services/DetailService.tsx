import InlineSearchForm from "@shared/components/InlineSearchForm";
import NotFound from "@shared/components/NotFound";
import PageLoading from "@shared/components/PageLoading";
import { useToasterContext } from "@shared/components/ToasterContext";
import UserCard from "@shared/components/UserCard";
import { postProps } from "@shared/types/post";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import message from "@shared/utils/message.json";
import { findOneServiceByName } from "@shared/utils/Services";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import HTMLReactParser from "html-react-parser";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaComments } from "react-icons/fa";
import { useParams } from "react-router-dom";
import TrendingPosts from "./Components/TrendingPosts";

dayjs.extend(relativeTime);

// Main DetailedPostPage Component
const DetailBlog: React.FC = () => {
  const { t } = useTranslation();
  const { name } = useParams();
  const { showMessage, startProgress, completeProgress } = useToasterContext();
  const [data, setData] = useState<postProps | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [pageInit, setPageInit] = useState(false);

  async function handleFindOne(name: string) {
    try {
      startProgress();
      if (name) {
        const response = await findOneServiceByName(name);

        if (response && !response.error) {
          const { data } = response;
          if (data) {
            setData(data);
          }
        }
      }
    } catch (error) {
      showMessage("error", t(message.response.error));
    } finally {
      completeProgress();
      setPageInit(true);
    }
  }

  useEffect(() => {
    handleFindOne(String(name));
  }, []);

  if (!pageInit) {
    return <PageLoading height={500} />;
  }

  if (!data) {
    return <NotFound />;
  }

  return (
    <div className="container">
      <div className="w-full max-w-6xl">
        {/* Header for the Post */}
        <div className="bg-gray-50 relative rounded-xl overflow-hidden border h-[500px] border-slate-200   shadow-md duration-300 ease-in-out">
          {data?.thumbnail ? (
            <img
              className="mb-4 object-cover absolute h-full w-full"
              src={getThumbnailUrl(data.thumbnail)}
              alt={`[Ảnh của ${data?.title}]`}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src =
                  "https://placehold.co/300x300/E2E8F0/FF0000?text=L%E1%BB%97i+t%E1%BA%A3i+ảnh";
              }}
            />
          ) : (
            ""
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900/55"></div>
          <div className="absolute z-[2] max-w-3xl bottom-0 p-[35px]">
            <div className="mb-4">
              <h3 className="lg:text-5xl font-semibold text-gray-200 mb-2 line-clamp-2">
                {data?.title}
              </h3>
              <p className="text-base text-gray-300 line-clamp-2">
                {data?.description}
              </p>
            </div>
            <div className="flex mb-5 items-center gap-5">
              <div className="flex items-center gap-2">
                <img
                  src={getThumbnailUrl(
                    data?.user?.information?.avatar,
                    "small"
                  )}
                  alt={data?.user?.email || ""}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-200">
                  {data?.user?.email}
                </span>
              </div>

              <div className="flex flex-wrap text-gray-300 text-xs gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-sm" />
                  <span>{dayjs(data?.created_at).fromNow()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaComments className="text-sm" />
                  <span>{0} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content and Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-5">
          {/* Main Post Content */}
          <div className="lg:col-span-2">
            <div
              id="post-content"
              className=" bg-white p-6 rounded-xl shadow-sm border border-gray-200   "
            >
              {HTMLReactParser(data.body || "")}
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6   ">
              <h3 className="text-xl font-bold text-gray-800  mb-4">
                Find another posts
              </h3>
              <InlineSearchForm onSearch={(value) => console.log("value")} />
            </div>
            <TrendingPosts />
            <UserCard data={data.user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBlog;


