import mongoose from 'mongoose';
import dates from './plugins/index'

const Schema = mongoose.Schema;
const TaskSchema = new Schema({
  title: String,
  subTitle: String,
  status: {
    type: String,
    default: 'TODO'
  },
  labels: Array,
  date: {
    type: Date,
    default: Date.now()
  },
  dueDate: {
    type: Date
  },
  order: {
    type: Number
  },
  deleted: {
    type: Boolean,
    default: false
  },
  billable: {
    type: Boolean,
    default: false
  },
  subTasks: Array,
  priorityLevel: Number,
  totalTime: Number,
  measurements: [{
    startTime: Number,
    endTime: Number,
    total: Number,
    isPosted: Boolean
  }],
  misc: {},
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  order: Number
}, {
  usePushEach: true
});

TaskSchema.plugin(dates)

export default mongoose.model('Task', TaskSchema)
