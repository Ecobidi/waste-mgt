const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let RecycleCenter = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  shop_name: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: String,
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

RecycleCenter.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("recycle_centers_id")
  }
  next()
})

module.exports = mongoose.model('recycle_center', RecycleCenter)
