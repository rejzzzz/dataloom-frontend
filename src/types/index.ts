// Common types used across the application

export interface SchemaField {
    name: string;
    type: string;
    values?: string[];
}

export interface SchemaResponse {
    column_count: number;
    model_used: string;
    schema: SchemaField[];
}

export interface DataResponse {
    count: number;
    data: Record<string, any>[];
}

export interface User {
    $id: string;
    email: string;
    name: string;
    $createdAt: string;
    $updatedAt: string;
}

export interface Session {
    $id: string;
    userId: string;
    expire: string;
    provider: string;
    providerUid: string;
    $createdAt: string;
    $updatedAt: string;
}

export interface ApiError {
    error: string;
    reset_time?: string;
    raw?: string;
}
