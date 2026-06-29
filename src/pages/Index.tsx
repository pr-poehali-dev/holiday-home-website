import { useState, useEffect } from 'react';
import { REVIEWS_URL } from '@/components/resort/constants';
import HeroNav from '@/components/resort/HeroNav';
import GalleryReviews from '@/components/resort/GalleryReviews';
import PriceContacts from '@/components/resort/PriceContacts';

type Review = { id: number; guest_name: string; rating: number; text: string; created_at: string };

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch(REVIEWS_URL)
      .then((r) => r.json())
      .then((d) => {
        const raw = typeof d === 'string' ? JSON.parse(d) : d;
        setReviews(raw.reviews || []);
      })
      .catch(() => {});
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <HeroNav scrollTo={scrollTo} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <GalleryReviews reviews={reviews} setReviews={setReviews} />
      <PriceContacts scrollTo={scrollTo} />
    </div>
  );
};

export default Index;
