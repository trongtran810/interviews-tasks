# Problem
- Give: 2 table. customers: id, name, email. orders: id, customer_id, order_date, total.
- Want: retrieve a list of customers who have placed at least one order but have never placed an order totaling more than $100.

## Solution 1
- _Explain_: `NOT EXISTS` can be efficient, especially when the subquery returns a small result set, as it stops processing once a single matching row is found.
- _Performance_: `NOT EXISTS` can be efficient, especially when the subquery returns a small result set, as it stops processing once a single matching row is found.
```
SELECT c.id, c.name, c.email
FROM customers c
WHERE NOT EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id AND o.total > 100
);
```

## Solution 2
- _Explain_: `LEFT JOIN` is used to combine rows from two or more tables based on a related column, and it returns NULL values for columns from the right table that do not have a corresponding match in the left table.
- _Performance_: `LEFT JOIN` might involve scanning the entire tables involved, making it less efficient than NOT EXISTS in some cases. However, the actual performance depends on indexes, table sizes, and the specific database engine.
```
SELECT c.id, c.name, c.email
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id AND o.total > 100
WHERE o.id IS NULL;
```