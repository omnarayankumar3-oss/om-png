const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Static folders
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

let db;

// Database Initialize
(async () => {
    db = await open({
        filename: "./database.db",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS images(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            originalname TEXT,
            uploadDate TEXT
        )
    `);

    console.log("Database Ready");
})();

// Upload Folder
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Home
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Upload API
app.post("/upload", upload.single("png"), async (req, res) => {

    await db.run(
        "INSERT INTO images(filename,originalname,uploadDate) VALUES(?,?,?)",
        req.file.filename,
        req.file.originalname,
        new Date().toLocaleString()
    );

    res.redirect("/");
});

// Gallery API
app.get("/api/images", async (req, res) => {

    const rows = await db.all(
        "SELECT * FROM images ORDER BY id DESC"
    );

    res.json(rows);
});

// Download
app.get("/download/:file", (req, res) => {

    const file = path.join(
        __dirname,
        "uploads",
        req.params.file
    );

    res.download(file);

});

// Delete
app.delete("/delete/:id", async (req, res) => {

    const row = await db.get(
        "SELECT * FROM images WHERE id=?",
        req.params.id
    );

    if (row) {

        fs.unlinkSync(
            path.join(
                "uploads",
                row.filename
            )
        );

        await db.run(
            "DELETE FROM images WHERE id=?",
            req.params.id
        );
    }

    res.send("Deleted");

});

app.listen(PORT, () => {

    console.log(
        "Server Running : http://localhost:3000"
    );

});