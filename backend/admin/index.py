import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Админ-панель: авторизация, список бронирований, управление отзывами.
    Параметр action: login | bookings | bookings_status | reviews | review_publish | review_delete
    """

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    method = event.get('httpMethod', 'GET')
    qs = event.get('queryStringParameters') or {}
    action = qs.get('action', '')
    headers = event.get('headers') or {}
    token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
    admin_password = os.environ.get('ADMIN_PASSWORD', '')

    # --- Авторизация ---
    if action == 'login' and method == 'POST':
        body = json.loads(event.get('body') or '{}')
        password = (body.get('password') or '').strip()
        if password and password == admin_password:
            return ok({'token': admin_password})
        return err(401, 'Неверный пароль')

    # --- Все остальные — требуют токен ---
    if not admin_password or token != admin_password:
        return err(401, 'Не авторизован')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        # GET bookings
        if action == 'bookings' and method == 'GET':
            cur.execute(
                """SELECT id, guest_name, phone, email, room_name, check_in, check_out,
                          guests_count, status, comment, created_at
                   FROM bookings ORDER BY created_at DESC LIMIT 100"""
            )
            rows = cur.fetchall()
            return ok({'bookings': [
                {'id': r[0], 'guest_name': r[1], 'phone': r[2], 'email': r[3],
                 'room_name': r[4], 'check_in': str(r[5]), 'check_out': str(r[6]),
                 'guests_count': r[7], 'status': r[8], 'comment': r[9],
                 'created_at': r[10].strftime('%d.%m.%Y %H:%M')}
                for r in rows
            ]})

        # PUT bookings status
        if action == 'bookings_status' and method == 'PUT':
            body = json.loads(event.get('body') or '{}')
            booking_id = int(body.get('id', 0))
            status = body.get('status', 'new')
            cur.execute('UPDATE bookings SET status = %s WHERE id = %s', (status, booking_id))
            conn.commit()
            return ok({})

        # GET reviews (все, включая неопубликованные)
        if action == 'reviews' and method == 'GET':
            cur.execute(
                """SELECT id, guest_name, rating, text, is_published, created_at
                   FROM reviews ORDER BY created_at DESC LIMIT 100"""
            )
            rows = cur.fetchall()
            return ok({'reviews': [
                {'id': r[0], 'guest_name': r[1], 'rating': r[2], 'text': r[3],
                 'is_published': r[4], 'created_at': r[5].strftime('%d.%m.%Y %H:%M')}
                for r in rows
            ]})

        # PUT review publish/unpublish
        if action == 'review_publish' and method == 'PUT':
            body = json.loads(event.get('body') or '{}')
            review_id = int(body.get('id', 0))
            is_published = bool(body.get('is_published', True))
            cur.execute('UPDATE reviews SET is_published = %s WHERE id = %s', (is_published, review_id))
            conn.commit()
            return ok({})

        # DELETE review
        if action == 'review_delete' and method == 'DELETE':
            body = json.loads(event.get('body') or '{}')
            review_id = int(body.get('id', 0))
            cur.execute('DELETE FROM reviews WHERE id = %s', (review_id,))
            conn.commit()
            return ok({})

        return err(404, 'Неизвестное действие')

    finally:
        cur.close()
        conn.close()


def ok(data: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, **data}, ensure_ascii=False),
    }


def err(code: int, message: str) -> dict:
    return {
        'statusCode': code,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': False, 'error': message}, ensure_ascii=False),
    }