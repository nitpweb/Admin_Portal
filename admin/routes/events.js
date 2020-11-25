const router = require("express").Router();
var formidable = require("formidable");
var fs = require("fs");
const db = require("../../db");
const { Attachment, Event } = require("../../models/event");

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
    db.find({}, Event.tableName)
      .then((events) => {
        events.forEach((event) => {
          // console.log(event)
          event.attachments = JSON.parse(event.attachments);
          const todaydate = new Date().getTime();
          if (todaydate <= event.closeDate) {
            event.isvisible = 1;
          } else {
            event.isvisible = 0;
          }
          var d = new Date(event.closeDate);
          event.closeDate =
            d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
          var d1 = new Date(event.openDate);
          event.openDate =
            d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
        });
        events.sort(compare);
        // console.log(events);
        res.render("events", {
          profileimgsrc: "images/profiledefault.jfif",
          title_top: "Events",
          user: {
            imgUrl: user.imgUrl,
            name: user.name,
            email: user.email,
          },
          Navbar: req.session.Navbar,
          events: events,
          Drive: req.session.isAdmin,
        });
      })
      .catch((err) =>
        res.render("events", {
          profileimgsrc: "images/profiledefault.jfif",
          title_top: "Events",
          user: {
            imgUrl: user.imgUrl,
            name: user.name,
            email: user.email,
          },
          Navbar: req.session.Navbar,
          events: [],
          Drive: req.session.isAdmin,
        })
      );
  } else if (req.session.isHod == true) {
    db.find(
      {
        userId: `${user.id}`,
      },
      Event.tableName
    )
      .then((events) => {
        events.forEach((event) => {
          // console.log(event)
          event.attachments = JSON.parse(event.attachments);
          const todaydate = new Date().getTime();
          if (todaydate <= event.closeDate) {
            event.isvisible = 1;
          } else {
            event.isvisible = 0;
          }
          var d = new Date(event.closeDate);
          event.closeDate =
            d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
          var d1 = new Date(event.openDate);
          event.openDate =
            d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
        });
        events.sort(compare);
        // console.log(events);
        res.render("events", {
          profileimgsrc: "images/profiledefault.jfif",
          title_top: "Events",
          user: {
            imgUrl: user.imgUrl,
            name: user.name,
            email: user.email,
          },
          Navbar: req.session.Navbar,
          events: events,
          Drive: req.session.isAdmin,
        });
      })
      .catch((err) =>
        res.render("events", {
          profileimgsrc: "images/profiledefault.jfif",
          title_top: "Events",
          user: {
            imgUrl: user.imgUrl,
            name: user.name,
            email: user.email,
          },
          Navbar: req.session.Navbar,
          events: [],
          Drive: req.session.isAdmin,
        })
      );
  } else {
    res.redirect("/login");
  }
});

//for deleting a event permanetly
router.post("/delete", (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var user = req.session.user;
    if (user != undefined) {
      db.find(
        {
          userId: `${user.id}`,
        },
        Event.tableName
      )
        .then((events) => {
          events.forEach((event) => {
            if (event.id == fields["file_id"]) {
              Event.deleteRow(fields["file_id"]);
              res.redirect("/events");
            }
          });
        })
        .catch((err) => res.redirect("/events"));
    }
  });
});

//for editing event
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
        Event.tableName
      )
        .then((events) => {
          events.forEach((event) => {
            var file_id_here = fields["file_id"];
            if (event.id == file_id_here) {
              var event_obj = new Event(
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
              Event.updateWholeObj(file_id_here, event_obj)
                .then((result) => {
                  res.redirect("/events");
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
    Event.toggleVisibility(fields.fileid, visible_status);

    res.status(201).json({
      msg: "visibility toggled",
    });
  });
});

router.get("/closeDate/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  Event.findById(id)
    .then((event) => {
      res.send(event);
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
  var events_filter = [];
  if (user != undefined) {
    db.find(
      {
        userId: `${user.id}`,
      },
      Event.tableName
    )
      .then((events) => {
        events.forEach((event) => {
          // console.log(event)
          event.attachments = JSON.parse(event.attachments);
          const todaydate = new Date().getTime();
          if (todaydate <= event.closeDate) {
            event.isvisible = 1;
          } else {
            event.isvisible = 0;
          }
          var d = new Date(event.closeDate);
          event.closeDate =
            d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
          var d1 = new Date(event.openDate);
          event.openDate =
            d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
          if (
            event.timestamp >= new Date(start_date) &&
            event.timestamp <= new Date(end_date)
          ) {
            events_filter.push(event);
          }
        });
        events.sort(compare);
        // console.log(events);
        res.json(events_filter);
      })
      .catch((err) => res.send([]));
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
