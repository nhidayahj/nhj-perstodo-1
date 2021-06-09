const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on")

// import mongo items
const MongoUtil = require('./MongoUtil');
const ObjectId = require("mongodb").ObjectId

require("dotenv").config();
const mongoUrl = process.env.MONGO_URL


// initialise express
let app = express();

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
    let db = await MongoUtil.connect(mongoUrl, "tgc11_recipe_app")

    // view all ingredient list from mongodb
    app.get("/ingredients", async (req,res) => {
        let all_ingredients = await db.collection('ingredients')
            .find({})
            .toArray()

            res.render('ingredients/all', {
                'ingredientList':all_ingredients
            })
    })

    // get the /create page from hbs folder
    app.get("/ingredients/create", async (req,res) => {
        res.render("ingredients/create");
    })

    // enable the POST form method to sent to mongo
    app.post("/ingredients/create", async (req,res) => {
        await db.collection('ingredients').insertOne({
            'name':req.body.ingredientItem
        })

        // after posting, redirect the link to display all ingredients 
        res.redirect('/ingredients')
    })
}


// call the main() to run the routes
main()


// START THE SERVER  
app.listen(3000, ()=> {
    console.log("server has started")
});