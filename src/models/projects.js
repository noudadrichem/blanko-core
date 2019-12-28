import mongoose from 'mongoose'
import dates from './plugins/index'

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  projectTitle: String,
  projectDescription: String,
  currentRetainer: {
    type: Number,
    default: 0
  },
  retainer: {
    type: Number,
    default: 0
  },
  favorite: {
    type: Boolean,
    default: false
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }
}, {
  usePushEach: true
});

ProjectSchema.plugin(dates)

export default mongoose.model('Project', ProjectSchema)
