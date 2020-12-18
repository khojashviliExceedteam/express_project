const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors')
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const Todo = mongoose.model('Todo',
	{
		todo: String,
		checked: Boolean
	}
);
const Users = mongoose.model('Users',
	{
		username: String,
		password: String,
		todoIdList:[]
	}
);


app.use(bodyParser.json());
app.use(cors());

app.get('/getAllUsers', (req,res)=>{
	Users.find({}).then((doc) => {
		res.send(doc);
	});
})
app.post('/createUser', (req, res) => {

	const user = new Users({username: req.body.username, password: req.body.password});
	user.save().then(() => {
		Users.find({}).then((doc) => {
			res.send(doc);
		});
	});
});

app.post('/getAll', (req, res) => {
	Users.find({username:req.body.username}).then((doc) => {
		doc[0].todoIdList.map((item)=>{
			Todo.find({_id:item}).then((doc) => {
				res.send(doc);
			});
	})
}).catch((error)=>console.log('--------error in getAll catch', error))

});
app.post('/create', (req, res) => {

	const todoItems = new Todo({todo: req.body.todo, checked: false});
	todoItems.save().then(() => {
		Todo.find({}).then((doc) => {
			res.send(doc);
		});
	});
});

app.post('/editChecked', (req, res) => {

	Todo.updateOne(
		{_id: req.body},
		{
			$set: {
				checked: req.body.checked
			}
		}
	).then(() => {
		Todo.find({_id: req.body._id})
			.then((doc) => {
				res.send(doc);
			})
	});
});
app.post('/editTodo', (req, res) => {

	Todo.updateOne(
		{_id: req.body},
		{
			$set: {
				todo: req.body.todo
			}
		}
	).then(() => {
		Todo.find({_id: req.body._id})
			.then((doc) => {
				res.send(doc);
			})
	});
});

app.post('/delete', (req,res) => {
	Todo.deleteOne(
		{_id: req.body._id})
		.then( (response)=> {
			res.send(response);
				})
		.catch(()=>console.log('--------req.body in catch', req.body._id))

});


app.listen(port);