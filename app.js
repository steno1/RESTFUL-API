const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const _=require("lodash")
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//connect database to mongoDB
mongoose.connect("mongodb://localhost:27017/myDB");

const articleSchema = {
    title: "String",
    content: "String"
}
const Article = mongoose.model("Article", articleSchema);
app.route("/articles")
//get route, not specific
    .get(function (req, res) {
        Article.find({}, function (err, results) {
            if (err) {
                res.send(err)
            } else {
                res.send(results)
            }

        })
    })
    
    //post or create article
    .post(function (req, res) {
        console.log(req.body.title)
        console.log(req.body.content)
        const createData = new Article({
            title: req.body.title,
            content: req.body.content
        })

        createData.save(function (err) {
            if (err) {
                res.send(err)
            } else {
                res.send("successfully added new data, into our database")
            }
        })
    })
    //delete all article route
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("all data deleted from database");
            }
        })
    });
    //get, post, put, patch and delete specific routes
    app.route("/articles/:articleTitle")
    
    .get(function(req, res){
        const current=req.params.articleTitle
Article.findOne({title: current}, function(err, result){
    if(result){
        res.send(result)
    }else{
        res.send("no article marching the title was found")
    }
})
    })
    .put(function(req, res){
Article.updateOne(
    {title:req.params.articleTitle},
   {title:req.body.title, content:req.body.content},
function(err){
if(!err){
    res.send("sucessfully updated articles");
}
})
    })
    .patch(function(req, res){
        Article.updateOne(
            {title:req.params.articleTitle},
            {$set:req.body},
            function(err){
if(!err){
    res.send("successfully updated article")
}else{
    res.send(err)
}
            }
            )
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title:req.params.articleTitle},
            
            function(err){
if(!err){
    res.send("successfully deleted item")
}else{
    res.send(err)
}
            }
            )
    });


app.listen(3000, function () {
    console.log("server is listening to port 3000")
})
