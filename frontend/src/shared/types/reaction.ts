import { JSONContent } from '@tiptap/core';
import { mediaProps } from "./media";
import { userProps } from "./user";

/* Reactions */
export interface reactionErrorProps {
    title?: string[] | null,
    body?: JSONContent,
    description?: string[] | null,
    categories?: string[] | null,
}

export interface createReactionProps {
    post_type: "posts" | "services" | "reports" | "stocks" | "threads",
    post_id: number,
    type: string
}

export interface reactionProps {
    id: number,
    slug: string,
    title?: string,
    description?: string,
    body?: JSONContent,
    thumbnail?: mediaProps,
    categories: reactionCategoryProps[],

    user: userProps,
    view?: number,
    comments_count?: number,
    author: {
        image?: string,
        name?: string,
        designation?: string
    },
    created_at: string,
    updated_at: string,
}

/* Reaction category */
export interface reactionCategoryErrorProps {
    title?: string[] | null,
    body?: string[] | null,
    description?: string[] | null,
    categories?: string[] | null,
}

export interface reactionCategoryProps {
    id: number,
    slug: string,
    title?: string,
    body?: string,
    description?: string,
    thumbnail?: mediaProps,
    reactions_count?: number,
    created_at: string,
    updated_at: string,
}