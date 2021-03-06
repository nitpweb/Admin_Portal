const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const db = require('../../db');
const User = require('../../models/user');
const Subject = require('../../models/subjects');
const Membership = require('../../models/memberships');
const Administration = require('../../models/current-responsibility');
const Lastreponsibility = require('../../models/past-responsibility');
const Image = require('../../models/image');
const Education = require('../../models/education')
const Projects = require('../../models/newproject')
const Phd = require('../../models/phdcandidates')
const Services = require('../../models/professionalservice')
const Work = require('../../models/workexperience')
const Publications = require('../../models/publications')
const bibParser = require('../middleware/bibParser');
const storage = require('../../db/storage');

/*remove special character from bib data*/
function removeSpecial(params) {
    params.forEach(entry => {
        var newTags = entry.entryTags
        for (let key in newTags) {
            newTags[key] = newTags[key].replace(/{/g, "").replace(/}/g, "").replace(/\\/g, "").replace(/[\u{0080}-\u{FFFF}]/gu, "\"")
        }
    })
}
/* sort entries by year*/
function sortByYear(params) {
    params.sort(function(a, b) {
        return b.entryTags.YEAR - a.entryTags.YEAR
    })
}

router.get('/', async (req, res) => {
    try {
        var user = req.session.user;
        if (user == undefined) {
            res.redirect("./login")
        }
        var subjects = await Subject.getSubjects(user.id);
        var memberships = await Membership.getMemberships(user.id);
        var qualification = await Education.getQualification(user.id);
        var administration = await Administration.getAdministration(user.id);
        var lastreponsibility = await Lastreponsibility.getReponsibility(user.id);
        var projects = await Projects.getProjects(user.id);
        var services = await Services.getProfessionalService(user.id);
        var works = await Work.getWorkExperience(user.id);
        var phd = await Phd.getPhdCandidates(user.id);
        var fileData = await Publications.getFileData(user.id)
        // let url = ''
        var publications, books = [],
            journals = [],
            conferences = []
        if (fileData) {
            // data = await storage.getFile(fileId)
            publications = bibParser.toJSON(fileData)
            removeSpecial(publications)
            publications.forEach(entry => {
                if (entry.entryType === "INPROCEEDINGS") conferences.push(entry)
                else if (entry.entryType === "ARTICLE") journals.push(entry)
                else if (entry.entryType === "BOOKS") books.push(entry)
            })
            sortByYear(books)
            sortByYear(journals)
            sortByYear(conferences)
        }
        res.render('facultyprof', {
            title_top: 'faculty Profile',
            user: {
                imgUrl: user.imgUrl,
                name: user.name,
                email: user.email,
                department: user.department,
                designation: user.designation,
                ext_no: user.ext_no,
                research_interest: user.research_interest
            },
            Navbar: req.session.Navbar,
            Drive: req.session.isAdmin,
            subjects: subjects,
            memberships: memberships,
            qualification: qualification,
            administration: administration,
            lastreponsibility: lastreponsibility,
            projects: projects,
            services: services,
            works: works,
            phd: phd,
            books: books,
            journals: journals,
            conferences: conferences
        })
    } catch (err) {
        // res.send(err)
        console.log(err);
    }
});

router.post('/', (req, res) => {
    const id = req.session.user.id
    const user = req.session.user
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            res.json("parsing error")
        }
        if (fields.research_interests) {
            user.research_interest = fields.research_interests
            db.query(`update ${User.tableName} set research_interest='${fields.research_interests}' where id=${id};`, (err, results, fields) => {
                if (err) {
                    console.log(err)
                    // res.json(err)
                }
            })
        }
        if (files.profile_img.size != 0) {
            const image = fs.readFileSync(files.profile_img.path)

            db.find({ user_id: user.id }, Image.tableName)
                .then(results => {
                    // console.log(results)
                    let query, data = {
                        image: image
                    };
                    if (results) {
                        query = `update ${Image.tableName} set ? where user_id=${user.id}`
                    } else {
                        query = `insert into ${Image.tableName} set ?`
                        data.user_id = user.id
                        data.email = user.email
                    }
                    db.query(query, data, (err, results, fields) => {
                        if (err) {
                            console.log('err', err)
                            return
                        }
                        res.redirect('/profile')
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            res.redirect('/profile')
        }

    })
})


router.get('/image', (req, res) => {
    const id = req.query.id
    // console.log(id)
    db.query(
        `select image from ${Image.tableName} where user_id='${id}';`,
        (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(500).json(err)
            }
            if (results && results.length == 1 && results[0].image != null) {
                const image = results[0].image
                // console.log(results)
                res.send(image);
            } else {
                // console.log(process.env.PWD)
                res.send(fs.readFileSync(process.cwd() + '/public/images/img_avatar.png'))
            }

        }
    )
})
router.post("/delete", (req, res) => {
    const user = req.session.user
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (user != undefined) {
            const tableName = fields["tableName"];
            const id = fields["id"];
            db.query(`delete from ${tableName} where id=${id} and email='${user.email}'`, (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.send(err)
                }
            });
        }
    });
});



module.exports = router