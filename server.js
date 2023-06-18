import express from "express";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const sql = postgres(process.env.DATABASE_URL);
app.use(express.static("public"));
app.use(express.json()); // Parse JSON request bodies

app.get("/api/characters", async (_, res) => {
  try {
    const data = await sql`SELECT * FROM characters`;
    res.json(data);
  } catch (error) {
    console.error("Error retrieving characters:", error);
    res.status(500).json({ error: "Error retrieving characters" });
  }
});

app.get("/api/characters/:id", async (req, res) => {
  try {
    const characterId = req.params.id;

    const data = await sql`SELECT * FROM characters WHERE id = ${characterId}`;

    if (data.length === 0) {
      res.status(404).json({ error: "Character not found" });
    } else {
      res.json(data[0]);
    }
  } catch (error) {
    console.error("Error retrieving character:", error);
    res.status(500).json({ error: "Error retrieving character" });
  }
});

app.post("/api/characters", async (req, res) => {
  try {
    const { char_name, char_level, char_class } = req.body;

    // Validate char_level
    const level = parseInt(char_level);
    if (isNaN(level) || level < 1 || level > 100) {
      return res.status(400).json({ error: "Invalid character level" });
    }

    // Check if char_name already exists
    const countResult =
      await sql`SELECT COUNT(*) AS count FROM characters WHERE char_name = ${char_name}`;
    const count = countResult[0].count;

    if (count > 0) {
      return res.status(409).json({ error: "Character name already exists" });
    }

    // Insert the new character
    const newChar =
      await sql`INSERT INTO characters (char_name, char_level, char_class)
                VALUES (${char_name}, ${level}, ${char_class})`;

    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving character:", error);
    res.status(500).json({ error: "Error saving character" });
  }
});

app.delete("/api/characters/:id", async (req, res) => {
  try {
    const characterId = req.params.id;

    const deleteResult =
      await sql`DELETE FROM characters WHERE id = ${characterId}`;
    console.log(deleteResult);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting character:", error);
    res.status(500).json({ error: "Error deleting character" });
  }
});

app.post("/api/characters/find", async (req, res) => {
  try {
    const { char_name, char_level, char_class } = req.body;

    const data = await sql`
      SELECT id FROM characters
      WHERE char_name = ${char_name}
        AND char_level = ${char_level}
        AND char_class = ${char_class}
      LIMIT 1
    `;

    if (data.length === 0) {
      res.status(404).json({ error: "Character not found" });
    } else {
      const characterId = data[0].id;
      res.json({ characterId });
    }
  } catch (error) {
    console.error("Error finding character:", error);
    res.status(500).json({ error: "Error finding character" });
  }
});

app.put("/api/characters/:id", async (req, res) => {
  try {
    const characterId = req.params.id;
    const { char_name, char_level, char_class } = req.body;

    // Validate char_level
    const level = parseInt(char_level);
    if (isNaN(level) || level < 1 || level > 100) {
      return res.status(400).json({ error: "Invalid character level" });
    }

    // Check if char_name already exists for other characters
    const countResult =
      await sql`SELECT COUNT(*) AS count FROM characters WHERE char_name = ${char_name} AND id != ${characterId}`;
    const count = countResult[0].count;

    if (count > 0) {
      return res.status(409).json({ error: "Character name already exists" });
    }

    // Update the character
    const updateResult =
      await sql`UPDATE characters SET char_name = ${char_name}, char_level = ${level}, char_class = ${char_class} WHERE id = ${characterId}`;

    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating character:", error);
    res.status(500).json({ error: "Error updating character" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on Port ${process.env.PORT}`);
});
