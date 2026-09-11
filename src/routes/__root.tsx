import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() { return <div className="grid min-h-screen place-items-center bg-background px-4 text-center"><div><h1 className="text-7xl font-extrabold">404</h1><p className="mt-3 text-muted-foreground">This page could not be found.</p><Link to="/" className="mt-6 inline-block font-bold text-primary">Return home</Link></div></div>; }
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) { const router = useRouter(); useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]); return <div className="grid min-h-screen place-items-center px-4 text-center"><div><h1 className="text-2xl font-bold">This page didn’t load</h1><button className="mt-5 font-bold text-primary" onClick={() => { router.invalidate(); reset(); }}>Try again</button></div></div>; }
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { property: "og:type", content: "website" }, { property: "og:site_name", content: "Sachin Unisex Salon" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "stylesheet", href: appCss }, { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" }, { rel: "icon", href: "/favicon.png", type: "image/png" }] }),
  shellComponent: RootShell, component: RootComponent, notFoundComponent: NotFoundComponent, errorComponent: ErrorComponent,
});
function RootShell({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
function RootComponent() { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>; }
