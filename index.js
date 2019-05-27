const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const DB_URL = 'mongodb://localhost:27017/todolist'
mongoose.connect(DB_URL,{ useNewUrlParser: true })
const conn = mongoose.connection
conn.on('connected', function () {
  console.log('Mongoose connection open to ' + DB_URL);
});
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

/**
* 连接断开
*/
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

const todoSchema = mongoose.Schema({
  // todo
  'detail': {type: String},
  // complete
  'iscompleted': {type: Boolean}
})
const todolistModel = mongoose.model('todolistModel', todoSchema)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let data = [];

app.get("/data", function(req, res) {
  todolistModel.find((err, todo) => data=todo);
  res.send(data);
})
app.post("/data", function(req, res) {
  const body = req.body;
  let newtodo = new todolistModel({
    detail: body.detail,
    iscompleted: body.iscompleted
  })
  newtodo.save((err, res) => {
    if (err) {
      return console.log(err);
    }
  })
  data.push(req.body)
  res.send(data);
})
app.delete("/data", function(req, res) {
  console.log("delete is coming",req.query)
  todolistModel.deleteOne({detail: req.query.detail}, function(err) {
    if (err) console.log(err);
  })
  data = data.filter((item) => item.detail!=req.query.detail)
  res.send(data);
})
app.listen("3000");
console.log("listen on port 3000");
