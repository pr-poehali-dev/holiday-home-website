import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ADMIN_URL = 'https://functions.poehali.dev/d14741ba-262b-4ff6-9118-1760657177d4';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: 'Новая',      color: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'Подтверждена', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Отменена',   color: 'bg-red-100 text-red-700' },
  completed: { label: 'Завершена',  color: 'bg-gray-100 text-gray-600' },
};

type Booking = {
  id: number; guest_name: string; phone: string; email: string;
  room_name: string; check_in: string; check_out: string;
  guests_count: number; status: string; comment: string; created_at: string;
};

type Review = {
  id: number; guest_name: string; rating: number;
  text: string; is_published: boolean; created_at: string;
};

const api = async (action: string, method = 'GET', body?: object, token = '') => {
  const res = await fetch(`${ADMIN_URL}?action=${action}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
    body: body ? JSON.stringify(body) : undefined,
  });
  const raw = await res.json();
  return { status: res.status, data: typeof raw === 'string' ? JSON.parse(raw) : raw };
};

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<'bookings' | 'reviews'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (t: string) => {
    setLoading(true);
    const [b, r] = await Promise.all([
      api('bookings', 'GET', undefined, t),
      api('reviews', 'GET', undefined, t),
    ]);
    if (b.data.bookings) setBookings(b.data.bookings);
    if (r.data.reviews) setReviews(r.data.reviews);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) fetchData(token);
  }, [token, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const { data } = await api('login', 'POST', { password });
    setLoginLoading(false);
    if (data.ok && data.token) {
      sessionStorage.setItem('admin_token', data.token);
      setToken(data.token);
    } else {
      setLoginError(data.error || 'Ошибка входа');
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    await api('bookings_status', 'PUT', { id, status }, token);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
  };

  const toggleReview = async (id: number, is_published: boolean) => {
    await api('review_publish', 'PUT', { id, is_published }, token);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_published } : r));
  };

  const deleteReview = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return;
    await api('review_delete', 'DELETE', { id }, token);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const logout = () => {
    sessionStorage.removeItem('admin_token');
    setToken('');
  };

  // --- Экран входа ---
  if (!token) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-2xl p-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="ShieldCheck" size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold">Админ-панель</h1>
            <p className="text-muted-foreground text-sm mt-1">Лазурный Берег</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full rounded-xl border border-input bg-background px-4 h-12 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            {loginError && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <Icon name="AlertCircle" size={15} /> {loginError}
              </p>
            )}
            <Button type="submit" disabled={loginLoading} className="w-full rounded-full h-12 bg-primary text-primary-foreground">
              {loginLoading ? <><Icon name="Loader2" size={18} className="mr-2 animate-spin" />Вход...</> : 'Войти'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // --- Панель управления ---
  const newBookings = bookings.filter((b) => b.status === 'new').length;
  const pendingReviews = reviews.filter((r) => !r.is_published).length;

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Шапка */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="ShieldCheck" size={20} className="text-primary" />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-none">Лазурный Берег</div>
              <div className="text-xs text-muted-foreground">Панель управления</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => fetchData(token)} className="gap-2 text-muted-foreground">
              <Icon name="RefreshCw" size={15} /> Обновить
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-muted-foreground">
              <Icon name="LogOut" size={15} /> Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { i: 'CalendarCheck', label: 'Всего заявок', value: bookings.length, color: 'text-primary' },
            { i: 'Clock', label: 'Новых заявок', value: newBookings, color: 'text-secondary' },
            { i: 'MessageSquare', label: 'Всего отзывов', value: reviews.length, color: 'text-primary' },
            { i: 'Eye', label: 'На модерации', value: pendingReviews, color: 'text-accent' },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-5 shadow-sm">
              <Icon name={s.i} size={22} className={`${s.color} mb-2`} />
              <div className="font-display text-3xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('bookings')}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${tab === 'bookings' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-foreground/70 hover:bg-muted'}`}
          >
            <Icon name="CalendarCheck" size={16} /> Бронирования
            {newBookings > 0 && <span className="bg-secondary text-white text-xs rounded-full px-1.5 py-0.5">{newBookings}</span>}
          </button>
          <button
            onClick={() => setTab('reviews')}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${tab === 'reviews' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-foreground/70 hover:bg-muted'}`}
          >
            <Icon name="MessageSquare" size={16} /> Отзывы
            {pendingReviews > 0 && <span className="bg-secondary text-white text-xs rounded-full px-1.5 py-0.5">{pendingReviews}</span>}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Icon name="Loader2" size={32} className="text-primary animate-spin" />
          </div>
        ) : tab === 'bookings' ? (
          /* --- БРОНИРОВАНИЯ --- */
          <div className="space-y-3">
            {bookings.length === 0 && (
              <div className="text-center text-muted-foreground py-16 bg-card rounded-2xl">Заявок пока нет</div>
            )}
            {bookings.map((b) => (
              <div key={b.id} className="bg-card rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 grid md:grid-cols-3 gap-3">
                  <div>
                    <div className="font-semibold">{b.guest_name}</div>
                    <div className="text-sm text-muted-foreground">{b.phone}</div>
                    {b.email && <div className="text-xs text-muted-foreground">{b.email}</div>}
                  </div>
                  <div>
                    <div className="font-medium">{b.room_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {b.check_in} — {b.check_out}
                    </div>
                    <div className="text-xs text-muted-foreground">{b.guests_count} гост.</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{b.created_at}</div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABELS[b.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[b.status]?.label || b.status}
                    </span>
                    {b.comment && <div className="text-xs text-muted-foreground mt-1 italic">«{b.comment}»</div>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {b.status === 'new' && (
                    <Button size="sm" onClick={() => updateBookingStatus(b.id, 'confirmed')}
                      className="rounded-full bg-green-500 hover:bg-green-600 text-white text-xs h-8">
                      <Icon name="Check" size={13} className="mr-1" /> Подтвердить
                    </Button>
                  )}
                  {b.status !== 'cancelled' && b.status !== 'completed' && (
                    <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="rounded-full text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10">
                      <Icon name="X" size={13} className="mr-1" /> Отменить
                    </Button>
                  )}
                  {b.status === 'confirmed' && (
                    <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, 'completed')}
                      className="rounded-full text-xs h-8">
                      <Icon name="CheckCheck" size={13} className="mr-1" /> Завершить
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- ОТЗЫВЫ --- */
          <div className="space-y-3">
            {reviews.length === 0 && (
              <div className="text-center text-muted-foreground py-16 bg-card rounded-2xl">Отзывов пока нет</div>
            )}
            {reviews.map((r) => (
              <div key={r.id} className="bg-card rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {r.guest_name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{r.guest_name}</div>
                      <div className="text-xs text-muted-foreground">{r.created_at}</div>
                    </div>
                    <div className="flex gap-0.5 ml-1">
                      {[1,2,3,4,5].map((s) => (
                        <Icon key={s} name="Star" size={13} className={s <= r.rating ? 'text-accent fill-accent' : 'text-muted-foreground'} />
                      ))}
                    </div>
                    <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${r.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.is_published ? 'Опубликован' : 'На модерации'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed pl-12">«{r.text}»</p>
                </div>
                <div className="flex gap-2 shrink-0 md:flex-col">
                  <Button size="sm" variant="outline" onClick={() => toggleReview(r.id, !r.is_published)}
                    className={`rounded-full text-xs h-8 ${r.is_published ? 'text-muted-foreground' : 'text-green-600 border-green-300 hover:bg-green-50'}`}>
                    <Icon name={r.is_published ? 'EyeOff' : 'Eye'} size={13} className="mr-1" />
                    {r.is_published ? 'Скрыть' : 'Опубликовать'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteReview(r.id)}
                    className="rounded-full text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Icon name="Trash2" size={13} className="mr-1" /> Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
