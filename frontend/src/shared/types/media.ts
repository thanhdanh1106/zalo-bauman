
export interface mediaProps {
  id: number
  model_type: string
  model_id: number
  uuid: string
  collection_slug: string
  name: string
  file_slug: string
  mime_type: string
  disk: string
  conversions_disk: string
  size: number
  manipulations: any[]
  custom_properties: any[]
  generated_conversions: any[]
  responsive_images: any[]
  order_column: number
  created_at: string
  updated_at: string
  original_url: string
  preview_url: string
}

export interface CustomProperties {
  legacy_id: number
  original_slug: string
}


export type MediaTypeValue =
  | 'all'
  | 'image'
  | 'video'
  | 'pdf'
  | 'excel'
  | 'audio'
  | 'zip'
  | 'doc'
  | 'other';

export interface ProgressEvent<T extends EventTarget = EventTarget> extends Event {
  readonly target: T | null;
  readonly lengthComputable: boolean;
  readonly loaded: number;
  readonly total: number;
}

export interface ThumbnailUrls {
  original: string
  large: string
  medium: string
  small: string
  thumbnail: string
}

export interface ThumbnailWebpUrls {
  original: string
  large: string
  medium: string
  small: string
  thumbnail: string
}
