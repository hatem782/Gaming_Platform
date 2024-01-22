import { NextFunction, Request, Response } from 'express';
// const ObjectId = mongoose.Types.ObjectId;
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const APIError = require('../../api/utils/APIError');
const Discussion = require('../models/discussion.model');
const Demande = require('../models/demande.model');


import { apiJson } from '../../api/utils/Utils';


const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.query = { ...req.query };
        const data = (await Discussion.list(req)).transform(req);
      
        apiJson({ req, res, data, model: Discussion });
    } catch (e) {
        next(e);
    }
};
const createDiscussion = (req: any, res: any, next: any) => {
    const { title, game ,Level,Average_Bet ,ispublic,Max_Players} = req.body;
    if (!game || !title || !Level || !ispublic || !Average_Bet || !Max_Players) {
        throw new APIError({
            message: 'all fields are required',
            status: 302
        });
    }
    const creatorId = req.route.meta.user._id;
    const participants = Array.from(new Set([creatorId]));


    const discussion = new Discussion({
        ...req.body, participants,creator:creatorId
    });


    discussion.save((err: any) => {
        if (err) return next(err);
        res.json(discussion);
    });
};
const getOneDiscussion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        req.query = { ...req.query, _id:id};
        const discussion = await Discussion.list(req);
       
        
        apiJson({ req, res, data: discussion[0], model: Discussion });
    } catch (e) {
        next(e);
    }
}

const joinDiscussion = async(req: any, res: any, next: any) => {
    const { id} = req.param;
    const user = req.route.meta.user;
    try {
        const discussion = await Discussion.get(id);
       const demande = new Demande({User:user,discussion:id})
       
       demande.save((err: any) => {
        if (err) return next(err);
        res.json(demande);
    });
    }catch(err){
        next(err);
    }

};
const deleteDiscussion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const discussion = (await Discussion.get(id));
        await Discussion.findByIdAndRemove(id)
        const data = { status: 'OK' };
        apiJson({ req, res, data: data });
    } catch (e) {
        next(e);
    }
}



module.exports = {
    createDiscussion,
    joinDiscussion,
    deleteDiscussion,
    list,
    getOneDiscussion
};
