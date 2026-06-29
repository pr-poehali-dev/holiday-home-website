import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { GALLERY, REVIEWS_URL } from './constants';

type Review = { id: number; guest_name: string; rating: number; text: string; created_at: string };

interface GalleryReviewsProps {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

export default function GalleryReviews({ reviews, setReviews }: GalleryReviewsProps) {
  const [filter, setFilter] = useState('Все');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const [reviewForm, setReviewForm] = useState({ guest_name: '', rating: 5, text: '' });
  const [reviewState, setReviewState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reviewMsg, setReviewMsg] = useState('');

  const cats = ['Все', 'Номера', 'Бассейн', 'Территория'];
  const shown = filter === 'Все' ? GALLERY : GALLERY.filter((g) => g.cat === filter);

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

  return (
    <>
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
    </>
  );
}
