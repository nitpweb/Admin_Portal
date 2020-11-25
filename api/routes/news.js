const router = require("express").Router();
const { News, Attachment } = require("../../models/news");
const db = require("../../db");
const { route } = require("../../admin");

// Get all Newss
router.get("/", (req, res) => {
  db.find({}, News.tableName)
    .then((newss) => {
      newss.forEach((news) => {
        news.attachments = JSON.parse(news.attachments);
      });
      res.json(newss);
    })
    .catch((err) => res.json(err));
});

router.get("/active", (req, res) => {
  News.getActiveNewss()
    .then((newss) => {
      res.json(newss);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/archive", (req, res) => {
  News.getArchivedNewss()
    .then((newss) => {
      res.json(newss);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  News.findById(id)
    .then((news) => {
      res.json(news);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/create/:id", (req, res) => {
  const id = Number(req.params.id);
  let a = [new Attachment("for b.tech", "/btech")];
  const news = new News(id, "Test", a, id + 1);
  News.create(news)
    .then((result) => {
      res.json(result);
    })
    .catch((err) =>
      res.json({
        err,
      })
    );
});

module.exports = router;
