import InlineSearchForm from "@shared/components/InlineSearchForm";
import PageLoading from "@shared/components/PageLoading";
import PageNotFound from "@shared/components/PageNotFound";
import { extensions } from "@shared/components/RichTextEditorComponent";
import { useToasterContext } from "@shared/components/ToasterContext";
import { postProps } from "@shared/types/post";
import { findOnePostByName } from "@shared/utils/AccountAnalytics";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import message from "@shared/utils/message.json";
import { generateHTML } from "@tiptap/core";
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
  const { slug } = useParams();
  const { showMessage, startProgress, completeProgress } = useToasterContext();
  const [data, setData] = useState<postProps | null>(null);
  const [pageInit, setPageInit] = useState(false);

  async function handleFindOne(slug: string) {
    try {
      console.log("slug", slug);
      startProgress();
      if (slug) {
        const response = await findOnePostByName(slug);

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
    handleFindOne(String(slug));
  }, [slug]);

  if (!pageInit) {
    return <PageLoading height={500} />;
  }

  if (!data) {
    return <PageNotFound />;
  }

  // Chỉ xử lý HTML khi có data.content
  let html = "";
  if (data.content) {
    if (typeof data.content === 'string') {
        // If it's a string, assume it's already HTML
        html = data.content;
    } else {
        // If it's an object, assume it's Tiptap JSON
        try {
            html = generateHTML(data.content, extensions);
        } catch (e) {
            console.error("Error generating HTML from Tiptap JSON:", e);
            html = String(data.content);
        }
    }
  }

  return (
    <div className="bg-background text-on-background antialiased pb-safe-area-bottom min-h-screen">
      {/* We skip repeating the TopAppBar since the general IndexLayout handles it, 
          or if it's rendered here, it's covered by Zalo UI header.  */}
      <main className="max-w-3xl mx-auto px-margin-main py-stack-lg">
        {/* Hero Section */}
        <article>
          <div className="rounded-xl overflow-hidden mb-stack-md shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-surface-container-lowest">
            {data?.thumbnail ? (
              <img
                className="w-full h-64 object-cover"
                src={getThumbnailUrl(data.thumbnail)}
                alt={data?.title}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.onerror = null;
                  img.src = "https://placehold.co/300x300/1a1d20/cbb27c?text=L%E1%BB%97i+t%E1%BA%A3i+ảnh";
                }}
              />
            ) : (
              <div className="w-full h-64 bg-surface-container-high flex items-center justify-center">
                <span className="text-2xl text-on-surface-variant">📝</span>
              </div>
            )}
          </div>
          
          <div className="mb-stack-lg">
            <div className="flex items-center gap-2 mb-stack-sm text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>{dayjs(data?.created_at).format("DD/MM/YYYY")}</span>
              <span className="mx-2 text-surface-variant">•</span>
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>{data?.view || 0} lượt xem</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg font-serif font-bold text-primary-container mb-stack-md">
              {data?.title}
            </h1>
            <p className="font-body-lg text-tertiary-container italic mb-stack-lg leading-relaxed">
              {data?.description}
            </p>
          </div>

          {/* Content Body */}
          <div className="rich-text-content"
          >
            {html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <div className="text-center py-12 border border-[#eee] rounded-xl bg-white shadow-sm">
                <span className="text-4xl text-gray-300 mb-2 block">📝</span>
                <p className="text-lg text-primary font-serif font-bold mb-2">Nội dung bài viết không có sẵn</p>
                <p className="text-sm text-gray-500 font-label-md">Bài viết này đang được cập nhật.</p>
              </div>
            )}
          </div>
        </article>
        
        {/* Divider */}
        <hr className="my-stack-lg border-surface-variant border-t-[1px] opacity-50"/>

        {/* Related Articles */}
        <section>
          <h3 className="font-headline-md text-headline-md font-serif font-bold text-on-surface mb-stack-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">article</span>
            Bài viết liên quan
          </h3>
          <div className="space-y-stack-md rounded-xl overflow-hidden p-1">
            <TrendingPosts />
          </div>
        </section>
      </main>
    </div>
  );
};

export default DetailBlog;


