import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Номера: GET — список для сайта, PUT — обновление фото/цен из админки."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    method = event.get('httpMethod', 'GET')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute(
                """SELECT id, name, description, area, max_guests,
                          price_low, price_high, price_weekend, image_url, features
                   FROM rooms ORDER BY price_low ASC"""
            )
            rows = cur.fetchall()
            rooms = [
                {
                    'id': r[0],
                    'name': r[1],
                    'description': r[2],
                    'area': r[3],
                    'max_guests': r[4],
                    'price_low': r[5],
                    'price_high': r[6],
                    'price_weekend': r[7],
                    'image_url': r[8],
                    'features': list(r[9]) if r[9] else [],
                }
                for r in rows
            ]
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'rooms': rooms}, ensure_ascii=False),
            }

        if method == 'PUT':
            headers = event.get('headers') or {}
            token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
            admin_password = os.environ.get('ADMIN_PASSWORD', '')
            if not admin_password or token != admin_password:
                return {
                    'statusCode': 401,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'ok': False, 'error': 'Не авторизован'}, ensure_ascii=False),
                }

            body = json.loads(event.get('body') or '{}')
            room_id = int(body.get('id', 0))
            fields = []
            values = []

            if 'image_url' in body:
                fields.append('image_url = %s')
                values.append(body['image_url'])
            if 'price_low' in body:
                fields.append('price_low = %s')
                values.append(int(body['price_low']))
            if 'price_high' in body:
                fields.append('price_high = %s')
                values.append(int(body['price_high']))
            if 'price_weekend' in body:
                fields.append('price_weekend = %s')
                values.append(int(body['price_weekend']))
            if 'name' in body:
                fields.append('name = %s')
                values.append(body['name'])
            if 'description' in body:
                fields.append('description = %s')
                values.append(body['description'])
            if 'area' in body:
                fields.append('area = %s')
                values.append(int(body['area']))
            if 'max_guests' in body:
                fields.append('max_guests = %s')
                values.append(int(body['max_guests']))
            if 'features' in body:
                fields.append('features = %s')
                values.append(body['features'])

            if not fields:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'ok': False, 'error': 'Нет полей для обновления'}, ensure_ascii=False),
                }

            values.append(room_id)
            cur.execute(
                f"UPDATE rooms SET {', '.join(fields)} WHERE id = %s",
                values,
            )
            conn.commit()
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'ok': True}, ensure_ascii=False),
            }

        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    finally:
        cur.close()
        conn.close()
