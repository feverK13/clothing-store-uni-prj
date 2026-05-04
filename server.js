const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());

// Налаштування підключення до бази даних
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root_12345!",
  database: "clothing_store",
});

// Підключення до БД
db.connect((err) => {
  if (err) {
    console.error("Помилка підключення до БД:", err);
    return;
  }
  console.log("Успішно підключено до MySQL!");
});

// GET-запит: отримати всі товари
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Помилка сервера" });
      return;
    }
    res.json(results); // Відправляємо результат клієнту у форматі JSON
  });
});

// POST - додати нового клієнта
app.post("/customers", (req, res) => {
  // Витягуємо дані, які нам пришлють у запиті
  const { first_name, last_name, email, phone } = req.body;

  // Робимо INSERT. Оскільки password_hash у нас NOT NULL, передамо туди тимчасову заглушку 'default_hash'
  const sql =
    'INSERT INTO customers (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, "default_hash")';

  db.query(sql, [first_name, last_name, email, phone], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Помилка сервера", details: err.message });
      return;
    }
    res.json({ message: "Клієнта успішно додано!", id: results.insertId });
  });
});

// PUT - оновити дані клієнта за його ID
app.put("/customers/:id", (req, res) => {
  const { first_name, last_name, email } = req.body;
  const { id } = req.params; // Витягуємо ID з URL-адреси

  const sql =
    "UPDATE customers SET first_name=?, last_name=?, email=? WHERE customer_id=?";

  db.query(sql, [first_name, last_name, email, id], (err) => {
    if (err) {
      res.status(500).json({ error: "Помилка сервера" });
      return;
    }
    res.json({ message: "Дані клієнта оновлено!" });
  });
});

// DELETE - видалити клієнта за ID
app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM customers WHERE customer_id=?", [id], (err) => {
    if (err) {
      res.status(500).json({ error: "Помилка сервера" });
      return;
    }
    res.json({ message: "Клієнта видалено!" });
  });
});

app.listen(3000, () => {
  console.log("Сервер запущено: http://localhost:3000");
});
