const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

let items = ['hola', 'chao', 'como', 'estas'];
let workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {

    let today = new Date();
    let currentDay = today.getDay();


    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }

    let day = today.toLocaleDateString("en-US", options);
    res.render("list", { listTitle: day, newItems: items });
});

app.post('/', (req, res) => {
    let item = req.body.itemList;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect("/");
    }


})

app.get('/work', (req, res) => {
    res.render("list", { listTitle: "Work List", newItems: workItems });
})

app.get('/about', (req, res) => {
    res.render("about");
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})