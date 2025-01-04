# **Next.js + Rainbowkit + SIWE + shadcn**

Live Demo: [link-here](link-here)

A **Next.js** frontend for the DAAO project, powered by **TypeScript**, **RainbowKit**, **Wagmi**, **Shadcn**, and **TailwindCSS**. 

---

## ✨ **What's Included**

Includes the following features:

- **Next.js** with **TypeScript**: Full TypeScript support for modern, scalable applications.
- **RainbowKit + Wagmi**: Seamless Ethereum wallet connection and Web3 functionality with built-in wallet UI.
- **SIWE (Sign-In With Ethereum)**: Pre-configured authentication solution for decentralized logins using NextAuth.
- **TailwindCSS**: A utility-first CSS framework for fast and responsive design.
- **Shadcn Components**: A customizable component library built on TailwindCSS for building modern UIs.
- **Theme Toggle**: Dark/light mode toggler with TailwindCSS-based theme switching.
- **React Query**: Integrated for managing server state and caching.
- **NextAuth**: Secure authentication setup, with support for Web3-based logins.
- **Bun** for Fast Package Management: Support for Bun to speed up dependency installation and script execution.

---

## 🚀 **Getting Started**

### **To Run the project locally**


1. **Clone via CLI:**

   Alternatively, you can clone the repository using the CLI:

   ```bash
   git clone git-link-here daao_frontend
   cd daao_frontend 

   ```

3. **Install Dependencies:**

This project uses Bun for managing dependencies. If you don't have Bun installed, follow the installation instructions [here](https://bun.sh/docs/installation).

- Once Bun is installed, run:

```bash
bun install
```

- Set up Environment Variables:

Copy the .env.example file to .env.local and update the variables as needed:

```bash
cp .env.example .env.local
```

- Start the development server:

```bash
bun run dev
```

- Open http://localhost:3000 to view the app.


## 🔧 **Project Structure**

```bash
daao_ai_frontend/
│
├── public/                # Public assets (e.g., favicon)
│   └── favicon.ico
├── src/                   # Source files
│   ├── assets/            # Other assets
│   │   ├── icons/         # Icon assets
│   │   │   └── social.tsx
│   │   └── images/        # Image assets
│   ├── components/        # UI components
│   │   ├── navigation/    # Navigation elements
│   │   │   ├── header-sheet.tsx
│   │   │   ├── navbar.tsx
│   │   │   └── navigation-menu.tsx
│   │   └── ui/            # UI elements and components
│   │       ├── button.tsx
│   │       ├── connect-button.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── theme-toggler.tsx
│   │       ├── typography.tsx
│   │       └── footer.tsx
│   ├── lib/               # Utility functions and configurations
│   │   └── utils.ts
│   ├── pages/             # Next.js pages and API routes
│   │   ├── api/           # API routes (e.g., NextAuth)
│   │   │   └── auth/
│   │   │       └── [...nextauth].ts
│   │   ├── example/       # Example pages
│   │   │   └── index.tsx
│   │   ├── _app.tsx       # Next.js custom App component
│   │   ├── 404.tsx        # 404 page
│   │   └── index.tsx      # Homepage
│   ├── styles/            # Global and module styles
│   │   └── globals.css
│   └── wagmi.ts           # Wagmi configuration for Web3
├── .env.example           # Example environment variables
├── .gitignore             # Files and directories to ignore in Git
├── bun.lockb              # Bun lock file for dependencies
├── components.json        # Shadcn component configuration
├── next-env.d.ts          # Next.js environment types
├── next.config.js         # Next.js configuration
├── package.json           # Project dependencies and scripts
├── postcss.config.js      # PostCSS configuration for TailwindCSS
├── README.md              # Project documentation
├── tailwind.config.ts     # TailwindCSS configuration
└── tsconfig.json          # TypeScript configuration

```

---

## 📃 **License**

This project is licensed under the [MIT License](LICENSE).

---

## 📢 **Contact**

For any questions or inquiries, feel free to reach out via GitHub issues or open a discussion. We're happy to hear from the community and help with any issues you may encounter.
