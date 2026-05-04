import { mediaProps } from "@shared/types/media";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { Box, Chip, Stack, Typography } from "@mui/material";
import React from "react";
import { FaLink } from "react-icons/fa";

type SeoContent = {
  seo_title?: string;
  seo_description?: string;
  seo_canonical_url?: string;
  seo_image?: mediaProps;
  seo_keywords: string[] | null;
};

type Props = {
  seoContent: SeoContent | null;
};

const SeoPreview: React.FC<Props> = ({ seoContent }) => {
  return (
    <Box className="p-4 flex gap-3 rounded-xl bg-white  shadow">
      {seoContent?.seo_image && (
        <Box
          component="img"
          src={getThumbnailUrl(seoContent.seo_image)}
          alt="SEO Thumbnail"
          sx={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 1,
            border: "1px solid #ddd",
          }}
        />
      )}
      <Stack sx={{ flex: 1 }} spacing={0.5}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          className="text-blue-700 "
          sx={{ fontSize: "18px", lineHeight: 1.3 }}
        >
          {seoContent?.seo_title || "SEO title here"}
        </Typography>
        {seoContent?.seo_canonical_url && (
          <Typography
            variant="body2"
            color="green"
            sx={{
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <FaLink size={12} />
            {seoContent?.seo_canonical_url}
          </Typography>
        )}
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            fontSize: "13px",
            lineHeight: 1.5,
            mt: 0.5,
          }}
        >
          {seoContent?.seo_description ||
            "SEO description will be displayed here if you enter one."}
        </Typography>
        {Array.isArray(seoContent?.seo_keywords) &&
        seoContent?.seo_keywords.length ? (
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {seoContent?.seo_keywords.map((f, idx) => (
              <Chip key={idx} label={f} size="small" />
            ))}
          </Stack>
        ) : (
          ""
        )}
      </Stack>
    </Box>
  );
};

export default SeoPreview;


