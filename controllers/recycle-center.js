const RecycleShopService = require('../services/recycle-center')
const RecycleShopModel = require('../models/recycle-center')

class RecycleShopController {

  static async getRecycleCentersPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || RecycleShopService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let centers, totalDocuments
    
    if (search) {
      centers = await RecycleShopService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await RecycleShopService.countMatchingDocuments(search)
    } else {
      centers = await RecycleShopService.findAll({limit: limit_size, offset})
      totalDocuments = await RecycleShopService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('recycle-centers', { centers, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createRecycleShopPage(req, res) {
    let center = new RecycleShopModel()
    res.render('recycle-centers-new', { center, newEntry: true })
  }

  static async createRecycleShop(req, res) {
    let dao = req.body
    try {
      await RecycleShopService.create(dao)
      req.flash('success_msg', "Recycle Shop Saved")
      res.redirect('/admin/recycle-centers')
    } catch (err) {
      console.log(err)
      res.redirect('/admin/recycle-centers')
    }
  }

  static async editRecycleShopPage(req, res) {
    let serial_number = req.params.serial_number
    let center = await RecycleShopService.findBySerialNumber(serial_number)
    res.render('recycle-centers-new', { center, newEntry: false })
  }

  static async editRecycleCenter(req, res) {
    let dao = req.body
    try {
      let RecycleCenter = await RecycleShopService.findById(dao._id)
      await RecycleShopService.updateOne(dao)
      req.flash('success_msg', "Recycle Center Details Updated")
      res.redirect('/admin/recycle-centers')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error processing update')
      res.redirect('/admin/recycle-centers')
    }
  }

  static async removeRecycleCenter(req, res) {
    try {
      let doc = await RecycleShopService.removeOne(req.params.center_id)
      req.flash('success_msg', 'Record removed successfully')
      res.redirect('/admin/recycle-centers')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/admin/recycle-centers')
    }
  }

}

module.exports = RecycleShopController