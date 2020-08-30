const router = require('express').Router()
const {
    Event,
    Attachment
} = require('../../models/event')
const db = require('../../db')
const {
    route
} = require('../../admin')

// Get all Events
router.get('/', (req, res) => {
    db.find({}, Event.tableName)
        .then(events => {
            events.forEach(event => {
                event.attachments = JSON.parse(event.attachments)
            })
            res.json(events)
        })
        .catch(err => res.json(err))
})

router.get('/active', (req, res) => {
    Event.getActiveEvents()
        .then(events => {
            res.json(events)
        })
        .catch(err => {
            res.json(err)
        })
})

router.get('/archive', (req, res) => {
    Event.getArchivedEvents()
        .then(events => {
            res.json(events)
        })
        .catch(err => {
            res.json(err)
        })
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    Event.findById(id)
        .then(event => {
            res.json(event)
        })
        .catch(err => {
            res.json(err)
        })
})

router.get('/create/:id', (req, res) => {
    const id = Number(req.params.id)
    let a = [new Attachment('for b.tech', '/btech')]
    const event = new Event(id, 'Test', a, id + 1)
    Event.create(event)
        .then(result => {
            res.json(result)
        })
        .catch(err => res.json({
            err
        }))
})

module.exports = router