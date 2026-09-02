'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { api, type Product, type Order } from '@/lib/api'

const currency = (value: number) => `COP $${Number(value).toLocaleString('es-CO')}`

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadPanel() {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    if (!data.user) return router.replace('/admin/login')
    const token = (await supabase.auth.getSession()).data.session?.access_token
    try {
      const [productData, orderData] = await Promise.all([api.adminProducts(token), api.adminOrders(token)])
      setProducts(productData)
      setOrders(orderData)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cargar el panel')
    } finally { setLoading(false) }
  }

  useEffect(() => { void loadPanel() }, [router])

  async function saveProduct(product: Product, form: HTMLFormElement) {
    setSaving(product.id); setMessage(''); setError('')
    const supabase = createClient()
    const token = (await supabase.auth.getSession()).data.session?.access_token
    const data = new FormData(form)
    try {
      const updated = await api.updateProduct(product.id, {
        name: String(data.get('name') ?? ''), description: String(data.get('description') ?? ''),
        price: Number(data.get('price')), category: String(data.get('category') ?? ''),
        image_url: String(data.get('image_url') ?? '') || null, stock: Number(data.get('stock')), active: data.get('active') === 'on',
      }, token)
      setProducts((items) => items.map((item) => item.id === updated.id ? updated : item))
      setMessage(`Producto “${updated.name}” actualizado correctamente.`)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo actualizar el producto') }
    finally { setSaving(null) }
  }

  async function signOut() { await createClient().auth.signOut(); router.replace('/admin/login') }
  if (loading) return <main className="min-h-screen bg-background p-8">Cargando panel...</main>

  return <main className="min-h-screen bg-background px-4 py-6 sm:px-8"><div className="mx-auto max-w-7xl">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold tracking-widest text-primary">MAXIMA KRAFT / ADMIN</p><h1 className="font-serif text-4xl">Panel de control</h1></div><button onClick={signOut} className="rounded-full border border-border px-4 py-2 text-sm">Cerrar sesión</button></header>
    {(message || error) && <p role="status" className={`mt-4 rounded-xl p-3 text-sm ${error ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>{error || message}</p>}
    <section className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-primary p-5 text-primary-foreground"><p className="text-sm opacity-80">Productos activos</p><strong className="text-3xl">{products.filter((p) => p.active).length}</strong></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Pedidos</p><strong className="text-3xl">{orders.length}</strong></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Stock bajo</p><strong className="text-3xl">{products.filter((p) => p.stock <= 5).length}</strong></div></section>
    <section className="mt-8 rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Gestión de productos</h2><p className="text-sm text-muted-foreground">Edita toda la información que ve el cliente.</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{products.length} registros</span></div><div className="mt-4 grid gap-4 lg:grid-cols-2">{products.map((product) => <form key={product.id} onSubmit={(event) => { event.preventDefault(); void saveProduct(product, event.currentTarget) }} className="rounded-xl border border-border p-4"><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Nombre<input name="name" defaultValue={product.name} required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" /></label><label className="text-sm">Categoría<input name="category" defaultValue={product.category} required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" /></label><label className="text-sm sm:col-span-2">Descripción<textarea name="description" defaultValue={product.description} rows={2} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" /></label><label className="text-sm">Precio COP<input name="price" type="number" min="0" step="1" defaultValue={product.price} required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" /></label><label className="text-sm">Stock<input name="stock" type="number" min="0" step="1" defaultValue={product.stock} required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" /></label><label className="text-sm sm:col-span-2">URL de imagen<input name="image_url" defaultValue={product.image_url ?? ''} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" /></label></div><div className="mt-3 flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm"><input name="active" type="checkbox" defaultChecked={product.active} /> Producto activo</label><button disabled={saving === product.id} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving === product.id ? 'Guardando...' : 'Guardar cambios'}</button></div></form>)}</div></section>
    <section className="mt-8 rounded-2xl border border-border bg-card p-5"><h2 className="font-serif text-2xl">Pedidos recientes</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b border-border text-muted-foreground"><th className="p-3">Pedido</th><th className="p-3">Cliente</th><th className="p-3">Fecha</th><th className="p-3">Total</th><th className="p-3">Estado</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b border-border"><td className="p-3 font-mono text-xs">{order.id.slice(0, 8)}…</td><td className="p-3">{order.customer_name}</td><td className="p-3">{new Date(order.created_at).toLocaleString('es-CO')}</td><td className="p-3 font-semibold">{currency(order.total)}</td><td className="p-3">{order.status}</td></tr>)}</tbody></table>{orders.length === 0 && <p className="py-8 text-center text-muted-foreground">No hay pedidos registrados.</p>}</div></section>
  </div></main>
}
