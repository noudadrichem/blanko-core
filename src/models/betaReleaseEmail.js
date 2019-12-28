import mongoose from 'mongoose'
import dates from './plugins/index'

const BetaReleaseEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  }
})

BetaReleaseEmailSchema.plugin(dates)

export default mongoose.model('BetaReleaseEmail', BetaReleaseEmailSchema)
