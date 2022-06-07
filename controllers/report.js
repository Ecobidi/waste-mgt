const sharp = require('sharp')
const { streamUpload, removeUploadedFile } = require('../config/cloudinary')

const WasteReportModel = require('../models/report')
const WasteReportService = require('../services/report')

class WasteReportController {

  static async getReportsPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || WasteReportService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let reports, totalDocuments
    
    if (search) {
      reports = await WasteReportService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await WasteReportService.countMatchingDocuments(search)
    } else {
      reports = await WasteReportService.findAll({limit: limit_size, offset})
      totalDocuments = await WasteReportService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('reports', { reports, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createReportPage(req, res) {
    let report = new WasteReportModel()
    res.render('reports-new', { report, newEntry: true })
  }

  static async createReport(req, res) {
    let dao = req.body
    try {
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/reports")
        dao.image = imageInfo.url
        dao.image_public_id = imageInfo.public_id
      }
      await WasteReportService.create(dao)
      req.flash('success_msg', "Record Saved")
      res.redirect('/admin/reports')
    } catch (err) {
      console.log(err)
      res.redirect('/admin/reports')
    }
  }

  static async editReportPage(req, res) {
    let serial_number = req.params.serial_number
    let report = await WasteReportService.findBySerialNumber(serial_number)
    res.render('reports-new', { report, newEntry: false })
  }

  static async editReport(req, res) {
    let dao = req.body
    try {
      let report = await WasteReportService.findById(dao._id)
      if (req.file) {
        report.image_public_id && await removeUploadedFile(report.image_public_id)
        
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/reports")
        dao.image = imageInfo.url
        dao.image_public_id = imageInfo.public_id
      }
      await WasteReportService.updateOne(dao)
      req.flash('success_msg', "Record Updated")
      res.redirect('/admin/reports')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error processing update')
      res.redirect('/admin/reports')
    }
  }

  // TODO Implement Image Cleanup After Record Removal

  static async removeReport(req, res) {
    try {
      let doc = await WasteReportService.removeOne(req.params.report_id)
      // remove photo
      if (doc.image_public_id) {
        await removeUploadedFile(doc.image_public_id)  
      }
      req.flash('success_msg', 'Record removed successfully')
      res.redirect('/admin/reports')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/admin/reports')
    }
  }

}

module.exports = WasteReportController