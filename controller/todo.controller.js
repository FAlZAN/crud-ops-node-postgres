const client = require("../db/index");

const createTask = async (req, res) => {
  const { task, completed } = req.body;

  if (!task || !task.trim()) {
    res.status(400).json({ error: "task is required." });
    return;
  }

  if (typeof completed !== "boolean") {
    res.status(400).json({ error: "completed is required." });
    return;
  }

  try {
    const { rows } = await client.query(
      "INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *;",
      [task, completed]
    );

    res.status(201).json({ message: "task added.", insertedTask: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTask = async (req, res) => {
  try {
    const { rows } = await client.query("SELECT * FROM todos;");
    res.status(200).json({ tasks: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  if (!task || !task.trim()) {
    res.status(400).json({ error: "task is required." });
    return;
  }

  if (typeof completed !== "boolean") {
    res.status(400).json({ error: "completed is required." });
    return;
  }

  try {
    const { rows: doesTaskExists } = await client.query(
      "SELECT * FROM todos WHERE id = $1;",
      [id]
    );

    if (doesTaskExists.length === 0) {
      res.status(400).json({ error: "no such task found." });
      return;
    }

    const { rows } = await client.query(
      `UPDATE todos SET task = $2, completed = $3 WHERE id = $1 RETURNING *;`,
      [id, task, completed]
    );

    // const { rows } = await client.query("SELECT * FROM todos WHERE id = $1", [id]);

    res.status(200).json({ message: "task updated", updatedTask: rows });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows: doesTaskExists } = await client.query(
      "SELECT * FROM todos WHERE id = $1;",
      [id]
    );

    if (doesTaskExists.length === 0) {
      res.status(400).json({ error: "no such task found." });
      return;
    }

    await client.query("DELETE FROM todos WHERE id = $1;", [id]);

    res
      .status(200)
      .json({ message: "task deleted.", deletedTask: doesTaskExists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTask, getAllTask, updateTask, deleteTask };
