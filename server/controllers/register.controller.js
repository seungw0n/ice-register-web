const Users = require("../schemas/user.schema");
const Schools = require("../schemas/school.schema");
const Reservations = require("../schemas/reservation.schema");
const Dates = require("../schemas/date.schema");
const moment = require("moment")

const searchDate = (async (req, res) => {
    try {
        const date = req.body.date;

        console.log("/api/register/searchDate: ");
        
        // const today = moment().format('L') + " " + moment().format("LTS")
        // const todayDate = Date.parse(today);
        // const priorityTargetDate = Date.parse("03/27/2023 08:59:59 AM");
        // // const priorityTargetDate = Date.parse("03/20/2023 08:59:59 AM"); 

        // console.log("오늘: " + todayDate)
        // console.log("타겟 날짜: " + priorityTargetDate)

        // if (todayDate <= priorityTargetDate) {
        //     return res.status(400).json({data: null, message: "신청기간이 아닙니다.\n신청기간: 3.27.(월) 09:00 - 3.31.(금) 17:00\n초·중·일반고·특수: 3.28.(화) 09:00 부터 가능"})
        // } 

        const found = await Dates.findOne({date: date}).exec();

        if (!found) {
            return res.status(400).json({data: null, message: "올바르지 않은 날짜 입니다."});
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

        if (!req.session.schoolName) {
            return res.status(400).json({message: "세션이 만료되었습니다."});
        }

        const schoolName = req.session.schoolName;
        
        const today = moment().format('L') + " " + moment().format("LTS")
        const todayDate = Date.parse(today);
        const normalTargetDate = Date.parse("03/28/2023 08:59:59 AM");


        if (todayDate <= normalTargetDate) {
            const foundSchool = await Schools.findOne({
                priority: true,
                schools: schoolName
            }).exec();

            if (!foundSchool) {
                return res.status(400).json({data: null, message: "신청기간이 아닙니다.\n신청기간: 3.27.(월) 09:00 - 3.31.(금) 17:00\n초·중·일반고·특수: 3.28.(화) 09:00 부터 가능"})
            }
        } 

        const userRequest = {
            schoolName: schoolName,
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
        const foundReservation = await Reservations.find({schoolName: userRequest.schoolName, grade: userRequest.grade}).exec();
        
        if (foundReservation.length > 0) {
            return res.status(400).json({message: "신청 실패: 이미 신청 된 학년입니다."});
        }

        // if no exists return null
        Dates.findOne({date: userRequest.date}, async function(err, foundDate) {
            if (!foundDate) {
                return res.status(400).json({message: "신청 실패: 올바른 날짜가 아닙니다."}); 
            }
            if (foundDate.numStudentSlotLeft < userRequest.numStudentSlotNeed) {
                return res.status(400).json({message: "신청 실패: 요청 날짜의 자리가 충분하지 않습니다.\n날짜를 다시 검색해주세요."});
            }

            foundDate.numStudentSlotLeft -= userRequest.numStudentSlotNeed;
            foundDate.save();

            await Reservations.create(userRequest);
            return res.status(202).json({ message: "ok" });
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

const registerAdult = ( async(req, res) => {
    try {
        console.log("/api/register/adult:")
        
        if (!req.session.schoolName) {
            return res.status(400).json({message: "세션이 만료되었습니다."});
        }

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

        const foundReservation = await Reservations.find({
                schoolName: userRequest.schoolName, grade: userRequest.grade
            }).exec();
        
        if (foundReservation.length > 0) {
            if (userRequest.grade === "교원") {
                return res.status(400).json({message: "신청 실패: 이미 교원 강의 신청을 하셨습니다. "});
            } else {
                return res.status(400).json({message: "신청 실패: 이미 학부모 강의 신청을 하셨습니다. "});
            }
        }

        Dates.findOne({date: userRequest.date}, async function(err, foundDate) {
            if (!foundDate) {
                return res.status(400).json({message: "신청 실패: 올바른 날짜가 아닙니다."}); 
            }
            if (foundDate.numAdultSlotLeft === 0) {
                return res.status(400).json({message: "신청 실패: 요청 날짜의 자리가 충분하지 않습니다.\n날짜를 다시 검색해주세요."});
            }

            foundDate.numAdultSlotLeft = 0;
            foundDate.save();

            await Reservations.create(userRequest);
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