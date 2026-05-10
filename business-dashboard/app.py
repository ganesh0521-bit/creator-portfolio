from flask import Flask, request, jsonify, send_from_directory
from database import get_db_connection, init_db
import os
import time

app = Flask(__name__, static_folder='.', static_url_path='')

# Initialize the database when the app starts
init_db()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# --- Customers API ---
@app.route('/api/customers', methods=['GET'])
def get_customers():
    conn = get_db_connection()
    customers = conn.execute('SELECT * FROM customers').fetchall()
    conn.close()
    return jsonify([dict(row) for row in customers])

@app.route('/api/customers', methods=['POST'])
def add_customer():
    data = request.json
    conn = get_db_connection()
    cursor = conn.execute(
        'INSERT INTO customers (name, company, email, status) VALUES (?, ?, ?, ?)',
        (data['name'], data['company'], data['email'], data['status'])
    )
    conn.commit()
    new_id = cursor.lastrowid
    
    # Log Activity
    conn.execute(
        'INSERT INTO activity (action, details, time, icon) VALUES (?, ?, ?, ?)',
        ('New Client', f"{data['name']} was added", "Just now", "bx-user-plus")
    )
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': new_id,
        'name': data['name'],
        'company': data['company'],
        'email': data['email'],
        'status': data['status']
    }), 201

@app.route('/api/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    data = request.json
    conn = get_db_connection()
    conn.execute(
        'UPDATE customers SET name = ?, company = ?, email = ?, status = ? WHERE id = ?',
        (data['name'], data['company'], data['email'], data['status'], id)
    )
    # Log Activity
    conn.execute(
        'INSERT INTO activity (action, details, time, icon) VALUES (?, ?, ?, ?)',
        ('Client Updated', f"{data['name']} details updated", "Just now", "bx-edit")
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    conn = get_db_connection()
    
    # Get name for logging
    customer = conn.execute('SELECT name FROM customers WHERE id = ?', (id,)).fetchone()
    if customer:
        conn.execute(
            'INSERT INTO activity (action, details, time, icon) VALUES (?, ?, ?, ?)',
            ('Client Deleted', f"{customer['name']} was removed", "Just now", "bx-trash")
        )
        
    conn.execute('DELETE FROM customers WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})


# --- Account API ---
@app.route('/api/account', methods=['GET'])
def get_account():
    conn = get_db_connection()
    account = conn.execute('SELECT * FROM account WHERE id = 1').fetchone()
    conn.close()
    return jsonify(dict(account))

@app.route('/api/account', methods=['PUT'])
def update_account():
    data = request.json
    conn = get_db_connection()
    conn.execute(
        'UPDATE account SET name = ?, email = ?, role = ? WHERE id = 1',
        (data['name'], data['email'], data['role'])
    )
    # Log Activity
    conn.execute(
        'INSERT INTO activity (action, details, time, icon) VALUES (?, ?, ?, ?)',
        ('Account Updated', 'Profile details were modified', "Just now", "bx-user")
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True})


# --- Activity API ---
@app.route('/api/activity', methods=['GET'])
def get_activity():
    conn = get_db_connection()
    # Get latest 5 activities, ordered by id descending
    activity = conn.execute('SELECT * FROM activity ORDER BY id DESC LIMIT 5').fetchall()
    conn.close()
    return jsonify([dict(row) for row in activity])


# --- Stats API ---
@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db_connection()
    stats = conn.execute('SELECT * FROM stats ORDER BY id ASC').fetchall()
    conn.close()
    
    labels = [row['month'] for row in stats]
    data = [row['revenue'] for row in stats]
    
    return jsonify({
        'labels': labels,
        'data': data
    })

# --- Services API ---
@app.route('/api/services', methods=['GET'])
def get_services():
    conn = get_db_connection()
    services = conn.execute('SELECT * FROM services').fetchall()
    conn.close()
    return jsonify([dict(row) for row in services])

@app.route('/api/services', methods=['POST'])
def add_service():
    data = request.json
    conn = get_db_connection()
    cursor = conn.execute(
        'INSERT INTO services (title, description, price, icon) VALUES (?, ?, ?, ?)',
        (data['title'], data['description'], data['price'], data['icon'])
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'id': new_id,
        'title': data['title'],
        'description': data['description'],
        'price': data['price'],
        'icon': data['icon']
    }), 201

@app.route('/api/services/<int:id>', methods=['PUT'])
def update_service(id):
    data = request.json
    conn = get_db_connection()
    conn.execute(
        'UPDATE services SET title = ?, description = ?, price = ?, icon = ? WHERE id = ?',
        (data['title'], data['description'], data['price'], data['icon'], id)
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/services/<int:id>', methods=['DELETE'])
def delete_service(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM services WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})


# --- Notifications API ---
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    conn = get_db_connection()
    notifications = conn.execute('SELECT * FROM notifications ORDER BY id DESC LIMIT 10').fetchall()
    conn.close()
    return jsonify([dict(row) for row in notifications])

@app.route('/api/notifications/read_all', methods=['PUT'])
def read_all_notifications():
    conn = get_db_connection()
    conn.execute('UPDATE notifications SET is_read = 1 WHERE is_read = 0')
    conn.commit()
    conn.close()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
