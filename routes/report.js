const router = require('express').Router()
const multer = require('multer')

const ReportController = require('../controllers/report')
const UserController = require('../controllers/user')

const upload = multer({})

router.get('/', ReportController.getReportsPage)

router.get('/new', ReportController.createReportPage)

router.post('/new', upload.single('image'), ReportController.createReport)

router.get('/update/:serial_number', ReportController.editReportPage)

router.post('/update', upload.single('image'), ReportController.editReport)

router.get('/remove/:report_id', UserController.hasAdminAuthorization, ReportController.removeReport)

module.exports = router