import { JSONContent } from "@tiptap/core";
import { mediaProps } from "./media";
import { userProps } from "./user";

export interface PageProps {
    searchParams: Promise<Record<string, string | string[] | undefined | null>>,
}

export type SinglePageProps = Promise<{ id: number, slug: string }>;

export interface PageProps {
    id: number,
    slug: string,
    title?: string,
    description?: string,
    body?: JSONContent | null,
    thumbnail?: mediaProps,
    user: userProps,
    view?: number,
    template: string,
    author: {
        image?: string,
        name?: string,
        designation?: string
    },
    created_at: string,
    updated_at: string,
}