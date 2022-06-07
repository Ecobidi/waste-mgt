const RecycleCenter = require('../models/recycle-center')

class RecycleCenterService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return RecycleCenter.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return RecycleCenter.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await RecycleCenter.find({ $or: [{shop_name: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return RecycleCenter.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await RecycleCenter.count({ $or: [{shop_name: pattern}]})
    } else {
      numberOfDocs = await RecycleCenter.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return RecycleCenter.create(dao)
  }

  static async updateOne(update) {
    return RecycleCenter.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return RecycleCenter.findOneAndDelete({serial_number})
  }

}

module.exports = RecycleCenterService