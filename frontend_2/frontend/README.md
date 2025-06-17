# Travel Booking Frontend

This is the frontend application for the Travel Booking Pro project, built with Next.js.

## Base Path Configuration

This application is configured to be served from the `/frontend` base path. This is set in `next.config.mjs`:

\`\`\`javascript
// next.config.mjs
const nextConfig = {
  // ... other configs
  basePath: '/frontend',
};
\`\`\`

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation (from within the `frontend` directory)

1.  **Navigate to the `frontend` directory:**
    \`\`\`bash
    cd path/to/your-repo/frontend
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    # yarn install
    \`\`\`

3.  **Run the development server:**
    \`\`\`bash
    npm run dev
    \`\`\`
    Open [http://localhost:3000/frontend](http://localhost:3000/frontend) with your browser to see the result. Note the `/frontend` path.

## Deployment

### Vercel

If deploying to Vercel (recommended for Next.js):

1.  Connect your GitHub repository to Vercel.
2.  When configuring the project on Vercel, set the **Root Directory** to `frontend`.
3.  Vercel will automatically detect it's a Next.js project and build it. The `basePath` configuration in `next.config.mjs` will ensure it's served correctly from the `/frontend` subpath on your Vercel deployment.

### Other Platforms

For other platforms, ensure your server is configured to handle the Next.js application running with a `basePath`. You'll typically build the app (`npm run build` inside the `frontend` folder) and then serve the `.next` directory (which will be inside `frontend/.next`). Your reverse proxy or server will need to route requests for `/frontend/*` to this Next.js application.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3
- **UI Primitives**: Headless UI
- **Form Management**: React Hook Form (with Zod for validation)
- **State Management**: Zustand
- **Language**: TypeScript
- **Icons**: Lucide React
- **Date Utilities**: date-fns
