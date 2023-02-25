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

const deleteRegister = (async (req, res) => {
    try {
        console.log("/api/user/deleteRegister");
        
        if (!req.session.schoolName) {
            return res.status(400).json({message: "세션이 만료되었습니다."});
        }

        const userRequest = {
            schoolName: req.session.schoolName,
            _id: req.body._id
        };

        const matchedReservation = await Reservation.findOne({_id: userRequest._id, schoolName: userRequest.schoolName}).exec();

        if (!matchedReservation) {
            return res.status(400).json({ message: "선택하신 신청이 확인되지 않습니다.\n담당자에게 문의해주시기 바랍니다."})
        }

        Date.findOne({date: matchedReservation.date}, async function(err, foundDate) {
            if (matchedReservation.grade === "교원" || matchedReservation.grade === "학부모") {
                foundDate.numAdultSlotLeft = 1;
            } else {
                foundDate.numStudentSlotLeft = foundDate.numStudentSlotLeft + matchedReservation.numStudentSlotNeed;
            }

            await foundDate.save();
            await Reservation.deleteOne({_id: matchedReservation._id});
        });

        return res.status(202).json({ message: "ok" });
        
    } catch (error) {
        return res.status(400).json({ message: err.message });
    }
})


module.exports = {
    getRegisterHistory,
    deleteRegister,
}