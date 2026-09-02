'use client'

import Link from 'next/link'
import { ArrowLeft, LockKeyhole } from 'lucide-react'

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <section className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Volver al catálogo</Link>
        <div className="mt-10 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><LockKeyhole size={22} /></div>
        <h1 className="mt-6 font-serif text-4xl tracking-tight">Panel administrativo</h1>
        <p className="mt-3 leading-6 text-muted-foreground">Inicia sesión para gestionar productos, inventario y pedidos de Maxima Kraft.</p>
        <form className="mt-8 space-y-5" onSubmit={(event) => event.preventDefault()}>
          <label className="block text-sm font-medium">Correo electrónico<input name="email" type="email" required className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" placeholder="admin@maximakraft.co" /></label>
          <label className="block text-sm font-medium">Contraseña<input name="password" type="password" required className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" /></label>
          <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground">Iniciar sesión</button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">Acceso exclusivo para el dueño del negocio.</p>
      </section>
    </main>
  )
}
