declare namespace NodeJS {
  export interface ProcessEnv {
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    MONGODB_URI: string;
    BASE_URL: string;
    EMAIL_SERVER_USER: string;
    EMAIL_SERVER_PASSWORD: string;
    EMAIL_SERVER_HOST: string;
    EMAIL_SERVER_PORT: number;
    EMAIL_FROM: string;
    NEXT_PUBLIC_NEXTAUTH_SECRET: string;
    NEXT_PUBLIC_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS: string;
  }
}
