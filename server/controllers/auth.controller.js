const User = require("../schemas/user.schema");

const signin = (async (req, res) => {
    try {
        console.log("/api/auth/signin:")
        const userRequest = {
            schoolName: req.body.schoolName,
            password: req.body.password
        };

        const matchedUser = await User.findOne({ $and: [
            {schoolName: userRequest.schoolName}, {password: userRequest.password}]
        }, {schoolName: 1, managerName: 1, directNumber: 1}).exec();

        if (!matchedUser) {
            return res.status(400).json({ data: null, message: "옳바르지 않은 정보입니다." });
        } else {
            req.session.save(() => {
                req.session.schoolName = matchedUser.schoolName;
                return res.status(202).json({ data: matchedUser, message: "ok" })
            })
        }
    } catch (err) {
        return res.status(400).json({ data: null, message: err.message})
    }
});

const signup = (async (req, res) => {
    try {
        console.log("/api/auth/signup:")

        const userRequest = {
            schoolName: req.body.schoolName,
            managerName: req.body.managerName,
            directNumber: req.body.directNumber,
            password: req.body.password
        };
    
        const user = await User.create({
            schoolName: userRequest.schoolName,
            managerName: userRequest.managerName,
            directNumber: userRequest.directNumber,
            password: userRequest.password
        });

        console.log("Created: ", user);

        return res.status(202).json({message: 'ok'});

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({message: '회원가입 실패: 이미 가입하신 학교입니다.'});
        } else {
            console.log(err);
            return res.status(400).json({message: err.message});
        }
    }
});


const signout = ((req, res) => {
    try {
        console.log("/api/auth/signout:")
        if (!req.session.schoolName) {
            return res.status(400).json({ data: null, message: "Not Authorized!" });
        } else {
            req.session.destroy();
            return res.status(202).json({ data: null, message: "ok" });
        }
    } catch (err) {
        return res.status(400).json({ data: null, message: err.message });
    }
});

const session = ((req, res) => {
    try {
        console.log("/api/auth/session");
        if (!req.session.schoolName) {
            return res.status(400).json({message: "Not Authorized! "});
        } else {
            return res.status(202).json({message: "ok"});
        }
    } catch (err) {
        return res.status(400).json({message: err.message});
    }
});

module.exports = {
    signin,
    signup,
    signout,
    session
}