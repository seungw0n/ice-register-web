const User = require("../schemas/user.schema");
const Reservation = require("../schemas/reservation.schema");
const Date = require("../schemas/date.schema");

const getRegisterHistory = (async (req, res) => {
    try {
        console.log("/api/user/getRegisterHistory:")

        const userRequest = req.session.schoolName;
        // userRequest = "고등학교";

        if (!userRequest) {
            return res.status(400).json({message: "세션이 만료되었습니다."});
        }

        const matchedReservations = await Reservation.find({schoolName: userRequest}).exec();

        if (!matchedReservations) {
            return res.status(202).json({ data: [], message: "ok" });
        } else {
            return res.status(202).json({ data: matchedReservations, message: "ok" });
        }
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
});


module.exports = {
    getRegisterHistory
}