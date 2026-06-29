import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Создание заявки на бронирование номера."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')

    guest_name = (body.get('guest_name') or '').strip()
    phone = (body.get('phone') or '').strip()
    email = (body.get('email') or '').strip() or None
    room_name = (body.get('room_name') or '').strip()
    check_in = body.get('check_in')
    check_out = body.get('check_out')
    guests_count = int(body.get('guests_count') or 1)
    comment = (body.get('comment') or '').strip() or None

    if not guest_name or not phone or not room_name or not check_in or not check_out:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполните все обязательные поля'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO bookings (guest_name, phone, email, room_name, check_in, check_out, guests_count, comment)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (guest_name, phone, email, room_name, check_in, check_out, guests_count, comment),
    )
    booking_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'id': booking_id, 'message': 'Заявка принята! Мы свяжемся с вами в ближайшее время.'}),
    }
