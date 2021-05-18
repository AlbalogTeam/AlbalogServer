import Notice from "../models/Notice";

export const create = async (req, res) => {
    const notice = new Notice(req.body);
    console.log(req.body);

    try {
        await notice.save();

        res.status(201).json({
            success: true
        });

    }catch (e) {
        console.log(e);
    }

};

export const getAllNotices = async (req, res) => {


    try {
        const notices = await Notice.find(); // select * from Notice

        if(!notices) {
            res.status(204).json({
                message: "No data!"
            })
        }

        res.status(200).json({
            notices
        });


    }catch (e) {
        res.status(500).json({
            success: false,
            error: e
        })
    }

}

export const getANotice = async (req, res) => {

    try {

        const _id = req.params.id;
        const notice = await Notice.findById({ _id });

        if(!notice) {
            res.status(204).json({
                message: "no Data!"
            })
        }

        res.status(200).json({
            notice
        });

    }catch (e) {

        res.status(500).json({
            success: false,
            error: e
        });

    }
};

export const editNotice = async (req, res) => {

    try {

        const _id = req.params.id;
        const notice = await Notice.findByIdAndUpdate({_id}, {
            title: req.body.title,
            content: req.body.content
        });

        if(!notice) {
            res.status(204).json({
                message: "no Data!"
            })
        }


        res.status(200).json({
            success: true,
        });

    }catch (e) {
        res.status(500).json({
            success: false,
            error: e
        })
    }
}

export const deleteNotice = async (req, res) => {

    try{
        const _id = req.params.id;

        await Notice.findByIdAndDelete({_id});

        res.status(200).json({
            message: "삭제완료!"
        })

    }catch (e) {

        res.status(500).json({
            error: e
        })

    }
}
