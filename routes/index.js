const router = require('express').Router()

const ClientRouter = require('./client-router')

const EnquiryRouter = require('./enquiry')
const OffenderRouter = require('./waste-offender')
const ReportRouter = require('./report')
const EyeWitnessRouter = require('./eye-witness-report')
const RecycleCenterRouter = require('./recycle-center')
const UserRouter = require('./user')
const LoginRouter = require('./login')

const getDashboard = (req, res) => {
  res.render('dashboard')
}

router.use(ClientRouter)

router.use('/admin/login', LoginRouter)

router.use((req, res, next) => {
  if (req.session.user) next()
  else res.redirect('/admin/login')
})

router.get('/admin', getDashboard)

router.get('/admin/dashboard', getDashboard)

router.use('/admin/reports', ReportRouter)

router.use('/admin/enquiries', EnquiryRouter)

router.use('/admin/eyewitness-reports', EyeWitnessRouter)

router.use('/admin/recycle-centers', RecycleCenterRouter)

router.use('/admin/offenders', OffenderRouter)

router.use('/admin/users', UserRouter)

router.use('/admin/logout', (req, res) => {
  req.session.user = null
  res.redirect('/admin/login')
})

module.exports = router