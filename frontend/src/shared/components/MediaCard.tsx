import { mediaProps } from "@shared/types/media";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { deleteMedia } from "@shared/utils/Media";
import message from "@shared/utils/message.json";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoTrash } from "react-icons/io5";
import {
  MdArchive,
  MdDescription,
  MdImage,
  MdInsertDriveFile,
  MdPictureAsPdf,
  MdVideoLibrary,
} from "react-icons/md";
import { useToasterContext } from "./ToasterContext";

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

const MediaPreview = ({ data }: { data: mediaProps | null | undefined }) => {
  const { t } = useTranslation();

  if (!data) {
    return (
      <div className="shadow relative flex items-center bg-white   h-full w-full justify-center">
        <span className="text-xs text-gray-600 ">{t("No Media")}</span>
      </div>
    );
  }

  const { file_name, name, uuid, mime_type } = data;

  const isImage = mime_type?.startsWith("image/");

  return (
    <div
      className="shadow relative flex items-center bg-white   h-full w-full justify-center"
      title={name}
    >
      {uuid ? (
        isImage ? (
          <img
            alt=""
            src={getThumbnailUrl(data)}
            className="max-w-[100%] max-h-[100%] object-cover"
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
};

export default function MediaCard({ data }: { data: mediaProps }) {
  const { id } = data;
  const [isLoading, setIsLoading] = useState(false);
  const { showMessage } = useToasterContext();
  const [deleted, setDeleted] = useState(false);

  const { t } = useTranslation();
  async function handleDeleteMedia() {
    try {
      setIsLoading(true);
      const response = await deleteMedia(id);

      if (response && !response.error) {
        showMessage("success", t(message.media.delete_successful));
        setDeleted(true);
      }
    } catch (error) {
      showMessage("error", t(message.media.delete_failed));
    } finally {
      setIsLoading(false);
    }
  }

  if (deleted) {
    return null;
  }

  return (
    <div className="relative group border overflow-hidden border-slate-200 bg-white   rounded-lg shadow-md">
      <div className="absolute top-1 right-1 z-[2]">
        <IconButton
          loading={isLoading}
          className="!rounded-lg opacity-0 !duration-300 ease-in-out -translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 shadow !border !border-red-300 bg-red-100"
          onClick={() => handleDeleteMedia()}
          size="small"
        >
          <IoTrash className="text-red-600" />
        </IconButton>
      </div>
      <div className="flex items-center  h-[180px] justify-center">
        <MediaPreview data={data} />
      </div>
    </div>
  );
}


