const router = require('express').Router()
const {Notice, Attachment} = require('../../models/notice')
const db = require('../../db')
const { route } = require('../../admin')

// Get all Notices
router.get('/', (req, res) => {
    db.find({}, Notice.tableName)
        .then(notices => {
            notices.forEach(notice => {
                notice.attachments = JSON.parse(notice.attachments)
            })
            res.json(notices.reverse())
        })
        .catch(err => res.json(err))
})

router.get('/active', (req, res) => {
    Notice.getActiveNotices()
    .then(notices => {
        res.json(notices.reverse())
    })
    .catch(err => {
        res.json(err)
    })
})

router.get('/archive', (req, res) => {
    Notice.getArchivedNotices()
    .then(notices => {
        res.json(notices.reverse())
    })
    .catch(err => {
        res.json(err)
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    Notice.findById(id)
        .then(notice => {
            res.json(notice)
        })
        .catch(err => {
            res.json(err)
        })
})

router.get('/create/:id', (req, res) => {
    const id = Number(req.params.id)
    let a = [new Attachment('for b.tech', '/btech')]
    const notice = new Notice(id, 'Test', a, id+1)
    Notice.create(notice)
        .then(result => {
            res.json(result)
        })
        .catch(err => res.json({err}))
})

module.exports = router
