const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:YsTexFzeD6Qn1wEW@cluster0.jnwds4t.mongodb.net/todolistDB", { useNewUrlParser: true })

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to todolist",
});

const item2 = new Item({
    name: "Hit the + button to add new item",
});

const item3 = new Item({
    name: "<- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);


//Adding default items to list and print it on todolist
app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Succesfully saved all the items to todolistDB");

                }
            });
            res.redirect('/');
        } else {
            res.render("list", { listTitle: "Today", newItems: foundItems });
        }
    });


});

app.get('/:customListName', (req, res) => {

    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })

                list.save();
                res.redirect('/' + customListName);
            } else {
                res.render("list", { listTitle: foundList.name, newItems: foundList.items });
            }
        }
    })

});



//Adding new item to mongodb and print it on todolist 
app.post('/', (req, res) => {
    const itemName = req.body.itemList;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    })

    if (listName === "Today") {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        })
    }
})



app.post('/delete', (req, res) => {
    const itemCheckedId = req.body.checkedbox;
    const listName = req.body.listItem;

    if (listName === "Today") {
        Item.findByIdAndRemove(itemCheckedId, (err) => {
            if (!err) {
                console.log("Succesfully deleted the document");
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: itemCheckedId } } }, (err, foundList) => {
            if (!err) {
                console.log(listName);

                res.redirect('/' + listName);
            }
        })
    }

})

app.get('/about', (req, res) => {
    res.render("about");
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})