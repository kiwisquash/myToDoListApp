import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';


// This is equivalent to ({addTodo} = props), which sets addTodo = props.addTodo
const TodoForm = ({addTodo}) => {

	let input; // input tracker

	return (
		<div>
			<input ref={node => {input = node}} />
			<button onClick={() => {
				addTodo(input.value);
				input.value = '';
			}}>Add</button>
		</div>
	)		
}

const Todo = ({todo, remove}) => {
	return (<li key={todo.id} onClick={()=>remove(todo.id)}>{todo.text}</li>);
}


const TodoList = ({todos, remove}) => {

	const todoNode = todos.map((todo) => {
		return (<Todo todo={todo} key={todo.id} remove={remove}/>)
	})

	return (<ul>{todoNode}</ul>);
}

const Title = () => {
	return (
		<h1>My to do list</h1>
	)
}

class TodoApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
		this.apiUrl = "http://5d35ea4386300e0014b63f19.mockapi.io/todo"
		this.addTodo = this.addTodo.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		fetch(this.apiUrl)
			.then(resp => resp.json())
			.then(data => {
				this.setState({data: data})
			})
			.catch((err)=>console.log(err));
	}

	addTodo(val) {
		const todo = {text: val}

		fetch(this.apiUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-type':'application/json'
			},
			body: JSON.stringify(todo)})
			.then((res)=>res.json())
			.then((data) => {
				this.state.data.push(data);
				this.setState({data: this.state.data});
			});
		
		console.log(this.state.data)
	}

	handleRemove(id) {
		const remainder = this.state.data.filter( 
			(todo) => {if (todo.id !==id) return todo;}
		);

		fetch(this.apiUrl + '/'+id, {
			method: 'DELETE',
			headers: {
				'Content-type':'application/json'
			}
		})
			.then((res)=> {
				this.setState({
					data: remainder
				})
			})
	}
	
	render() {
	 return (
		 <div>
				<Title />
				<TodoForm addTodo={this.addTodo}/>
				<TodoList todos={this.state.data} remove={this.handleRemove}/>
		 </div>
	 )
	}
}


ReactDOM.render(<TodoApp/>, document.getElementById('root'));
