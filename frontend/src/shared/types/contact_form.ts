/* ContactForms */
export interface ContactFormErrorProps {
    title?: string[] | null,
    body?: string[] | null,
    description?: string[] | null,
    categories?: string[] | null,
}

export interface CreateContactFormProps {
    title: string | null,
    description: string | null,
    body: string | null,
    thumbnail: number,
    categories: number[]
}

export interface ContactFormProps {
    id: number,
    first_name?: string,
    last_name?: string,
    phone?: string,
    email?: string,
    title?: string,
    content?: string,
    created_at: string,
    updated_at: string,
}


