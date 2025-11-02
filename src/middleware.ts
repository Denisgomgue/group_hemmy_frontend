import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const access_token = request.cookies.get("access_token")?.value
  const is_locked = request.cookies.get("is_locked")?.value
  const path = request.nextUrl.pathname

  const excludedPaths = [
    /^\/api/,
    /^\/_next\/static/,
    /^\/_next\/image/,
    /^\/favicon.ico/,
    /\.(png|jpg|jpeg|svg|webp|ico|gif|css|js|woff2?|ttf|otf)$/,
  ]

  if (excludedPaths.some((pattern) => pattern.test(path))) {
    return NextResponse.next()
  }

  // Rutas públicas que no requieren autenticación
  const publicPaths = [ "/", "/login" ]

  if (publicPaths.includes(path)) {
    // Si está autenticado y va a login, redirigir a dashboard
    if (path === "/login" && access_token) {
      if (is_locked === "true") {
        return NextResponse.redirect(new URL("/lock-screen", request.url))
      }
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    // Permitir acceso a rutas públicas
    return NextResponse.next()
  }

  if (path === "/lock-screen") {
    if (!access_token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  // Todas las demás rutas así requieren autenticación
  if (!access_token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (is_locked === "true" && path !== "/lock-screen") {
    return NextResponse.redirect(new URL("/lock-screen", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/:path*",
}
