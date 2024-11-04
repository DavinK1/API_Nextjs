const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ตั้งค่าการเชื่อมต่อกับฐานข้อมูล
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test-api",
});

// ตรวจสอบการเชื่อมต่อ
db.connect((err) => {
  if (err) throw err;
  console.log("ระบบทำการเชื่อมฐานข้อมูลสำเร็จ!");
});

// Select * เพื่อดึงข้อมูลสินค้าทั้งหมด
app.get("/api-products/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Select * เพื่อดึงข้อมูลผู้ใช้งานทั้งหมด
app.get("/api-users/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Select เพื่อดึงข้อมูลสินค้าตาม ID
app.get("/api-products/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลสินค้า!" });
    }
  });
});

// Select เพื่อดึงข้อมูลสินค้าตาม ID
app.get("/api-users/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้งาน!" });
    }
  });
});

// Insert ข้อมุลสินค้า
app.post("/api-products/products", (req, res) => {
  const { name, img, price, description, categories, stock } = req.body;

  if (!name || !img || !price || !description || !categories || !stock) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }

  const query = `
      INSERT INTO products (name, img, price, description, categories, stock)
      VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, img, price, description, categories, stock], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล!" });
    }
    res.status(201).json({ message: "เพิ่มข้อมูลสินค้าสำเร็จ!", id: results.insertId });
  });
});


// Update เพื่ออัปเดตข้อมูลสินค้าตาม ID
app.put("/api-products/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, img, price, description, categories, stock } = req.body;

  if (
    !req.body ||
    !name ||
    !img ||
    !price ||
    !description ||
    !categories ||
    !stock
  ) {
    return res.status(400).json({ message: "คุณลืมกรอกข้อมูลบางช่อง!" });
  }

  const query = `
      UPDATE products SET name = ?, img = ?, price = ?, description = ?, categories = ?, stock = ?
      WHERE id = ?
  `;

  db.query(
    query,
    [name, img, price, description, categories, stock, id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "เกิดปัญหาในการ Update ข้อมูล!" });
      }
      if (results.affectedRows > 0) {
        res.json({ message: "แก้ไขข้อมูลสินค้าสำเร็จ!" });
      } else {
        res.status(404).json({ message: "ไม่พบข้อมูลสินค้า" });
      }
    }
  );
});

// Delete สำหรับลบข้อมูลสินค้าตาม ID
app.delete("/api-products/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "เกิดปัญหาในการลบข้อมูล!" });
    }
    if (results.affectedRows > 0) {
      res.json({ message: "ลบข้อมูลสินค้าสำเร็จ!" });
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลสินค้าที่ต้องการลบ" });
    }
  });
});

// Delete สำหรับลบข้อมูลผู้ใช้งานตาม ID
app.delete("/api-users/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "เกิดปัญหาในการลบข้อมูล!" });
    }
    if (results.affectedRows > 0) {
      res.json({ message: "ลบข้อมูลสินค้าสำเร็จ!" });
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลสินค้าที่ต้องการลบ" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
