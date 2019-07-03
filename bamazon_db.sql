DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("kayak", "outdoors", 399.99, 9), ("laptop", "tech", 689.98, 28), ("iphone", "tech", 899.0, 100), ("monitor", "tech", 299.98, 25),
("notebook", "office", 2.99, 120), ("camera", "tech", 469.78, 30), ("dumbbells", "gym", 256, 5), ("legos", "toys", 49.87, 15), 
("guitar", "music", 120, 8), ("shoes", "apparel", 59.99, 20);

SELECT * FROM products;
SELECT * FROM products WHERE stock_quantity<=20;