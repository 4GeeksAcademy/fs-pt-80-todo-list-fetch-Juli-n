import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
    const url = 'https://playground.4geeks.com/todo';

    const [userData, setUserData] = useState([]);
    const [userName, setUserName] = useState('Julian');
    const [tarea, setTarea] = useState('');

    const createTodo = async () => {
        try {
            const resp = await fetch(url + '/users/' + userName, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!resp.ok) throw new Error('something went wrong!');
            const data = await resp.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        createTodo();
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const resp = await fetch(url + '/users/' + userName);
            if (!resp.ok) throw new Error('something went wrong!');
            const data = await resp.json();
            setUserData(data);
        } catch (error) {
            console.log(error);
        }
    };

    const createTarea = async (tarea) => {
        try {
            const payload = {
                label: tarea,
                is_done: false
            };
            const resp = await fetch(url + '/todos/' + userName, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) throw new Error('something went wrong!');
            getUserData();
            setTarea('');
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const resp = await fetch(url + '/todos/' + id, {
                method: 'DELETE'
            });
            if (!resp.ok) throw new Error('something went wrong!');
            getUserData();
        } catch (error) {
            console.log(error);
        }
    };

    const toggleComplete = async (id, currentStatus) => {
        try {
            const payload = { is_done: !currentStatus };
            const resp = await fetch(url + '/todos/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) throw new Error('something went wrong!');
            getUserData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createTarea(tarea);
    };

    return (
        <div className="text-center main-container">
            <h1 className="text-center mt-5">Todo List con Fetch</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    type="text"
                    value={tarea}
                    onChange={(e) => setTarea(e.target.value)}
                    required
                    className="input-task"
                    placeholder="Agregar nueva tarea"
                />
            </form>
            <ul className="task-list">
                {userData.todos?.map(el => (
                    <div key={el.id} className="task-container">
                        <li style={{ textDecoration: el.is_done ? 'line-through' : 'none' }}>
                            <input
                                type="checkbox"
                                checked={el.is_done}
                                onChange={() => toggleComplete(el.id, el.is_done)}
                                style={{ marginRight: '10px' }}
                            />
                            {el.label}
                            <span onClick={() => deleteTodo(el.id)} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                        </li>
                    </div>
                ))}
                <p>{userData.todos?.length} left to do</p>
            </ul>
        </div>
    );
};

export default Home;


