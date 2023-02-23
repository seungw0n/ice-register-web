require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const connect = require("./schemas"); // DB connection
const express_session = require("express-session"); // Session
const MongoStore = require("connect-mongo"); // Session store
const path = require("path");
// routes
const auth = require("./routes/auth.routes");
const user = require("./routes/user.routes");
const register = require("./routes/register.routes");

connect(process.env.MONGO_URI);

// middlewares
app.use(express.json()); // body parser
app.use(cors({
    origin: '*',
    credential: true
}));

app.use(
    express_session({
        secret: process.env.secret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
        cookie: {maxAge: 1000 * 60 * 60 * 3}
    })
);

app.use("/api", auth);
app.use("/api", user);
app.use("/api", register);

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(process.env.PORT, ()=> {
    console.log("Listening on PORT: ", process.env.PORT);
});
