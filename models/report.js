const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let ReportSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  location: {
    type: String,
  }, 
  subject: {
    type: String,
  },
  report: {
    type: String,
  },
  image: {
    type: String,
  },
  image_public_id: {
    type: String,
  },
  is_public: {
    type: Boolean,
    default: false,
  }
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

ReportSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("reports_id")
  }
  next()
})

module.exports = mongoose.model('report', ReportSchema)
