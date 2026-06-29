import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Получение опубликованных отзывов и добавление нового отзыва."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if event.get('httpMethod') == 'GET':
        cur.execute(
            """
            SELECT id, guest_name, rating, text, created_at
            FROM reviews
            WHERE is_published = true
            ORDER BY created_at DESC
            LIMIT 20
            """
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        reviews = [
            {
                'id': r[0],
                'guest_name': r[1],
                'rating': r[2],
                'text': r[3],
                'created_at': r[4].strftime('%d.%m.%Y'),
            }
            for r in rows
        ]
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'reviews': reviews}, ensure_ascii=False),
        }

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        guest_name = (body.get('guest_name') or '').strip()
        rating = int(body.get('rating') or 0)
        text = (body.get('text') or '').strip()

        if not guest_name or not text or rating < 1 or rating > 5:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Заполните все поля и укажите оценку от 1 до 5'}, ensure_ascii=False),
            }

        cur.execute(
            'INSERT INTO reviews (guest_name, rating, text) VALUES (%s, %s, %s) RETURNING id',
            (guest_name, rating, text),
        )
        review_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True, 'id': review_id, 'message': 'Спасибо за отзыв! Он появится после проверки.'}, ensure_ascii=False),
        }

    cur.close()
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
    }
