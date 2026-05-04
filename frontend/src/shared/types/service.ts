import { JSONContent } from '@tiptap/core';
import { mediaProps } from "./media";
import { tagProps } from "./tag";
import { userProps } from "./user";

/* Services */
export interface serviceErrorProps {
    title?: string[] | null,
    body?: JSONContent,
    description?: string[] | null,
    categories?: string[] | null,
}

export interface createserviceProps {
    title: string | null,
    description: string | null,
    body: string | null,
    thumbnail: number,
    categories: number[],
    tags: number[]
}

export interface serviceProps {
    id: number,
    slug: string,
    title?: string,
    description?: string,
    body?: JSONContent,
    thumbnail?: mediaProps,
    categories: serviceCategoryProps[],
    tags: tagProps[],

    user: userProps,
    view?: number,
    comments_count: number,
    reactions_count: number,
    bookmarks_count: number,
    author: {
        image?: string,
        name?: string,
        designation?: string
    },
    created_at: string,
    updated_at: string,
}

/* Service category */
export interface serviceCategoryErrorProps {
    title?: string[] | null,
    body?: JSONContent,
    description?: string[] | null,
    categories?: string[] | null,
}

export interface serviceCategoryProps {
    id: number,
    slug: string,
    title?: string,
    body?: JSONContent,
    description?: string,
    thumbnail?: mediaProps,
    posts_count?: number,
    created_at: string,
    updated_at: string,
}