# fe-lobby

A high-performance, mobile-first iGaming lobby built with Nuxt 4.

## Tech stack

- [Nuxt 4](https://nuxt.com/) (Vue 3, Nitro, Vite)
- [Pinia](https://pinia.vuejs.org/) with `pinia-plugin-persistedstate`
- [Tailwind CSS](https://tailwindcss.com/)
- [`@nuxt/image`](https://image.nuxt.com/) and [`@nuxt/icon`](https://github.com/nuxt/icon)

## Requirements

- Node.js `^22.11.0 || ^24.11.0 || >=26.0`

## Setup

Install dependencies:

```bash
npm install
```

Copy the example environment files and adjust as needed:

```bash
cp .env.example .env
```

| File                | Used by        | Contents                                      |
| ------------------- | -------------- | --------------------------------------------- |
| `.env`              | build / preview | CDN image path only                          |
| `.env.development`  | `npm run dev`  | API base + CDN image path for local hosts     |

## Environment variables

| Variable               | Required | Description                                                                                      |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `NUXT_PUBLIC_CDN_URL`  | yes      | CDN origin used for game thumbnails and asset preconnect, this will be dynamic in future release |
| `NUXT_PUBLIC_API_BASE` | local    | Fixed API base used on `localhost` / `local.ninjagaming.com`. Production uses the page host.     |

On local hosts the lobby calls `NUXT_PUBLIC_API_BASE`. Everywhere else it uses `${window.location.origin}/lobby/api`.

## Development

The dev server runs over HTTPS on a custom host (certificates are generated automatically via `vite-plugin-mkcert`):

```bash
npm run dev
```

## Production

```bash
npm run build     # build for production
npm run preview   # locally preview the production build
npm run generate  # static generation (if applicable)
```

## Scripts

| Script                 | Description                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Start the HTTPS dev server.     |
| `npm run build`        | Build for production.           |
| `npm run preview`      | Preview the production build.   |
| `npm run generate`     | Static site generation.         |
| `npm run lint`         | Run ESLint.                     |
| `npm run lint:fix`     | Fix lint issues.                |
| `npm run format`       | Format with Prettier.           |
| `npm run format:check` | Check formatting with Prettier. |

## Versioning

See [`CHANGELOG.md`](./CHANGELOG.md) for release notes.
