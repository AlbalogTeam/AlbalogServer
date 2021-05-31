import Notice from '../models/notice/notice.js';
import mongoose from 'mongoose';
export const createNotice = async (req, res) => {

    const notice = new Notice({
        ...req.body,
        owner:req.user._id
    });


    try {

        if(!notice) {
            res.status(500).send({
                message: "Cannot create Notice"
            });
        }

        await notice.save();
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


export const tmp = async (req, res) => {

    try {

        const notice = await Notice.find({owner: mongoose.Types.ObjectId('60b3583ba7ab15d060378dcb')} );

        res.status(201).send({
            notice
        });

    } catch (err) {
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