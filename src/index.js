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
		axios.get(this.apiUrl)
		.then((res)=>{
			this.setState({data: res.data})
		});
	}

	addTodo(val) {
		const todo = {text: val}
		
		axios.post(this.apiUrl, todo)
			.then((res) => {
				this.state.data.push(res.data);
				this.setState({data: this.state.data});
			});
		
		console.log(this.state.data)
	}

	handleRemove(id) {
		const remainder = this.state.data.filter( 
			(todo) => {if (todo.id !==id) return todo;}
		);

		axios.delete(this.apiUrl+'/'+id)
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
