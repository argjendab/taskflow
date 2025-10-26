'use client'

import { useState } from "react";

export default function Dashboard() {
    
    const [tasks, setTasks] = useState([
        
    ]);

    const [newTask, setNewTask] = useState('');

    const addTask = (e) => {
        e.preventDefault();
        if(newTask.trim()) {
            setTasks([...tasks, {
                id: Date.now(),
                text: newTask,
                completed: false
            }]);
            setNewTask('');
        }
    };
    
    const toggleTask = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">TaskFlow</h1>
                    <p className="text-gray-600">Your simple task manager</p>
                </div>

                <form onSubmit={addTask} className="mb-8">
                    <div className="space-x-2">
                        <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium">
                            Add Task
                        </button>
                    </div>
                </form>
                
                {/* Tasks List */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2>Your Tasks</h2>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                            {tasks.filter(t=>!t.completed).length} pending
                        </span>
                    </div>

                    {tasks.length === 0 ? (
                        <p className="text-gray-500">No tasks yet. Add one above!</p>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map(task=> (
                                <div
                                key={task.id}
                                className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                                    task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'
                                }`}
                                >
                                    <div className="space-x-2 flex items-center">
                                        <input type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                        className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"/>
                                        <span className={
                                        task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                                        }>
                                            {task.text}
                                        </span>
                                    </div>

                                    <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Quick Stats */}
                    <div> {
                        tasks.length > 0 && ( <p className="px-0 pt-3">{tasks.filter(t=>t.completed).length} of {tasks.length} tasks completed</p> )}

                        </div>
                </div>
            </div>
        </div>
    )
}