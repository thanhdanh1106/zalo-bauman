import { mediaProps } from "./media";

export interface AppSettings {
    thumbnail: mediaProps | null;
    dark_thumbnail: mediaProps | null;
    gallery: mediaProps[];
    app_title: string;
    app_description: string;
    contact_email: string;
    contact_phone: string;
    tiktok_link: string;
    policy_link: string;
    privacy_link: string;
    terms_link: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    enable_payment: boolean;
    background_color: string;
    text_color: string;
    font_family: string;
    font_size: string;
}