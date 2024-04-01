const express = require('express')
const router = express.Router();
const { deleteFunction, updateName, getAllUsers, getUserWithId, updateEmail, updatewithId, updateFeatures} = require('../Controller/UserController')

router.route('/delete-user/:id').delete(deleteFunction);
router.route('/updateName').patch(updateName);
router.route('/updateEmail').patch(updateEmail);
router.route('/update/:id').patch(updatewithId)
router.route('/allUsers').get(getAllUsers);
router.route('/get/:id').get(getUserWithId);
router.route('/update-features/:userId').post(updateFeatures);

module.exports = router;