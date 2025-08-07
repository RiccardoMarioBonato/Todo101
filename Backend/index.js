const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express()
const PORT = 15000

const mongoURL = process.env.mongo_URL || "mongodb://localhost:27017/todos";

app.use(cors())
app.use(express.json())
const Task = mongoose.model("Task", new mongoose.Schema({
    text: String,
    completed: Boolean
}));

app.get("/tasks", async (req, res) => {
    const task = await Task.find();
    res.json(task);
});

app.post("/tasks", async (req, res) => {
    const task = await Task.create(req.body);
    res.json(task);
});

app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findbyIdAndUpdate(req.params.id, req.body);
    res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
    await findbyIdAndDelete(req.params.id);
    res.sendStatus(204);
});

const connectWithRetry = () => {
    console.log("Trying to connec to MongoDB...");
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Mongo conneted");
        app.listen(PORT, () => {
            console.log("Backend running on port ${PORT}");
        });
    })
    .catch(err => {
        console.error("mongo connection error", err.message);
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

