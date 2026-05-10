import sqlite3
import os

DB_PATH = 'crm.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    
    # 1. Customers Table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            company TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT NOT NULL
        )
    ''')
    
    # 2. Account Table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS account (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            role TEXT NOT NULL
        )
    ''')
    
    # 3. Activity Table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            details TEXT NOT NULL,
            time TEXT NOT NULL,
            icon TEXT NOT NULL
        )
    ''')
    
    # 4. Stats Table (Revenue)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            month TEXT NOT NULL,
            revenue INTEGER NOT NULL
        )
    ''')
    
    # 5. Services Table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            price TEXT NOT NULL,
            icon TEXT NOT NULL
        )
    ''')
    
    # 6. Notifications Table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            time TEXT NOT NULL,
            is_read INTEGER DEFAULT 0
        )
    ''')
    
    cursor = conn.cursor()
    
    # Seed Customers
    cursor.execute('SELECT COUNT(*) FROM customers')
    if cursor.fetchone()[0] == 0:
        initial_data = [
            ('Alice Freeman', 'TechNova', 'alice@technova.com', 'Active'),
            ('Bob Smith', 'Global Industries', 'bob@global.com', 'Inactive'),
            ('Charlie Davis', 'Design Co.', 'charlie@designco.com', 'Active'),
            ('Diana Prince', 'Amazonia Corp', 'diana@amazonia.com', 'Active')
        ]
        conn.executemany('INSERT INTO customers (name, company, email, status) VALUES (?, ?, ?, ?)', initial_data)
    
    # Seed Account
    cursor.execute('SELECT COUNT(*) FROM account')
    if cursor.fetchone()[0] == 0:
        conn.execute('INSERT INTO account (id, name, email, role) VALUES (1, "Admin User", "admin@nexus.com", "CEO & Founder")')
        
    # Seed Activity
    cursor.execute('SELECT COUNT(*) FROM activity')
    if cursor.fetchone()[0] == 0:
        activities = [
            ('Invoice Paid', 'TechNova paid invoice #1042', '2 hours ago', 'bx-check-circle'),
            ('New Customer', 'Diana Prince was added', '5 hours ago', 'bx-user-plus'),
            ('Project Updated', 'Design Co. approved new milestone', '1 day ago', 'bx-edit')
        ]
        conn.executemany('INSERT INTO activity (action, details, time, icon) VALUES (?, ?, ?, ?)', activities)
        
    # Seed Stats
    cursor.execute('SELECT COUNT(*) FROM stats')
    if cursor.fetchone()[0] == 0:
        stats_data = [
            ('Jan', 45000), ('Feb', 52000), ('Mar', 48000), 
            ('Apr', 61000), ('May', 59000), ('Jun', 75000)
        ]
        conn.executemany('INSERT INTO stats (month, revenue) VALUES (?, ?)', stats_data)
        
    # Seed Services
    cursor.execute('SELECT COUNT(*) FROM services')
    if cursor.fetchone()[0] == 0:
        services_data = [
            ('Video Shooting', 'High-quality cinematic 4K video shooting for events, music videos, and commercials.', 'Starting at $500/day', 'bx-video-recording'),
            ('Video Editing', 'Professional post-production, cutting, and transitions using Premiere Pro.', 'Starting at $250/project', 'bx-cut'),
            ('Color Grading', 'Cinematic color correction and grading to give your footage a premium look.', 'Starting at $100/video', 'bx-palette'),
            ('Drone Footage', 'Breathtaking aerial cinematography with licensed drone operators.', 'Starting at $300/session', 'bx-paper-plane')
        ]
        conn.executemany('INSERT INTO services (title, description, price, icon) VALUES (?, ?, ?, ?)', services_data)

    # Seed Notifications
    cursor.execute('SELECT COUNT(*) FROM notifications')
    if cursor.fetchone()[0] == 0:
        notifications_data = [
            ('Client Alice sent you a message.', '10 mins ago', 0),
            ('New payment received for Video Shoot.', '1 hour ago', 0),
            ('Reminder: Drone shoot tomorrow.', '2 hours ago', 0)
        ]
        conn.executemany('INSERT INTO notifications (message, time, is_read) VALUES (?, ?, ?)', notifications_data)

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
