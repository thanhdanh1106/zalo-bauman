import { useToasterContext } from "@shared/components/ToasterContext";
import { mediaProps } from "@shared/types/media";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { deleteMedia } from "@shared/utils/Media";
import message from "@shared/utils/message.json";
import { Checkbox } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdArchive,
  MdDescription,
  MdImage,
  MdInsertDriveFile,
  MdPictureAsPdf,
  MdVideoLibrary,
} from "react-icons/md";

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
      className="shadow relative aspect-square flex items-center bg-white   h-full w-full justify-center"
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

export default function MediaCard({
  data,
  selected,
  onSelect,
}: {
  data: mediaProps;
  selected: boolean;
  onSelect: (value: mediaProps) => void;
}) {
  const { id, name, mime_type, size, uuid } = data;
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
    <div className="relative group border overflow-hidden border-slate-200 bg-white   rounded-lg">
      <div className="absolute right-1 top-1 z-[2]">
        <Checkbox
          color="primary"
          checked={selected}
          size="small"
          onClick={() => onSelect(data)}
        />
      </div>
      <div className="flex items-center  justify-center">
        <MediaPreview data={data} />
      </div>
    </div>
  );
}


