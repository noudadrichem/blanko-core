import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'
import dates from './plugins/index'

const { Schema } = mongoose;
const AccountSchema = new Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  usePushEach: true
});

AccountSchema.plugin(passportLocalMongoose)
AccountSchema.plugin(dates)

export default mongoose.model('Account', AccountSchema)
