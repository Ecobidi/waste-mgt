const sharp = require('sharp')
const { streamUpload, removeUploadedFile } = require('../config/cloudinary')

const EyeWitnessService = require('../services/eye-witness-report')
const ReportModel = require('../models/report')
const RecycleCenterModel = require('../models/recycle-center')
const EnquiryService = require('../services/enquiry')

class ClientController {
  static async getHomePage(req, res) {
    let reports = await ReportModel.find().sort('-_id').limit(200)
    res.render('client/home', { reports })
  }

  static async getRecycleCenters(req, res) {
    let recycle_centers = await RecycleCenterModel.find().sort('-_id').limit(20)
    res.render('client/recycle-centers', { recycle_centers })
  }

  static async getEnquiryPage(req, res) {
    res.render('client/make-enquiry')
  }

  static async processSendEnquiry(req, res) {
    let dao = req.body
    try {
      await EnquiryService.create(dao)
      req.flash('success_msg', 'Enquiry Sent')
      res.redirect('/make-enquiry')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error sending enquiry')
      res.redirect('/make-enquiry')
    }
  }

  static async sendEyeWitnessReportPage(req, res) {
    res.render('client/eye-witness-report')
  }

  static async sendEyeWitnessReport(req, res) {
    let dao = req.body
    try {
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/reports")
        dao.image = imageInfo.url
        dao.image_public_id = imageInfo.public_id
      }
      await EyeWitnessService.create(dao)
      req.flash('success_msg', "Report Sent")
      res.redirect('/send-eyewitness-report')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error Sending Report')
      res.redirect('/send-eyewitness-report')
    }
  }
}


module.exports = ClientController