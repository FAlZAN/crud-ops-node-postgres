require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 8080;
const todoRoute = require("./routes/todo.route");

app.use(express.json());
app.use("/api/todo", todoRoute);

app.listen(PORT, () => console.log(`server up on http://localhost:${PORT}`));
