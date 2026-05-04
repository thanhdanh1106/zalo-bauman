import { getThumbnailUrl } from "@shared/utils/Hooks";
import { useTranslation } from "react-i18next";
import {
  MdArchive,
  MdDescription,
  MdImage,
  MdInsertDriveFile,
  MdPictureAsPdf,
  MdVideoLibrary,
} from "react-icons/md";
import { mediaProps } from "../types/media";

const getIconByMime = (mime: string) => {
  if (mime.startsWith("image/")) return <MdImage size={32} />;
  if (mime.startsWith("video/")) return <MdVideoLibrary size={32} />;
  if (mime === "application/pdf") return <MdPictureAsPdf size={32} />;
  if (mime.includes("zip") || mime.includes("rar"))
    return <MdArchive size={32} />;
  if (
    mime.includes("msword") ||
    mime.includes("officedocument") ||
    mime.includes("text/plain")
  )
    return <MdDescription size={32} />;

  return <MdInsertDriveFile size={32} />;
};

export default function MediaCell({
  data,
}: {
  data: mediaProps | null | undefined;
}) {
  const { t } = useTranslation();

  if (!data) {
    return (
      <div className="shadow relative border border-slate-300 rounded flex items-center bg-white   h-[60px] w-[60px] justify-center">
        <span className="text-xs text-gray-600 ">{t("No Media")}</span>
      </div>
    );
  }

  const { name, uuid, mime_type } = data;

  const isImage = mime_type?.startsWith("image/");

  return (
    <div
      className="shadow relative border border-slate-300 rounded flex items-center bg-white   h-[60px] w-[60px] justify-center"
      title={name}
    >
      {uuid ? (
        isImage ? (
          <img
            alt=""
            src={getThumbnailUrl(data)}
            className="max-w-[60px] max-h-[60px] object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-600  text-sm">
            {getIconByMime(mime_type)}
            <span className="text-[10px] text-center px-1 line-clamp-1">
              {name}
            </span>
          </div>
        )
      ) : (
        <span className="text-xs text-gray-600 ">{t("No Media")}</span>
      )}
    </div>
  );
}


