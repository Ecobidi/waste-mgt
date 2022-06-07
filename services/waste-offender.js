const WasteOffender = require('../models/waste-offender')

class WasteOffenderService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return WasteOffender.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return WasteOffender.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await WasteOffender.find({ $or: [{fullname: pattern}]}).skip(offset).limit(limit).sort('-_id')
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return WasteOffender.find().skip(offset).limit(limit).sort('-_id')
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await WasteOffender.count({ $or: [{fullname: pattern}]})
    } else {
      numberOfDocs = await WasteOffender.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return WasteOffender.create(dao)
  }

  static async updateOne(update) {
    return WasteOffender.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return WasteOffender.findOneAndDelete({serial_number})
  }

}

module.exports = WasteOffenderService