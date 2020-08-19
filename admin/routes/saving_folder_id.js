const router = require('express').Router()
const fs = require('fs');

const FOLDER_PATH = 'folder_id.json';

router.get('/:id', (req, res) => {
    process.env.FOLDER_ID = req.params.id;
    fs.writeFile(FOLDER_PATH, JSON.stringify({folder_id:req.params.id}), (err) => {
        if (err) return console.log(err);
        console.log('Token stored to', FOLDER_PATH);
    });
    res.redirect('/changeDrive')
})

module.exports = router