import express from "express";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const sql = postgres(process.env.DATABASE_URL);

app.use(express.static("public"));
app.use(express.json()); // Parse JSON request bodies

app.get("/api/characters", (_, res) => {
  sql`SELECT * FROM characters`.then((data) => {
    res.json(data);
  });
});

app.post("/api/characters", (req, res) => {
  const { char_name, char_level, char_class } = req.body;

  sql`INSERT INTO characters (char_name, char_level, char_class)
       VALUES (${char_name}, ${char_level}, ${char_class})`
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Error saving character:", error);
      res.status(500).json({ error: "Error saving character" });
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on Port ${process.env.PORT}`);
});
