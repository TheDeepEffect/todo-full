const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000;
const uri = `mongodb+srv://Manek:Abc123@cluster0-yxbx7.mongodb.net/todo?retryWrites=true&w=majority/todo`;

const todoRoute = express.Router();

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', () => {
	console.log(connection.name);
	console.log('DB connection established! ');
});

todoRoute.route('/').get((req, res) => {
	Todo.find((err, todos) => {
		err ? console.log(err) : res.json(todos);
	});
});

todoRoute.route('/:id').get((req, res) => {
	let id = req.params.id;
	Todo.findById(id, (err, todo) => {
		res.json(todo);
	});
});

todoRoute.route('/add').post((req, res) => {
	let todo = new Todo(req.body);
	todo.save()
		.then(todo => {
			res.status(200).json({ todo: 'todo added successfully' });
		})
		.catch(err => {
			res.status(400).send('adding todo failed');
		});
});

todoRoute.route('/update/:id').post((req, res) => {
	Todo.findById(req.params.id, (err, todo) => {
		if (!todo) {
			res.status(404).send('data not found');
		} else {
			todo.description = req.body.description;
			todo.responsible = req.body.responsible;
			todo.priority = req.body.priority;
			todo.completed = req.body.completed;

			todo.save()
				.then(todo => {
					res.json('Todo Updated');
				})
				.catch(err => {
					res.status(400).send('Update not possible');
				});
		}
	});
});

app.use('/todos', todoRoute);

app.listen(PORT, () => {
	console.log('server running on ' + PORT);
});
