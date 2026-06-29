import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { PRICE, ROOMS, BOOKING_URL } from './constants';

interface PriceContactsProps {
  scrollTo: (id: string) => void;
}

export default function PriceContacts({ scrollTo }: PriceContactsProps) {
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

  return (
    <>
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
    </>
  );
}
