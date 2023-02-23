const express = require("express");
const mongoose = require("mongoose");

const connect = async (MONGO_URI) => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB fails to connect");
    }
};

mongoose.connection.on('error', (err) => {
    console.error("MongoDB connection error: ", err);
});

mongoose.connection.on("disconnected", () => {
    console.error("MongoDB disconnected");
    connect();
})

module.exports = connect;