import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { IMG, NAV, RoomData } from './constants';

interface HeroNavProps {
  scrollTo: (id: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  rooms: RoomData[];
}

export default function HeroNav({ scrollTo, menuOpen, setMenuOpen, rooms }: HeroNavProps) {
  const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

  return (
    <>
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
            {rooms.map((r) => (
              <div key={r.id} className="group bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={r.image_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-secondary text-white px-4 py-1.5 rounded-full font-semibold text-sm">
                    от {fmt(r.price_low)}/ночь
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold mb-2">{r.name}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Icon name="Maximize2" size={15} /> {r.area} м²</span>
                    <span className="flex items-center gap-1"><Icon name="Users" size={15} /> {r.max_guests} гост.</span>
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
    </>
  );
}
