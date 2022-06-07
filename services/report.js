const ReportModel = require('../models/report')

class ReportService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return ReportModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return ReportModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await ReportModel.find({ $or: [{location: pattern}, {subject: pattern}, {report: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return ReportModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await ReportModel.count({ $or: [{location: pattern}, {subject: pattern}, {report: pattern}]})
    } else {
      numberOfDocs = await ReportModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return ReportModel.create(dao)
  }

  static async updateOne(update) {
    return ReportModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return ReportModel.findOneAndDelete({serial_number})
  }

}

module.exports = ReportService