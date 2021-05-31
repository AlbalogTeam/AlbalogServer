import Location from "../models/location/location.js";

export const createLocation = async (req, res) => {

    try {

        const location = new Location(req.body);

        if(!location) {
            res.status(500).send({
                message: "Cannot Create Location"
            })
        }
        await location.save();
        res.status(201).send({
            message: 'Success Create Location'
        });
    } catch (err) {
        res.status(500).send({
            message: err
        });
    }

};

