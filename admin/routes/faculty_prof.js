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
        var subjects = await Subject.getSubjects(user.email);
        var memberships = await Membership.getMemberships(user.email);
        var qualification = await Education.getQualification(user.email);
        var administration = await Administration.getAdministration(user.email);
        var lastreponsibility = await Lastreponsibility.getReponsibility(user.email);
        var projects = await Projects.getProjects(user.email);
        var services = await Services.getProfessionalService(user.email);
        var works = await Work.getWorkExperience(user.email);
        var phd = await Phd.getPhdCandidates(user.email);
        var fileId = await Publications.getFileId(user.email)
        let url = ''
        var data, publications, books = [],
            journals = [],
            conferences = []
        if (fileId) {
            // url = `https://drive.google.com/uc?id=${fileId}&export=download`
            data = await storage.getFile(fileId)
            publications = bibParser.toJSON(data)
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
        if (files.profile_img.path) {
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
        }

    })
})
router.get('/image', (req, res) => {
    const id = req.query.id
    console.log(id)
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
                res.send(fs.readFileSync(process.env.PWD + '/public/images/img_avatar.png'))
            }

        }
    )
})

module.exports = router