import { NextFunction, Request, Response } from 'express';
// const ObjectId = mongoose.Types.ObjectId;
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const APIError = require('../../api/utils/APIError');
const Challenge = require('../models/challenge.model');
const Demande = require('../models/demande.model');

import { apiJson } from '../../api/utils/Utils';
import { Discussion } from '../models';

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query = { ...req.query };
    const data = (await Challenge.list(req)).transform(req);

    apiJson({ req, res, data, model: Challenge });
  } catch (e) {
    next(e);
  }
};

const createChallenge = (req: any, res: any, next: any) => {
  const { play, game, Level, averageBet } = req.body;
  if (!game || !console || !Level || !averageBet) {
    throw new APIError({
      message: 'all fields are required',
      status: 302
    });
  }
  const creatorId = req.route.meta.user._id;

  const discussion = new Challenge({
    ...req.body,
    userToChallenge: creatorId
  });

  discussion.save((err: any) => {
    if (err) return next(err);
    res.json(discussion);
  });
};

const getOneChallenge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    req.query = { ...req.query, _id: id };
    const discussion = await Challenge.list(req);

    apiJson({ req, res, data: discussion[0], model: Challenge });
  } catch (e) {
    next(e);
  }
};

const joinChallenge = async (req: any, res: any, next: any) => {
  const { id } = req.param;
  const user = req.route.meta.user;
  try {
    const challenge = await Challenge.get(id);
    challenge.challengeRequester = user;

    challenge.save((err: any) => {
      if (err) return next(err);
      res.json(challenge);
    });
  } catch (err) {
    next(err);
  }
};

const acceptChallenge = async (req: any, res: any, next: any) => {
  const { id } = req.param;
  const user = req.route.meta.user;
  try {
    const challenge = await Challenge.get(id);
    challenge.enabled = false;
    const creatorId = req.route.meta.user._id;
    const participants = Array.from(new Set([creatorId, challenge.challengeRequester]));

    const discussion = new Discussion({
      ispublic: false,
      Average_Bet: challenge.averageBet,
      Max_Players: 2,
      title: `challenge`,
      game: challenge.game,
      messages: [],
      participants,
      creator: creatorId
    });
    challenge.save((err: any) => {
      if (err) return next(err);
      res.json(challenge);
    });
  } catch (err) {
    next(err);
  }
};
const deleteChallenge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const discussion = await Challenge.get(id);
    await Challenge.findOneAndRemove({ _id: id, userToChallenge: req.route.meta.user._id });
    const data = { status: 'OK' };
    apiJson({ req, res, data: data });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createChallenge,
  joinChallenge,
  deleteChallenge,
  list,
  getOneChallenge,
  acceptChallenge
};
