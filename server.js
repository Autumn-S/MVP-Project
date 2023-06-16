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

app.get("/api/characters/:id", (req, res) => {
  const characterId = req.params.id;

  sql`SELECT * FROM characters WHERE id = ${characterId}`
    .then((data) => {
      if (data.length === 0) {
        res.status(404).json({ error: "Character not found" });
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("Error retrieving character:", error);
      res.status(500).json({ error: "Error retrieving character" });
    });
});

app.post("/api/characters", (req, res) => {
  const { char_name, char_level, char_class } = req.body;

  // Validate char_level
  const level = parseInt(char_level);
  if (isNaN(level) || level < 1 || level > 100) {
    return res.status(400).json({ error: "Invalid character level" });
  }

  // Check if char_name already exists
  sql`SELECT COUNT(*) AS count FROM characters WHERE char_name = ${char_name}`
    .then(([result]) => {
      const count = result.count;

      if (count > 0) {
        return res.status(409).json({ error: "Character name already exists" });
      }

      // Insert the new character
      return sql`INSERT INTO characters (char_name, char_level, char_class)
                    VALUES (${char_name}, ${level}, ${char_class})`;
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      if (error.message === "Character name already exists") {
        res.status(409).json({ error: "Character name already exists" });
      } else {
        console.error("Error saving character:", error);
        res.status(500).json({ error: "Error saving character" });
      }
    });
});

app.delete("/api/characters/:id", (req, res) => {
  const characterId = req.params.id;

  sql`DELETE FROM characters WHERE id = ${characterId}`
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Error deleting character:", error);
      res.status(500).json({ error: "Error deleting character" });
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on Port ${process.env.PORT}`);
});
