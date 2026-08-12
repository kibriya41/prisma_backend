import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import app from "./app";

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log("welcome to the server")
});
