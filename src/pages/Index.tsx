import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const BOOKING_URL = 'https://functions.poehali.dev/a74f5703-07a3-4d7d-8a8b-835e61408958';
const REVIEWS_URL = 'https://functions.poehali.dev/fbd33beb-7570-4a91-805b-79f355257570';

const IMG = {
  room: 'https://cdn.poehali.dev/projects/9a519718-fc67-426b-b046-0b872bccf557/files/f47c3690-850e-437d-80c5-a8b5f209ee72.jpg',
  pool: 'https://cdn.poehali.dev/projects/9a519718-fc67-426b-b046-0b872bccf557/files/c469aa56-4c94-4f3c-b3a7-a7fb4f4cf063.jpg',
  area: 'https://cdn.poehali.dev/projects/9a519718-fc67-426b-b046-0b872bccf557/files/60e6c67d-c368-497c-89e2-7de7ea477752.jpg',
};

const NAV = [
  { id: 'hero', label: 'Главная' },
  { id: 'about', label: 'О нас' },
  { id: 'rooms', label: 'Номера' },
  { id: 'pool', label: 'Бассейн' },
  { id: 'gallery', label: 'Галерея' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'price', label: 'Прайс' },
  { id: 'contacts', label: 'Контакты' },
  { id: 'booking', label: 'Бронирование' },
];

const ROOMS = [
  { name: 'Стандарт', img: IMG.room, price: '4 500 ₽', area: '22 м²', guests: '2 гостя', features: ['Двуспальная кровать', 'Кондиционер', 'Wi-Fi'] },
  { name: 'Комфорт', img: IMG.area, price: '6 800 ₽', area: '34 м²', guests: '3 гостя', features: ['Балкон с видом', 'Мини-кухня', 'Smart TV'] },
  { name: 'Люкс', img: IMG.pool, price: '9 900 ₽', area: '48 м²', guests: '4 гостя', features: ['Панорамные окна', 'Джакузи', 'Терраса'] },
];

const PRICE = [
  { room: 'Стандарт', low: '4 500 ₽', high: '5 900 ₽', breakfast: 'включён' },
  { room: 'Комфорт', low: '6 800 ₽', high: '8 200 ₽', breakfast: 'включён' },
  { room: 'Люкс', low: '9 900 ₽', high: '12 500 ₽', breakfast: 'включён' },
];

const GALLERY = [
  { src: IMG.room, cat: 'Номера' },
  { src: IMG.pool, cat: 'Бассейн' },
  { src: IMG.area, cat: 'Территория' },
  { src: IMG.pool, cat: 'Бассейн' },
  { src: IMG.room, cat: 'Номера' },
  { src: IMG.area, cat: 'Территория' },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('Все');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const [reviews, setReviews] = useState<{ id: number; guest_name: string; rating: number; text: string; created_at: string }[]>([]);
  const [reviewForm, setReviewForm] = useState({ guest_name: '', rating: 5, text: '' });
  const [reviewState, setReviewState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    fetch(REVIEWS_URL)
      .then((r) => r.json())
      .then((d) => {
        const raw = typeof d === 'string' ? JSON.parse(d) : d;
        setReviews(raw.reviews || []);
      })
      .catch(() => {});
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewState('loading');
    try {
      const res = await fetch(REVIEWS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      const raw = await res.json();
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (res.ok && data.ok) {
        setReviewState('success');
        setReviewMsg(data.message || 'Спасибо за отзыв!');
        setReviewForm({ guest_name: '', rating: 5, text: '' });
      } else {
        setReviewState('error');
        setReviewMsg(data.error || 'Ошибка. Попробуйте ещё раз.');
      }
    } catch {
      setReviewState('error');
      setReviewMsg('Ошибка соединения. Попробуйте ещё раз.');
    }
  };

  const [form, setForm] = useState({ check_in: '', check_out: '', room_name: ROOMS[0].name, guest_name: '', phone: '' });
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formMsg, setFormMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    try {
      const res = await fetch(BOOKING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setFormState('success');
        setFormMsg(data.message || 'Заявка принята!');
        setForm({ check_in: '', check_out: '', room_name: ROOMS[0].name, guest_name: '', phone: '' });
      } else {
        setFormState('error');
        setFormMsg(data.error || 'Ошибка отправки. Попробуйте ещё раз.');
      }
    } catch {
      setFormState('error');
      setFormMsg('Ошибка соединения. Попробуйте ещё раз.');
    }
  };
  const cats = ['Все', 'Номера', 'Бассейн', 'Территория'];
  const shown = filter === 'Все' ? GALLERY : GALLERY.filter((g) => g.cat === filter);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => scrollTo('hero')} className="font-display text-2xl font-bold text-gradient">
            Лазурный Берег
          </button>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                {n.label}
              </button>
            ))}
          </nav>
          <button className="lg:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={26} />
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden glass border-t border-border/50 animate-fade-in">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="block w-full text-left px-6 py-3 text-foreground/80 hover:bg-primary/10">
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0">
          <img src={IMG.pool} alt="Бассейн" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-foreground/40 to-secondary/40" />
        </div>
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-accent/40 animate-blob blur-2xl" />
        <div className="container relative z-10 text-white">
          <p className="animate-float-up font-medium tracking-[0.3em] uppercase text-sm mb-4" style={{ animationDelay: '0.1s' }}>
            Отдых у моря · 365 дней в году
          </p>
          <h1 className="animate-float-up font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] max-w-4xl" style={{ animationDelay: '0.25s' }}>
            Где лето <span className="italic text-accent">никогда</span> не заканчивается
          </h1>
          <p className="animate-float-up mt-6 text-lg md:text-xl text-white/90 max-w-xl" style={{ animationDelay: '0.4s' }}>
            Уютные номера, тёплый бассейн и зелёная территория для вашего идеального отдыха.
          </p>
          <div className="animate-float-up flex flex-wrap gap-4 mt-10" style={{ animationDelay: '0.55s' }}>
            <Button size="lg" onClick={() => scrollTo('booking')} className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 h-14 text-base hover-scale">
              <Icon name="CalendarHeart" size={20} className="mr-2" /> Забронировать
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo('rooms')} className="rounded-full px-8 h-14 text-base bg-white/10 border-white/60 text-white hover:bg-white/20">
              Смотреть номера
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-secondary font-semibold tracking-widest uppercase text-sm mb-3">О нас</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Дом, в который хочется возвращаться</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              «Лазурный Берег» — это уютный дом отдыха, где забота о гостях чувствуется в каждой детали. Просторные номера, чистейший бассейн и ухоженная территория ждут вас круглый год.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { n: '12', l: 'лет принимаем гостей' },
                { n: '48', l: 'комфортных номеров' },
                { n: '4.9', l: 'средняя оценка' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-4xl font-bold text-gradient">{s.n}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={IMG.area} alt="Территория" className="rounded-3xl w-full aspect-[4/5] object-cover shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white">
                  <Icon name="Waves" size={24} />
                </div>
                <div>
                  <div className="font-semibold">Бассейн с подогревом</div>
                  <div className="text-sm text-muted-foreground">+28°C весь год</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="py-24 bg-muted/40">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-secondary font-semibold tracking-widest uppercase text-sm mb-3">Номера</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Выберите свой уголок уюта</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {ROOMS.map((r) => (
              <div key={r.name} className="group bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-secondary text-white px-4 py-1.5 rounded-full font-semibold text-sm">
                    от {r.price}/ночь
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold mb-2">{r.name}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Icon name="Maximize2" size={15} /> {r.area}</span>
                    <span className="flex items-center gap-1"><Icon name="Users" size={15} /> {r.guests}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {r.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Icon name="Check" size={16} className="text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => scrollTo('booking')} className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Забронировать
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POOL */}
      <section id="pool" className="relative py-32">
        <div className="absolute inset-0">
          <img src={IMG.pool} alt="Бассейн" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/75" />
        </div>
        <div className="container relative z-10 text-white text-center max-w-3xl mx-auto">
          <Icon name="Waves" size={48} className="mx-auto mb-6 text-accent" />
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Открытый бассейн с подогревом</h2>
          <p className="text-lg text-white/90 mb-10">
            Кристально чистая вода +28°C, шезлонги, зона отдыха и детский бассейн. Купайтесь в любое время года под пальмами и солнцем.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { i: 'Thermometer', t: '+28°C', s: 'температура воды' },
              { i: 'Clock', t: '7:00–22:00', s: 'часы работы' },
              { i: 'Baby', t: 'Детский', s: 'отдельный бассейн' },
              { i: 'Sun', t: '50 мест', s: 'шезлонги' },
            ].map((x) => (
              <div key={x.s} className="glass rounded-2xl p-5 text-foreground">
                <Icon name={x.i} size={26} className="mx-auto mb-2 text-primary" />
                <div className="font-display text-xl font-bold">{x.t}</div>
                <div className="text-xs text-muted-foreground">{x.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-secondary font-semibold tracking-widest uppercase text-sm mb-3">Галерея</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Загляните внутрь</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === c ? 'bg-secondary text-white shadow-lg' : 'bg-muted text-foreground/70 hover:bg-muted/70'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {shown.map((g, i) => (
            <button
              key={i}
              onClick={() => setLightbox(g.src)}
              className="group relative overflow-hidden rounded-2xl aspect-square animate-fade-in"
            >
              <img src={g.src} alt={g.cat} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                <Icon name="ZoomIn" size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{g.cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-[60] bg-foreground/90 flex items-center justify-center p-6 animate-fade-in">
          <button className="absolute top-6 right-6 text-white"><Icon name="X" size={32} /></button>
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-2xl shadow-2xl animate-scale-in" />
        </div>
      )}

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-muted/40">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-secondary font-semibold tracking-widest uppercase text-sm mb-3">Отзывы</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Что говорят наши гости</h2>
          </div>

          {/* Карточки отзывов */}
          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
              {reviews.map((r) => (
                <div key={r.id} className="bg-card rounded-3xl p-6 shadow-md flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-lg">
                        {r.guest_name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{r.guest_name}</div>
                        <div className="text-xs text-muted-foreground">{r.created_at}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Icon key={s} name="Star" size={14} className={s <= r.rating ? 'text-accent fill-accent' : 'text-muted-foreground'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">"{r.text}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mb-14">Будьте первым, кто оставит отзыв!</p>
          )}

          {/* Форма отзыва */}
          <div className="max-w-xl mx-auto bg-card rounded-3xl p-8 shadow-xl">
            <h3 className="font-display text-2xl font-bold mb-6">Оставить отзыв</h3>
            {reviewState === 'success' ? (
              <div className="flex flex-col items-center py-8 gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="CheckCircle2" size={32} />
                </div>
                <p className="font-semibold">{reviewMsg}</p>
                <Button variant="outline" className="rounded-full" onClick={() => setReviewState('idle')}>
                  Написать ещё
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleReviewSubmit}>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Ваше имя</label>
                  <input required type="text" placeholder="Иван Иванов"
                    value={reviewForm.guest_name}
                    onChange={(e) => setReviewForm({ ...reviewForm, guest_name: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 h-12 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Оценка</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                        className="transition-transform hover:scale-110">
                        <Icon name="Star" size={28} className={s <= reviewForm.rating ? 'text-accent fill-accent' : 'text-muted-foreground'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Ваш отзыв</label>
                  <textarea required rows={4} placeholder="Поделитесь впечатлениями об отдыхе..."
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
                </div>
                {reviewState === 'error' && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <Icon name="AlertCircle" size={16} /> {reviewMsg}
                  </p>
                )}
                <Button type="submit" size="lg" disabled={reviewState === 'loading'}
                  className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-white h-14 text-base">
                  {reviewState === 'loading'
                    ? <><Icon name="Loader2" size={20} className="mr-2 animate-spin" /> Отправляем...</>
                    : <><Icon name="Send" size={20} className="mr-2" /> Отправить отзыв</>
                  }
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* PRICE */}
      <section id="price" className="py-24 bg-muted/40">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-secondary font-semibold tracking-widest uppercase text-sm mb-3">Прайс</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Стоимость проживания</h2>
            <p className="text-muted-foreground mt-3">Цена за номер в сутки. Завтрак включён в стоимость.</p>
          </div>
          <div className="max-w-3xl mx-auto bg-card rounded-3xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-4 bg-primary text-primary-foreground font-semibold text-sm md:text-base">
              <div className="p-4 md:p-5">Номер</div>
              <div className="p-4 md:p-5 text-center">Будни</div>
              <div className="p-4 md:p-5 text-center">Выходные</div>
              <div className="p-4 md:p-5 text-center">Завтрак</div>
            </div>
            {PRICE.map((p, i) => (
              <div key={p.room} className={`grid grid-cols-4 items-center ${i % 2 ? 'bg-muted/30' : ''}`}>
                <div className="p-4 md:p-5 font-display text-lg font-bold">{p.room}</div>
                <div className="p-4 md:p-5 text-center">{p.low}</div>
                <div className="p-4 md:p-5 text-center">{p.high}</div>
                <div className="p-4 md:p-5 text-center text-primary"><Icon name="Check" size={18} className="inline" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS + BOOKING */}
      <section id="contacts" className="py-24 container">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <p className="text-secondary font-semibold tracking-widest uppercase text-sm mb-3">Контакты</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">Мы всегда на связи</h2>
            <div className="space-y-5">
              {[
                { i: 'MapPin', t: 'Адрес', v: 'пос. Лазурный, ул. Морская, 15' },
                { i: 'Phone', t: 'Телефон', v: '+7 (800) 555-35-35' },
                { i: 'Mail', t: 'Почта', v: 'hello@lazurnybereg.ru' },
                { i: 'Clock', t: 'Ресепшен', v: 'Круглосуточно' },
              ].map((c) => (
                <div key={c.t} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon name={c.i} size={22} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{c.t}</div>
                    <div className="font-semibold">{c.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING */}
          <div id="booking" className="bg-card rounded-3xl p-8 shadow-2xl scroll-mt-24">
            <h3 className="font-display text-3xl font-bold mb-6">Бронирование</h3>

            {formState === 'success' ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="CheckCircle2" size={36} />
                </div>
                <p className="text-lg font-semibold">{formMsg}</p>
                <Button variant="outline" className="rounded-full mt-2" onClick={() => setFormState('idle')}>
                  Новая заявка
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Заезд</label>
                    <input required type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-4 h-12 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Выезд</label>
                    <input required type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-4 h-12 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Номер</label>
                  <select value={form.room_name} onChange={(e) => setForm({ ...form, room_name: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 h-12 focus:ring-2 focus:ring-primary outline-none">
                    {ROOMS.map((r) => <option key={r.name} value={r.name}>{r.name} — от {r.price}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Ваше имя</label>
                  <input required type="text" placeholder="Иван Иванов" value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 h-12 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Телефон</label>
                  <input required type="tel" placeholder="+7 (___) ___-__-__" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 h-12 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                {formState === 'error' && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <Icon name="AlertCircle" size={16} /> {formMsg}
                  </p>
                )}
                <Button type="submit" size="lg" disabled={formState === 'loading'}
                  className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-white h-14 text-base">
                  {formState === 'loading'
                    ? <><Icon name="Loader2" size={20} className="mr-2 animate-spin" /> Отправляем...</>
                    : <><Icon name="CalendarHeart" size={20} className="mr-2" /> Отправить заявку</>
                  }
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background/80 py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-2xl font-bold text-white">Лазурный Берег</div>
          <p className="text-sm">© 2026 Дом отдыха «Лазурный Берег». Все права защищены.</p>
          <div className="flex gap-3">
            {['Instagram', 'Send', 'Phone'].map((s) => (
              <a key={s} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Icon name={s} size={18} className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;