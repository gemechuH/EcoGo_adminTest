# EcoGo Admin Dashboard - Next.js 16

This is a fully migrated Next.js 16 version of the EcoGo Admin Dashboard, originally built with React + Vite.

## Features

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** components (shadcn/ui style)
- **Recharts** for data visualization
- **Sonner** for toast notifications
- **Next Themes** for theme management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
NextJs/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── ui/           # UI component library
│   │   └── ...           # Page components
│   ├── lib/              # Utilities and mock data
│   └── types/            # TypeScript types
├── public/               # Static assets
└── package.json
```

## Migration Notes

- All components have been migrated to use Next.js Image component
- Client components are marked with "use client" directive
- Imports use the `@/` alias for cleaner paths
- Routing uses Next.js App Router instead of React Router
- All dependencies updated to latest compatible versions

## Build

```bash
npm run build
```

## License

© 2025 EcoGo Canada. All rights reserved.

