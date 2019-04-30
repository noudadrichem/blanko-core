import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const taskSchema = new Schema({
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
  billable: Boolean,
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
  }
}, {
  usePushEach: true
});

export default mongoose.model('Task', taskSchema)
