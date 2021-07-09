import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  invite_token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '60m' },
  },
});

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;
