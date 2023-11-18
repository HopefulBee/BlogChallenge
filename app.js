//Required Modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "This is a simple blog that was designed by me with the help of Angela Yu. This blog was a challenge after we finished the EJS Module under the 'The Complete Web Development Bootcamp' tutorial. I used the knowledge from what I've learned in the Frontend (HTML, CSS, Javascript) and Backend (Node, Express, Git & Github, EJS) modules. This was a bit challenging towards the end because at a point it was bringing out the desired result. I will probably never use this blog, but no matter, I'm proud of how far I've come. Writing this instead of the basic 'Lorem Ipsum blah blah blah...' because it looks boring. So here you go, Council Of UONAs and anyone else who ever comes across this by chance. Hope you actually read this, else it will be a complete waste of time typing all this. ❤️❤️❤️❤️ ";
const aboutContent = "Nothing much here. I'm just a computer scientist who's learning about web development while finding my place in this world. I love to watch movies, listen to songs, eat good food and just recently I've started liking web development. That's all about me. ";
const contactContent = "Yeah.....I'm not putting my contact online so that's that ❤️❤️❤️❤️.";

const app = express();

//App Set and Use
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Adding mongoose to store documents
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');
  //New Schema for the blog posts
  const postSchema = new mongoose.Schema({
      title: String,
      content: String
  });
  //New model
  const Post = mongoose.model("Post", postSchema);

//Home Page
  app.get("/", async function(req, res){
    await Post.find({}).then(posts =>{
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });
  });

  //Compose Section
  app.get("/compose", function(req, res){
    res.render("compose");
  });
  
  app.post("/compose", async function(req, res){
    const post = new Post ({
      title: req.body.postTitle,
      content: req.body.postBody
    });
    await post.save();
    res.redirect("/");
  });

  app.get("/posts/:postId", async function(req, res){
    const requestedPostId = _.lowerCase(req.params.postId);
    
    await Post.findOne({_id: requestedPostId}).then(post => {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  });
  
  //About Page
  app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
  });
  
  //Contact Page
  app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
  });

  //Server Check
  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  
}
