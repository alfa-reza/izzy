// The starter's single-file plugin forces Vite's BASE_URL to "./" at build time.
// A dedicated build variable preserves the actual mount path for static hosts.
const requestedBase = import.meta.env.VITE_SITE_BASE || import.meta.env.BASE_URL;
const path = requestedBase === './' ? '/' : requestedBase;
const trimmed = path.replace(/^\/+|\/+$/g, '');

export const siteBase = trimmed ? `/${trimmed}/` : '/';