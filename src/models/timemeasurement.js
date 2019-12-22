import mongoose from 'mongoose';
import dates from './plugins/index'

const Schema = mongoose.Schema;

const MeasurementSchema = new Schema({
  startTime: {
    type: Number,
    required: false
  },
  endTime: {
    type: Number,
    required: false
  },
  createdBy: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  taskId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Task'
  },
  projectId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  total: Number,
  isFinished: {
    type: Boolean,
    required: true,
    default: false
  }

}, {
  usePushEach: true
})

MeasurementSchema.plugin(dates)

export default mongoose.model('Timemeasurement', MeasurementSchema)
