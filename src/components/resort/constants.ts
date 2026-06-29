export const BOOKING_URL = 'https://functions.poehali.dev/a74f5703-07a3-4d7d-8a8b-835e61408958';
export const REVIEWS_URL = 'https://functions.poehali.dev/fbd33beb-7570-4a91-805b-79f355257570';
export const ROOMS_URL = 'https://functions.poehali.dev/27ae9fb7-d022-42cb-9756-7033783f34ab';

export const IMG = {
  room: 'https://cdn.poehali.dev/projects/9a519718-fc67-426b-b046-0b872bccf557/files/f47c3690-850e-437d-80c5-a8b5f209ee72.jpg',
  pool: 'https://cdn.poehali.dev/projects/9a519718-fc67-426b-b046-0b872bccf557/files/c469aa56-4c94-4f3c-b3a7-a7fb4f4cf063.jpg',
  area: 'https://cdn.poehali.dev/projects/9a519718-fc67-426b-b046-0b872bccf557/files/60e6c67d-c368-497c-89e2-7de7ea477752.jpg',
};

export const NAV = [
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

export const ROOMS = [
  { name: 'Стандарт', img: IMG.room, price: '4 500 ₽', area: '22 м²', guests: '2 гостя', features: ['Двуспальная кровать', 'Кондиционер', 'Wi-Fi'] },
  { name: 'Комфорт', img: IMG.area, price: '6 800 ₽', area: '34 м²', guests: '3 гостя', features: ['Балкон с видом', 'Мини-кухня', 'Smart TV'] },
  { name: 'Люкс', img: IMG.pool, price: '9 900 ₽', area: '48 м²', guests: '4 гостя', features: ['Панорамные окна', 'Джакузи', 'Терраса'] },
];

export const PRICE = [
  { room: 'Стандарт', low: '4 500 ₽', high: '5 900 ₽', breakfast: 'включён' },
  { room: 'Комфорт', low: '6 800 ₽', high: '8 200 ₽', breakfast: 'включён' },
  { room: 'Люкс', low: '9 900 ₽', high: '12 500 ₽', breakfast: 'включён' },
];

export type RoomData = {
  id: number;
  name: string;
  description: string;
  area: number;
  max_guests: number;
  price_low: number;
  price_high: number;
  price_weekend: number;
  image_url: string;
  features: string[];
};

export const GALLERY = [
  { src: IMG.room, cat: 'Номера' },
  { src: IMG.pool, cat: 'Бассейн' },
  { src: IMG.area, cat: 'Территория' },
  { src: IMG.pool, cat: 'Бассейн' },
  { src: IMG.room, cat: 'Номера' },
  { src: IMG.area, cat: 'Территория' },
];