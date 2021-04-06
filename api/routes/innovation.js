const router = require("express").Router();
const { Innovation, Attachment } = require("../../models/innovation");
const db = require("../../db");
const { route } = require("../../admin");

// Get all Innovations
router.get("/", (req, res) => {
  db.find({}, Innovation.tableName)
    .then((innovations) => {
      innovations.forEach((innovation) => {
        innovation.attachments = JSON.parse(innovation.attachments);
      });
      res.json(innovations);
    })
    .catch((err) => res.json(err));
});

router.get("/active", (req, res) => {
  Innovation.getActiveInnovations()
    .then((innovations) => {
      res.json(innovations);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/archive", (req, res) => {
  Innovation.getArchivedInnovations()
    .then((innovations) => {
      res.json(innovations);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  Innovation.findById(id)
    .then((innovation) => {
      res.json(innovation);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/create/:id", (req, res) => {
  const id = Number(req.params.id);
  let a = [new Attachment("for b.tech", "/btech")];
  const innovation = new Innovation(id, "Test", a, id + 1);
  Innovation.create(innovation)
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
