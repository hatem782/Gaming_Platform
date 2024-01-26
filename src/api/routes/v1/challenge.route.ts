export { };

const express = require('express');
const {
    createChallenge,
    joinChallenge,
    deleteChallenge,
    list,
    acceptChallenge,
    getOneChallenge } = require('../../controllers/challenge.controler')
const { authorize, RESPONSABLE, LOGGED_USER, SOUS_ADMIN, SUPER_ADMIN } = require('../../middlewares/auth');


const router = express.Router();

router.post('/createChallenge', authorize(), createChallenge);
router.post('/joinChallenge/:id', authorize(), joinChallenge);
router.post('/acceptChallenge/:id', authorize(), acceptChallenge);


router.route('/list').get(authorize(), list);
router.get('/getOneChallenge/:id', authorize(), getOneChallenge);
router.delete('/deleteChallenge/:id', authorize(), deleteChallenge);


module.exports = router;
