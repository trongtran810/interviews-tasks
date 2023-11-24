"""
Problem: Give 2 table
+ customers: id, name, email
+ orders: id, customer_id, order_date, total.
- Task: retrieve a list of customers who have placed at least one order but have never placed an order totaling more than $100.
--------------------
"""
import sqlite3
import os

DB_PATH = 'example.db'  # Replace with the actual file path
def get_current_location():
  return os.getcwd()

# Remove the old db file, create new db file
absolute_db_path = get_current_location() + "\\" + DB_PATH

QUERY_SOLUTION1 = f"""
SELECT c.id, c.name, c.email
FROM customers c
WHERE NOT EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id AND o.total > 100
);"""

QUERY_SOLUTION2 = f"""
SELECT c.id, c.name, c.email
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id AND o.total > 100
WHERE o.id IS NULL;
"""

CREATE_TABLE_QUERY = f"""
CREATE TABLE customers (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
  );
  
  CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    total DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
"""

ADD_EXAMPLE_QUERY = f"""
INSERT INTO customers VALUES
  (1, 'Trong Tran', 'trantrong810@gmail.com'),
  (2, 'Vu Xuan Phong', 'vuxuanphong@samsung.com'),
  (3, 'Anonimous', 'anonimous@meta-vi.vn');

INSERT INTO orders VALUES
  (101, 1, '2023-01-01', 50.00),
  (102, 1, '2023-02-15', 120.00),
  (103, 2, '2023-03-20', 90.00),
  (104, 3, '2023-04-05', 80.00),
  (105, 3, '2023-05-10', 110.00);
"""

# Function to execute a query
def execute_query_script(query, filename=absolute_db_path):
  conn = sqlite3.connect(filename)
  cursor = conn.cursor()
  cursor.executescript(query)
  conn.commit()
  return conn, cursor

def execute_query(query, filename=absolute_db_path):
  conn = sqlite3.connect(filename)
  cursor = conn.cursor()
  cursor.execute(query)
  conn.commit()
  return conn, cursor


# Function to print query result
def print_query_result(cursor):
  result = cursor.fetchall()
  for row in result:
      print(row)

# Remove the old db file, create new db file
if os.path.exists(absolute_db_path):
    os.remove(absolute_db_path)
with open(absolute_db_path, 'w'):
    pass
# Execute queries to create tables and add example data
conn, cursor = execute_query_script(CREATE_TABLE_QUERY)
execute_query_script(ADD_EXAMPLE_QUERY)

print("List of customers who have placed at least one order but have never placed an order totaling more than $100: \n")
# Execute the first solution query
conn, cursor = execute_query(QUERY_SOLUTION1)
print("Solution 1:")
print_query_result(cursor)

# Execute the second solution query
conn, cursor = execute_query(QUERY_SOLUTION2)
print("\nSolution 2:")
print_query_result(cursor)

# Close the connection
conn.close()

# Remove the example db file
if os.path.exists(absolute_db_path):
    os.remove(absolute_db_path)