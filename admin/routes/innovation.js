const router = require("express").Router();
var formidable = require("formidable");
var fs = require("fs");
const db = require("../../db");
const { Attachment, Innovation } = require("../../models/innovation");

function compare(a, b) {
  const bandA = a.timestamp;
  const bandB = b.timestamp;
  let comparison = 0;
  if (bandA < bandB) {
    comparison = 1;
  } else if (bandA > bandB) {
    comparison = -1;
  }
  return comparison;
}

router.get("/", (req, res) => {
  var user = req.session.user;
  if (req.session.isAdmin == true) {
    db.find({}, Innovation.tableName)
      .then((innovation) => {
        innovation.forEach((innovation) => {
          // console.log(innovation)
          innovation.attachments = JSON.parse(innovation.attachments);
          const todaydate = new Date().getTime();
          if (todaydate <= innovation.closeDate) {
            innovation.isvisible = 1;
          } else {
            innovation.isvisible = 0;
          }
          var d = new Date(innovation.closeDate);
          innovation.closeDate =
            d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
          var d1 = new Date(innovation.openDate);
          innovation.openDate =
            d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
        });
        innovation.sort(compare);
        // console.log(innovation);
        res.render("innovation", {
          profileimgsrc: "images/profiledefault.jfif",
          title_top: "innovation",
          user: {
            imgUrl: user.imgUrl,
            name: user.name,
            email: user.email,
          },
          Navbar: req.session.Navbar,
          innovation: innovation,
          Drive: req.session.isAdmin,
        });
      })
      .catch((err) =>
        res.render("innovation", {
          profileimgsrc: "images/profiledefault.jfif",
          title_top: "innovation",
          user: {
            imgUrl: user.imgUrl,
            name: user.name,
            email: user.email,
          },
          Navbar: req.session.Navbar,
          innovation: [],
          Drive: req.session.isAdmin,
        })
      );
  } else if (req.session.isHod == true) {
    db.find(
      {
        userId: `${user.id}`,
      },
      Innovation.tableName
    )
      .then((innovation) => {
        innovation.forEach((innovation) => {
          // console.log(innovation)
          innovation.attachments = JSON.parse(innovation.attachments);
          const todaydate = new Date().getTime();
          if (todaydate <= innovation.closeDate) {
            innovation.isvisible = 1;
          } else {
            innovation.isvisible = 0;
          }
          var d = new Date(innovation.closeDate);
          innovation.closeDate =
            d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
          var d1 = new Date(innovation.openDate);
          innovation.openDate =
            d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
        });
        innovation.sort(compare);
        // console.log(innovation);
        res.render("innovation", {
          profileimgsrc: "images/profiledefault.jfif",
          title_top: "innovation",
          user: {
            imgUrl: user.imgUrl,
            name: user.name,
            email: user.email,
          },
          Navbar: req.session.Navbar,
          innovation: innovation,
          Drive: req.session.isAdmin,
        });
      })
      .catch((err) =>
        res.render("innovation", {
          profileimgsrc: "images/profiledefault.jfif",
          title_top: "innovation",
          user: {
            imgUrl: user.imgUrl,
            name: user.name,
            email: user.email,
          },
          Navbar: req.session.Navbar,
          innovation: [],
          Drive: req.session.isAdmin,
        })
      );
  } else {
    res.redirect("/login");
  }
});

//for deleting a innovation permanetly
router.post("/delete", (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var user = req.session.user;
    if (user != undefined) {
      db.find(
        {
          userId: `${user.id}`,
        },
        Innovation.tableName
      )
        .then((innovation) => {
          innovation.forEach((innovation) => {
            if (innovation.id == fields["file_id"]) {
              Innovation.deleteRow(fields["file_id"]);
              res.redirect("/innovation");
            }
          });
        })
        .catch((err) => res.redirect("/innovation"));
    }
  });
});

//for editing innovation
router.post("/edit", (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.send("Parsing Error");
    }
    let title = fields.main_title;
    let open_date = fields.open_date;
    let close_date = fields.close_date;
    let ittr = fields.ittrname;
    let doclink = fields.reg_form_link;
    let venue = fields.venue;
    let attachments = [];
    for (let i = 1; i <= ittr; i++) {
      let url = fields["link" + i];
      let attachment = new Attachment(fields["subtitle" + i], url);
      attachments.push(attachment);
    }
    console.log(title);
    console.log(open_date);
    console.log(close_date);
    console.log(ittr);
    console.log(venue);
    console.log(doclink);
    console.log(attachments);

    var user = req.session.user;
    if (user != undefined) {
      db.find(
        {
          userId: `${user.id}`,
        },
        Innovation.tableName
      )
        .then((innovation) => {
          innovation.forEach((innovation) => {
            var file_id_here = fields["file_id"];
            if (innovation.id == file_id_here) {
              var innovation_obj = new Innovation(
                file_id_here,
                title,
                attachments,
                req.session.user.id + "",
                new Date(open_date).getTime(),
                new Date(close_date).getTime(),
                venue,
                doclink
              );

              // updating to database
              Innovation.updateWholeObj(file_id_here, innovation_obj)
                .then((result) => {
                  res.redirect("/innovation");
                })
                .catch((err) => {
                  res.send("db update error");
                });
            }
          });
        })
        .catch((err) => res.send("kkj"));
    }
  });
});

router.post("/visible_toggle", function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var visible_status = fields.visible_status;
    Innovation.toggleVisibility(fields.fileid, visible_status);

    res.status(201).json({
      msg: "visibility toggled",
    });
  });
});

router.get("/closeDate/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  Innovation.findById(id)
    .then((innovation) => {
      res.send(innovation);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/filter/:date", (req, res) => {
  var user = req.session.user;
  // console.log(req.params.date);
  var date_arr = req.params.date;
  var start_date = "";
  var end_date = "";
  var temp_date = "";
  for (var i = 0; i < date_arr.length; i++) {
    if (date_arr[i] == ",") {
      start_date = temp_date;
      temp_date = "";
    } else {
      temp_date += date_arr[i];
    }
  }
  end_date = temp_date;
  console.log(start_date);
  console.log(end_date);
  var innovation_filter = [];
  if (user != undefined) {
    db.find(
      {
        userId: `${user.id}`,
      },
      Innovation.tableName
    )
      .then((innovation) => {
        innovation.forEach((innovation) => {
          // console.log(innovation)
          innovation.attachments = JSON.parse(innovation.attachments);
          const todaydate = new Date().getTime();
          if (todaydate <= innovation.closeDate) {
            innovation.isvisible = 1;
          } else {
            innovation.isvisible = 0;
          }
          var d = new Date(innovation.closeDate);
          innovation.closeDate =
            d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
          var d1 = new Date(innovation.openDate);
          innovation.openDate =
            d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
          if (
            innovation.timestamp >= new Date(start_date) &&
            innovation.timestamp <= new Date(end_date)
          ) {
            innovation_filter.push(innovation);
          }
        });
        innovation.sort(compare);
        // console.log(innovation);
        res.json(innovation_filter);
      })
      .catch((err) => res.send([]));
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
