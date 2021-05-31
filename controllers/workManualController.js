import WorkManual from "../models/workManual/workManual";

export const createWorkManual = async (req, res) => {

    try {
        const workManual = new WorkManual(req.body);
        if(!workManual) {
            res.status(500).send({
                message: "Cannot create Notice"
            });
        }
        await workManual.save();
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

export const readWorkManual = async (req, res) => {

    try {
        const workManual = await WorkManual.find();

        if(!workManual) {
            res.status(500).send({
                message: "Cannot read Notice"
            });
        }

        res.status(201).send({
            workManual
        });

    }catch (err) {
        console.log('Cannot create Notice');
        res.status(500).send({
            message: err
        });
    }
};

export const readOneWorkManual = async (req, res) => {
    try {
        const { _id } = req.params;
        const workManual = await WorkManual.findById({ _id });
        if(!workManual) {
            res.status(500).send({
                message: "Cannot find One Notice"
            });
        }
        res.status(201).send({
            workManual
        });
    }catch (err) {
        res.status(500).send({
            message: err
        });
    }
}

export const updateWorkManual = async (req, res) => {
    try {

        const { _id } = req.params;
        const { title, content } = req.body;

        const workManual = await WorkManual.findByIdAndUpdate({ _id }, {
            title,
            content
        });

        if(!workManual) {
            res.status(500).send({
                message: "Cannot Update Notice"
            });
        }

        res.status(201).send({
            updatedWorkManual: workManual
        });

    }catch (err) {
        res.status(500).send({
            message: err
        });
    }
}

export const deleteWorkManual = async (req, res) => {
    try {
        const { _id } = req.params;

        const workManual = await WorkManual.findByIdAndDelete({ _id} );

        if(!workManual) {
            res.status(500).send({
                message: "Cannot Delete Notice"
            });
        }

        res.status(201).send({
            deletedWorkManual: workManual
        });
    } catch (err) {
        res.status(500).send({
            message: err
        });
    }
}