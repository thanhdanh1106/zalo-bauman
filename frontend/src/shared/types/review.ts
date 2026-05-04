import { JSONContent } from '@tiptap/core';
import { mediaProps } from "./media";

/* Reviews */
export interface reviewErrorProps {
    title?: string[] | null,
    body?: JSONContent,
    description?: string[] | null,
}

export interface createReviewProps {
    title: string | null,
    description: string | null,
    body: JSONContent,
    thumbnail: number,
}

export interface reviewProps {
    id: number,
    title?: string,
    description?: string,
    body?: JSONContent,
    thumbnail?: mediaProps,
    view?:number,
    created_at: string,
    updated_at: string,
}

/* Review category */
export interface reviewCategoryErrorProps {
    title?: string[] | null,
    body?: JSONContent,
    description?: string[] | null,
}

export interface reviewCategoryProps {
    id: number,
    title?: string,
    body?: JSONContent,
    description?: string,
    thumbnail?: mediaProps,
    created_at: string,
    updated_at: string,
}