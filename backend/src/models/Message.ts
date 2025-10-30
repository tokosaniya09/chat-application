
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  seenBy: Types.ObjectId[];
}

const messageSchema: Schema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
