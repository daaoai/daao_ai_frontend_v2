<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/daaoai/daao_ai_frontend_v2">
    <img src="./src/assets/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Daao.ai</h3>

</div>
 
---

# **Next.js + Rainbowkit + SIWE + shadcn**

<!-- Live Demo: [link-here](link-here) -->

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

   ```sh
   git clone https://github.com/daaoai/daao_ai_frontend_v2.git daao_frontend
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
  - Make sure you do this from the root of the project and not from some subdirectory
```bash
bun run dev
```

- To build the project instead do

```sh
bun run build
bun run start
```

- Open http://localhost:3000 to view the app.


## 🔧 **Project Structure**

```bash
daao_ai_frontend/
│
├── public/                # Public assets (e.g., favicon)
│   ├── favicon.ico        # favicon
│   ├── assets/            # assets used in design (svg)
│   └── images/            # images served public (jpg/webm if possible)
├── src/                   # Source files
│   ├── assets/            # Other assets (not much)
│   │   ├── icons/         # Icon assets
│   │   └── images/        # Image assets
│   ├── components/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── navigation/
│   │   ├── table/
│   │   ├── ui/            # shadcn installs, don't mess
│   │   ├── footer.tsx
│   │   ├── head-component.tsx
│   │   ├── logo-component.tsx
│   │   ├── page-layout.tsx
│   │   └── theme-provider.tsx
│   ├── lib/               # Utility functions and configurations
│   │   ├── links.tsx
│   │   └── utils.ts
│   ├── pages/             # Next.js pages and API routes
│   │   ├── api/           # API routes (e.g., NextAuth)
│   │   ├── _app.tsx       # Next.js custom App component
│   │   ├── 404.tsx        # 404 page
│   │   └── index.tsx      # Homepage
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

<!-- ## 📢 **Contact** -->
<!---->
<!-- For any questions or inquiries, feel free to reach out via GitHub issues or open a discussion. We're happy to hear from the community and help with any issues you may encounter. -->
