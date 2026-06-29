ALTER TABLE t_p89038360_holiday_home_website.rooms
  ADD COLUMN IF NOT EXISTS price_weekend INTEGER NOT NULL DEFAULT 0;

INSERT INTO t_p89038360_holiday_home_website.rooms
  (name, description, area, max_guests, price_low, price_high, price_weekend, image_url, features)
VALUES
  (
    'Стандарт',
    'Уютный номер с двуспальной кроватью и всем необходимым для комфортного отдыха.',
    22, 2, 4500, 5900, 5900,
    'https://cdn.poehali.dev/projects/9a519718-fc67-426b-b046-0b872bccf557/files/f47c3690-850e-437d-80c5-a8b5f209ee72.jpg',
    ARRAY['Двуспальная кровать', 'Кондиционер', 'Wi-Fi']
  ),
  (
    'Комфорт',
    'Просторный номер с балконом и мини-кухней — идеально для длительного отдыха.',
    34, 3, 6800, 8200, 8200,
    'https://cdn.poehali.dev/projects/9a519718-fc67-426b-b046-0b872bccf557/files/60e6c67d-c368-497c-89e2-7de7ea477752.jpg',
    ARRAY['Балкон с видом', 'Мини-кухня', 'Smart TV']
  ),
  (
    'Люкс',
    'Роскошный номер с панорамными окнами, джакузи и личной террасой.',
    48, 4, 9900, 12500, 12500,
    'https://cdn.poehali.dev/projects/9a519718-fc67-426b-b046-0b872bccf557/files/c469aa56-4c94-4f3c-b3a7-a7fb4f4cf063.jpg',
    ARRAY['Панорамные окна', 'Джакузи', 'Терраса']
  );