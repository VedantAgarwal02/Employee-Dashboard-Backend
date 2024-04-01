const express = require('express')
const {addFeature, getFeature, deleteFeature} = require('../Controller/FeatureController')
const router = express.Router();

router.route('/add').post(addFeature);
router.route('/get').get(getFeature);
router.route('/delete/:id').delete(deleteFeature);

module.exports = router;