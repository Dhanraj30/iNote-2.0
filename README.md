# AI Note-Taking Assistant

![](https://github.com/Dhanraj30/iNote-2.0/blob/main/sc.png)

AI Note-Taking Assistant is a web application designed to help users create, organize, and summarize their notes with the power of AI. The app provides a rich text editor, AI-powered summarization, and seamless user experience for managing notebooks.

## Features

- **Rich Text Editor**: Create and edit notes using a feature-rich editor powered by TipTap.
- **AI-Autocompletion**: Auto complete your sentences based on previous text
- **AI-Powered Summarization**: Generate concise summaries of your notes using AI.
- **Notebook Management**: Create, edit, and delete notebooks with ease.
- **Drawing Support**: Add drawings to your notes using an integrated  excalidraw 
- **User Authentication**: Secure login and session management using Supabase with google


## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, shadcn ui
- **Backend**: Node.js, Next.js API routes
- **Database**: Supabase, PostgreSql with drizzle orm
- **AI Integration**: Google Generative AI (Gemini API), Hugging face ai model
- **State Management**: React Query
- **Editor**: TipTap with custom extensions


## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Supabase account
- Google Generative AI API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd iNote
   npm install
   ```
Set up environment variables: Create a .env file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
GEMINI_API_KEY=<your-google-generative-ai-key>
SUPABASE_DB_URL=db_url
HUGGING_FACE_ACCESS_TOKEN=
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
