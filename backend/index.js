
import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
const PORT = 5001;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10kb" }));

let tasks = [
  { id: 1, title: "Learn React" },
  { id: 2, title: "Practice React" },
];

function validateTitle(req, res, next) {
  const { title } = req.body ?? {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Task title is required",
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      message: "Task title must be 200 characters or fewer",
    });
  }

  req.body.title = title.trim();
  next();
}

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", validateTitle, (req, res) => {
  const task = {
    id: Date.now(),
    title: req.body.title,
  };

  tasks.push(task);
  res.status(201).json(task);
});

app.put("/api/tasks/:id", validateTitle, (req, res) => {
  const task = tasks.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      message: "Task does not exist",
    });
  }

  task.title = req.body.title;
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const task = tasks.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      message: "Task does not exist",
    });
  }

  tasks = tasks.filter((item) => item.id !== task.id);

  res.json({ message: "Deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
