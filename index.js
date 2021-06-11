const express = require("express");
const cors = require("cors")
const hbs = require("hbs");
const wax = require("wax-on")

// import mongo items
const MongoUtil = require('./MongoUtil');
const ObjectId = require("mongodb").ObjectId

require("dotenv").config();
const mongoUrl = process.env.MONGO_URL


// initialise express
let app = express();

app.use(express.json());
app.use(cors());

app.set("view engine", "hbs")
app.use(express.static('public'))

wax.on(hbs.handlebars)
wax.setLayoutPath('./views/layouts');

// enable forms
app.use(express.urlencoded({
    extended:false
}))

// SETUP ROUTES
async function main() {
    let db = await MongoUtil.connect(mongoUrl, "nhj-todo-app")

    app.get('/profiles', async (req,res) => {
        let allProfiles = await db.collection('profiles')
            .find({})
            .toArray()

            res.send(allProfiles);
    })

    // register new user profiles 
    app.post("/profile/register", async (req,res) => {
        try {
            let newProfile = await db.collection('profiles')
                .insertOne({
                    'username':req.body.username,
                    'userID':req.body.userID,
                    'date_joined':req.body.date_joined,
                    'friends':req.body.friendsList
                    
                })
                console.log(newProfile.ops[0])
                res.send(newProfile);
        } catch (e) {
            res.status(500);
            res.send({
                'error':"Error posting new ingredient"
            })
            console.log(e);
        }
    })

    // see user's todo cards 
    app.get("/:profile/todos", async (req,res) => {
        // let userProfileID = req.params.profile;
        
        let userProfile = await db.collection('profiles')
            .findOne({
                username:req.params.profile
            })
        console.log("user profile: ",userProfile)
        
        let userTodo = await db.collection('todoCards')
            .find({
                userID:userProfile._id
            }).toArray()
        // console.log("found todos: ",userTodo)
        res.status(200);
        res.send(userTodo);
    })

    // create a todo card from user 
    app.post("/:profile/todo/new", async (req, res) => {

    })
}


// call the main() to run the routes
main()


// START THE SERVER  
app.listen(3000, ()=> {
    console.log("server has started")
});