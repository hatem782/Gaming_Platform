export {};
const mongoose = require('mongoose');
import { transformData, listData } from '../../api/utils/ModelUtils';

const console = ['playstation', 'xbox', 'pc'];
const level = ['Beginner', 'Casual', 'Serious', 'Expert'];
const ChallengeSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true
    },
    game: {
      type: String,
      required: true
    },
    console: {
      type: String,
      enum: console,
      default: 'pc'
    },
    Level: {
      type: String,
      enum: level,
      required: true
    },
    averageBet: {
      type: Number,
      default: 5.0
    },
    challengeRequester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userToChallenge: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    discussion: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }
  },
  { timestamps: true }
);
const ALLOWED_FIELDS = [
  'id',
  'enabled',
  'game',
  'console',
  'Level',
  'averageBet',
  'challengeRequester',
  'userToChallenge',
  'discussion',
  'createdAt'
];

ChallengeSchema.method({
  // query is optional, e.g. to transform data for response but only include certain "fields"
  transform({ query = {} }: { query?: any } = {}) {
    // transform every record (only respond allowed fields and "&fields=" in query)
    return transformData(this, query, ALLOWED_FIELDS);
  }
});

ChallengeSchema.statics = {
  list({ query }: { query: any }) {
    return listData(this, query, ALLOWED_FIELDS);
  }
};

const Challenge = mongoose.model('challenge', ChallengeSchema);
Challenge.ALLOWED_FIELDS = ALLOWED_FIELDS;

module.exports = Challenge;
