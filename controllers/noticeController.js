import Notice from '../models/location/notice.js';
import Location from "../models/location/location.js";
import Board from "../models/location/board.js";
import mongoose from 'mongoose';

export const createNotice = async (req, res) => {

    const {locationId} = req.params;

    const location = await Location.findById( { _id: locationId });

    const boardId = location.board;

    const notice = new Notice({
        ...req.body,
        owner:req.owner._id
    });

    const board = await Board.findById( {_id: boardId });

    try {

        if(!notice) {
            res.status(500).send({
                message: "Cannot create Notice"
            });
        }

        await notice.save();
        board.notices.push(notice);
        await board.save();
        res.status(201).send({
            message: "Create notice Successfully"
        });

    } catch (err) {

        console.log('Cannot create Notice');
        res.status(500).send({
            message: err
        });

    }
};

export const readNotice = async (req, res) => {

    try {
        // 어떤 매장을 기준으로 해야하는지
        const notice = await Notice.find();

        if(!notice) {
            res.status(500).send({
                message: "Cannot read Notice"
            });
        }

        res.status(201).send({
            notice
        });

    }catch (err) {
        console.log('Cannot create Notice');
        res.status(500).send({
            message: err
        });
    }
};

export const readOneNotice = async (req, res) => {
    try {
        const { _id } = req.params;
        const notice = await Notice.findById({ _id });
        if(!notice) {
            res.status(500).send({
                message: "Cannot find One Notice"
            });
        }
        res.status(201).send({
            notice
        });
    }catch (err) {
        res.status(500).send({
            message: err
        });
    }
}

export const updateNotice = async (req, res) => {
    try {

        const { _id } = req.params;
        const { title, content } = req.body;

        const notice = await Notice.findByIdAndUpdate({ _id }, {
            title,
            content
        });

        if(!notice) {
            res.status(500).send({
                message: "Cannot Update Notice"
            });
        }

        res.status(201).send({
            updatedNotice: notice
        });

    }catch (err) {
        res.status(500).send({
            message: err
        });
    }
}

export const deleteNotice = async (req, res) => {
    try {

        const { _id } = req.params;

        const notice = await Notice.findByIdAndDelete({ _id} );

        if(!notice) {
            res.status(500).send({
                message: "Cannot Delete Notice"
            });
        }

        res.status(201).send({
            deletedNotice: notice
        });
    } catch (err) {
        res.status(500).send({
            message: err
        });
    }
}
