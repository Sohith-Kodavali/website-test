CREATE DATABASE IF NOT EXISTS rrk_chicken CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rrk_chicken;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    dob DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) DEFAULT NULL,
    items TEXT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    mode VARCHAR(20) DEFAULT 'Takeaway',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    diet VARCHAR(10) NOT NULL DEFAULT 'nonveg',
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(100) DEFAULT '2.jpeg',
    special TINYINT(1) DEFAULT 0,
    special_tag VARCHAR(50) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS raw (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(100) DEFAULT '7.jpeg',
    price DECIMAL(10,2) NOT NULL,
    weight VARCHAR(50) DEFAULT '1 kg',
    tag VARCHAR(50) DEFAULT 'Fresh Today'
);

CREATE TABLE IF NOT EXISTS combos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    save_badge VARCHAR(50) DEFAULT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS occasions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emoji VARCHAR(10) NOT NULL,
    label VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` TEXT
);

-- Default data
INSERT IGNORE INTO settings (`key`, `value`) VALUES
('admin_user', 'rrk'),
('admin_pass', 'admin1234'),
('whatsapp', '919999999999'),
('brand_name', 'RRK Chicken'),
('brand_tagline', 'Premium chicken restaurant in Eluru.'),
('footer_copyright', '© 2026 RRK Chicken. All rights reserved.'),
('contact_phone', '+91 99999 99999'),
('contact_phone_raw', '919999999999'),
('contact_whatsapp', '+91 99999 99999'),
('contact_address', 'Main Road, Eluru, AP'),
('contact_hours', '11:00 AM – 11:00 PM'),
('contact_maps', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.8001938655!2d81.104!3d16.711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEluru%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v99999999999'),
('social_instagram', '#'),
('social_facebook', '#'),
('social_youtube', '#');
