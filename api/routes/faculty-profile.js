const router = require('express').Router()
const db = require('../../db')
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
const bibParser = require('../../admin/middleware/bibParser');


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
/*get all users*/
router.get('/', (req, res, next) => {
    db.find({}, User.tableName)
        .then(results => {
            if (!results) {
                results = []
            }
            res.json(results)
        })
        .catch(err => {
            next(err)
        })
})
/*get faculties dept-wise */

var fdept = {
    arch: 'Architecture',
    che: 'Chemistry',
    ce: 'Civil Engineering',
    cse: 'Computer Science and Engineering',
    ee: 'Electrical Engineering',
    ece: 'Electronics and Communication Engineering',
    hss: 'Humanities & Social Sciences',
    maths: 'Mathematics',
    me: 'Mechanical Engineering',
    phy: 'Physics'
}
router.get('/:dept', async (req, res, next) => {
    try {
        const dept = req.params.dept
        // console.log(dept);
        const userId = req.query.id
        if (userId === undefined) {
            if (dept in fdept) {
                var users = await User.getUsersByDept(fdept[dept])
                users.forEach(user => {
                    user.imgUrl = `profile/image?id=${user.id}`
                })
                // console.log(users);
                res.json({
                    faculties: users
                })
            } else {
                res.json('No such dept')
            }
        } else {
            var user = await User.getUser(userId)
            user.imgUrl = `/profile/image?id=${userId}`
            var subjects = await Subject.getSubjectByUser(userId);
            var memberships = await Membership.getMembershipsByUser(userId);
            var qualification = await Education.getEducationByUser(userId);
            var administration = await Administration.getResponsibilityByUser(userId);
            var lastreponsibility = await Lastreponsibility.getResponsibilityByUser(userId);
            var projects = await Projects.getProjectsByUser(userId);
            var services = await Services.getServiceyByUser(userId);
            var works = await Work.getWorkExperienceByUser(userId);
            var phd = await Phd.getCandidatesByUser(userId);
            var fileData = await Publications.getFileData(userId)

            var publications, books = [],
                journals = [],
                conferences = []
            if (fileData) {
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
            res.json({
                profile: user,
                subjects: subjects,
                memberships: memberships,
                qualification: qualification,
                currResponsibility: administration,
                pastreponsibility: lastreponsibility,
                books: books,
                journals: journals,
                conferences: conferences,
                projects: projects,
                services: services,
                workExperience: works,
                phdCandidates: phd
            })
        }

    } catch (err) {
        res.json(err)
    }
})
module.exports = router