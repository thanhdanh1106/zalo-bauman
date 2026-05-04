import { mediaProps } from "./media";

import { JSONContent } from '@tiptap/core';
import { tagProps } from "./tag";
import { userProps } from "./user";

/* Posts */
export interface postErrorProps {
    title?: string[] | null,
    body?: string[] | null,
    description?: string[] | null,
    categories?: string[] | null,
}

export interface createPostProps {
    title: string | null,
    description: string | null,
    body: JSONContent | null,
    thumbnail: number,
    categories: number[],
    tags: number[],
}

export interface postProps {
    id: number,
    slug: string,
    title?: string,
    description?: string,
    body?: JSONContent,
    thumbnail?: mediaProps,
    categories: postCategoryProps[],
    tags: tagProps[],
    user: userProps,
    view?: number,
    comments_count: number,
    reactions_count: number,
    bookmarks_count: number,
    status: "draft" | "pending" | "published",
    author: {
        image?: string,
        name?: string,
        designation?: string
    },
    created_at: string,
    updated_at: string,
}

/* Post category */
export interface postCategoryErrorProps {
    title?: string[] | null,
    body?: string[] | null,
    description?: string[] | null,
    categories?: string[] | null,
}

export interface postCategoryProps {
    id: number,
    slug: string,
    title?: string,
    body?: string,
    description?: string,
    thumbnail?: mediaProps,
    parent?: postCategoryProps | null,
    children?: postCategoryProps | null,
    allParents: postCategoryProps[] | null,
    allChildren: postCategoryProps[] | null,
    posts_count?: number,
    created_at: string,
    updated_at: string,
}

export type carBrandProps = postCategoryProps & { models: carModelProps[] | null, models_count: number }

export type carModelProps = postCategoryProps & { brand: postCategoryProps | null }