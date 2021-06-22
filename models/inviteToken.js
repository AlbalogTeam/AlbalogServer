import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  invite_token: {
    type: String,
    required: true,
  },
});

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;
