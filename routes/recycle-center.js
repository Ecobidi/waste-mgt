const router = require('express').Router()

const RecycleCenter = require('../controllers/recycle-center')

router.get('/', RecycleCenter.getRecycleCentersPage)

router.get('/new', RecycleCenter.createRecycleShopPage)

router.post('/new', RecycleCenter.createRecycleShop)

router.get('/update/:serial_number', RecycleCenter.editRecycleShopPage)

router.post('/update', RecycleCenter.editRecycleCenter)

router.get('/remove/:center_id', RecycleCenter.removeRecycleCenter)

module.exports = router