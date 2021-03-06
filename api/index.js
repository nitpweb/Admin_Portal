const router = require("express").Router();
const db = require("../db");
const User = require("../models/user");

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requiested-with, Content-Type, Accept, Authorization"
  );
  next();
});

router.get("/", (req, res) => {
  db.query(`select * from users`, (err, results, fields) => {
    if (err) {
      User.createTable();
      results = [];
    }
    res.json(results);
  });
});

router.get("/create/:id", async (req, res, next) => {
  const id = req.params.id;
  const user = new User(
    id,
    "Manish Kumar",
    "manish@gmail.com",
    "images/profile.png"
  );
  User.create(user)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/user/:id", async (req, res, next) => {
  const id = req.params.id;
  // res.send(req.params)
  try {
    const user = await User.findById(id);
    user.name = "Kundan";
    user.save().then((data) => {
      res.json({ user, data });
    });
  } catch (error) {
    next(error);
  }
});

const noticeRouter = require("./routes/notice");
router.use("/notice", noticeRouter);

const eventRouter = require("./routes/event");
router.use("/event", eventRouter);

const newsRouter = require("./routes/news");
router.use("/news", newsRouter);

const innovationRouter = require("./routes/innovation");
router.use("/innovation", innovationRouter);

const profileRouter = require("./routes/faculty-profile");
router.use("/faculty", profileRouter);

router.get("/env", (req, res) => {
  res.json(process.env);
});

router.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

router.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error,
    },
  });
});

module.exports = router;
