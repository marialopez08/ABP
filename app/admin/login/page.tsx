'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(''); const { error: authError } = await createClient().auth.signInWithPassword({ email, password }); if (authError) { setError(authError.message.toLowerCase().includes('confirm') ? 'Confirma tu correo antes de iniciar sesión.' : 'Correo o contraseña inválidos.'); setBusy(false); return } router.replace('/admin') }
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10"><section className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl"><Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Volver al catálogo</Link><div className="mt-10 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><LockKeyhole size={22} /></div><h1 className="mt-6 font-serif text-4xl tracking-tight">Panel administrativo</h1><p className="mt-3 leading-6 text-muted-foreground">Accede para gestionar productos, inventario y pedidos.</p>{error && <p role="alert" className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<form className="mt-8 space-y-5" onSubmit={submit}><label className="block text-sm font-medium">Correo electrónico<input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" required className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" placeholder="admin@maximakraft.co" /></label><label className="block text-sm font-medium">Contraseña<input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" required className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" /></label><button disabled={busy} type="submit" className="w-full rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground disabled:opacity-60">{busy ? 'Validando...' : 'Iniciar sesión'}</button></form><p className="mt-6 text-center text-xs text-muted-foreground">Usuarios gestionados por Supabase Auth.</p></section></main>
}
