const User = require("../schemas/user.schema");
const Reservation = require("../schemas/reservation.schema");
const Date = require("../schemas/date.schema");

const searchDate = (async (req, res) => {
    try {
        const date = req.body.date;

        console.log("/api/register/searchDate: ");
        
        const found = await Date.findOne({date: date}).exec();

        if (!found) {
            return res.status(400).json({data: null, message: "옳바르지 않은 날짜 입니다."});
        } else {
            return res.status(202).json({data: found, message: "ok"});
        }

    } catch (error) {
        return res.status(400).json({message: error});
    }
});

const registerStudent = (async (req, res) => {
    try {
        console.log("/api/register/student:")

        // if (!req.session.schoolName) {
        //     return res.status(400).json({message: "세션이 만료되었습니다."});
        // }
        const userRequest = {
            schoolName: req.session.schoolName,
            numStudentSlotNeed: req.body.numStudentSlotNeed,
            numAdultSlotNeed: 0,
            numTotalPeople: req.body.numTotalPeople,
            numMale: req.body.numMale,
            numFemale: req.body.numFemale,
            grade: req.body.grade,
            date: req.body.date,
            period: req.body.period,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        };

        // if no exists return empty array
        const foundReservation = await Reservation.find({schoolName: userRequest.schoolName, grade: userRequest.grade}).exec();
        
        if (foundReservation.length > 0) {
            return res.status(400).json({message: "신청 실패: 이미 신청 된 학년입니다."});
        }

        // if no exists return null
        Date.findOne({date: userRequest.date}, async function(err, foundDate) {
            if (!foundDate) {
                return res.status(400).json({message: "신청 실패: 옳바른 날짜가 아닙니다."}); 
            }
            if (foundDate.numStudentSlotLeft < userRequest.numStudentSlotNeed) {
                return res.status(400).json({message: "신청 실패: 요청 날짜의 자리가 충분하지 않습니다.\n날짜를 다시 검색해주세요."});
            }

            foundDate.numStudentSlotLeft -= userRequest.numStudentSlotNeed;
            foundDate.save();

            await Reservation.create(userRequest);
            return res.status(202).json({ message: "ok" });
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

const registerAdult = ( async(req, res) => {
    try {
        console.log("/api/register/adult:")
        // if (!req.session.schoolName) {
        //     return res.status(400).json({message: "세션이 만료되었습니다."});
        // }

        const userRequest = {
            schoolName: req.session.schoolName,
            numStudentSlotNeed: 0,
            numAdultSlotNeed: 1,
            numTotalPeople: req.body.numTotalPeople,
            numMale: 0,
            numFemale: 0,
            grade: req.body.grade,
            date: req.body.date,
            period: req.body.period,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        };

        const foundReservation = await Reservation.find({
                schoolName: userRequest.schoolName, grade: userRequest.grade
            }).exec();
        
        if (foundReservation.length > 0) {
            if (userRequest.grade === "교원") {
                return res.status(400).json({message: "신청 실패: 이미 교원 강의 신청을 하셨습니다. "});
            } else {
                return res.status(400).json({message: "신청 실패: 이미 학부모 강의 신청을 하셨습니다. "});
            }
        }

        Date.findOne({date: userRequest.date}, async function(err, foundDate) {
            if (!foundDate) {
                return res.status(400).json({message: "신청 실패: 옳바른 날짜가 아닙니다."}); 
            }
            if (foundDate.numAdultSlotLeft === 0) {
                return res.status(400).json({message: "신청 실패: 요청 날짜의 자리가 충분하지 않습니다.\n날짜를 다시 검색해주세요."});
            }

            foundDate.numAdultSlotLeft = 0;
            foundDate.save();

            await Reservation.create(userRequest);
            return res.status(202).json({ message: "ok" });
        });
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = {
    searchDate,
    registerStudent,
    registerAdult
}