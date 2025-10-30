
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChat extends Document {
  members: Types.ObjectId[];
  lastMessage: Types.ObjectId;
}

const chatSchema: Schema = new mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
}, {
  timestamps: true,
});

const Chat = mongoose.model<IChat>('Chat', chatSchema);
export default Chat;
