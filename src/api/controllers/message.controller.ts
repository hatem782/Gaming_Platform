export { };
const MessageModel = require('../models/message.model');
import { NextFunction, Request, Response, Router } from 'express';
const Discussion = require('../models/discussion.model');

const getMessages = (req: any, res: any, next: any) => {
  MessageModel.find({ discussion: req.params.DiscussionId })
    .populate('user')
    .sort({ date: 'asc' })
    .exec((err: any, messages: any) => {
      if (err) return next(err);
      res.json(messages);
    });
};

const getAllDiscussion = async (req: Request, res: Response, next: any) => {
  Discussion.find({ ...req.query })
    .populate('creator participats')
    .sort({ date: 'asc' })
    .exec((err: any, messages: any) => {
      if (err) return next(err);
      res.json(messages);
    });
};

const sendMessage = (req: any, res: any, next: any) => {
  const { text } = req.body;
  if (!text) {
    return res.send({ error: 'missing params in request' });
  }

  const message = new MessageModel({
    text,
  });

  message.user = req.route.meta.user._id;
  message.discussion = req.params.DiscussionId
  message.save((err: any) => {
    if (err) return next(err);
    res.json(message);
  });
};
const createDiscussion = (req: any, res: any, next: any) => {
  const { userId } = req.body;
  console.log(userId);

  if (!userId && (!req.body.sousadminId && !req.body.superadminId)) {
    return res.send({ error: 'missing params in request' });
  }

  const discussion = new Discussion({
  });

  discussion.user = userId;
  if (req.body.superadminId)
    discussion.superadmin = req.body.superadminId;
  if (req.body.sousadminId)
    discussion.sousadmin = req.body.sousadminId;
  discussion.save((err: any) => {
    if (err) return next(err);
    res.json(discussion);
  });
};

module.exports = {
  getMessages,
  sendMessage,
  createDiscussion,
  getAllDiscussion
};
