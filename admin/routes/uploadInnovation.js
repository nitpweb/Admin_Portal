const router = require("express").Router();
var formidable = require("formidable");
var fs = require("fs");
const { Innovation, Attachment } = require("../../models/innovation");

const storage = require("../../db/storage");

router.post("/", (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    if (err) {
      res.send("Parsing Error");
    }
    let title = fields.main_title;
    let open_date = fields.open_date;
    let close_date = fields.close_date;
    let ittr = fields.ittrname;
    let description_link = fields.description_link;
    let venue = fields.venue;
    console.log(ittr);
    let attatchments = [];
    // get all attatchments

    try {
      for (let i = 1; i <= ittr; i++) {
        if (
          files["filename" + i] == undefined ||
          fields["subtitle" + i] == ""
        ) {
          continue;
        }
        let file = files["filename" + i];
        let data = await storage.uploadFile(
          file.path,
          file.type,
          new Date().getTime() + file.name,
          file.size
        );
        let url = data.webViewLink;
        let attatchment = new Attachment(fields["subtitle" + i], url);
        // console.log(attatchment)
        attatchments.push(attatchment);
      }
    } catch (error) {
      res.send(error);
    }

    var innovation_obj = new Innovation(
      new Date().getTime(),
      title,
      attatchments,
      req.session.user.id + "",
      new Date(open_date).getTime(),
      new Date(close_date).getTime(),
      venue,
      description_link
    );

    // creating to database
    Innovation.create(innovation_obj)
      .then((result) => {
        res.redirect("/innovations");
      })
      .catch((err) => {
        res.send("db update error");
      });
  });
});

module.exports = router;
