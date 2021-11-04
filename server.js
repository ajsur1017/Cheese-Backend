///////////////////////////////////
// Dependencies
///////////////////////////////////
require("dotenv").config()
const { PORT = 3000, MONGODB_URL } = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

//////////////////////////////////
// Database Connection
//////////////////////////////////
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
    .on("open", () => console.log("Connected to Mongo"))
    .on("close", () => console.log("Disonnected to Mongo"))
    .on("error", (error) => console.log(error))

/////////////////////////////////
// Models
/////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema)
/////////////////////////////////
// Middleware
/////////////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
///////////////////////////////
// ROUTES
////////////////////////////////
app.get("/", (req, res) => {
    res.send("hello world");
});
// INDEX
app.get("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});
// NEW
app.post("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});
// UPDATE
app.put("/cheese/:id", async (req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        res.status(400).json(error);
    }
});
// DELETE
app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});
///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));