'use client'

import { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export default function Dashboard() {
    
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [dueDate, setDueDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [filterCompletion, setFilterCompletion] = useState<'all' | 'completed' | 'pending'>('all');

    //load tasks from localstorage when component mounts
    useEffect(()=>{
        const savedTasks = localStorage.getItem('taskflow-tasks');
        if(savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
    }, [tasks]);

    // FIX: Added proper TypeScript type for the event
    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if(newTask.trim()) {
            setTasks([...tasks, {
                id: Date.now(),
                text: newTask,
                completed: false,
                priority: priority,
                dueDate: dueDate
            }]);
            setNewTask('');
            setPriority('medium');
            setDueDate('');
        }
    };
    
    // FIX: Added proper TypeScript type for the id
    const toggleTask = (id: number) => {
        setTasks(tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed } : task
        ));
    };

    // FIX: Added proper TypeScript type for the id
    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const getPriorityColor = (priority: string) => {
        switch(priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDueDateStatus = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { text: 'Overdue', color: 'bg-red-500 text-white' };
    if (daysDiff === 0) return { text: 'Due today', color: 'bg-orange-500 text-white' };
    if (daysDiff <= 3) return { text: `Due in ${daysDiff} days`, color: 'bg-yellow-500 text-white' };
    
    return { text: new Date(dueDate).toLocaleDateString(), color: 'bg-gray-100 text-gray-800' };
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if(a.completed && !b.completed) return 1;
        if(!a.completed && b.completed) return -1;

        if(a.dueDate && b.dueDate){
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if(a.dueDate) return -1;
        if (b.dueDate) return 1;

        return 0;
    })

    const filteredTasks = sortedTasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPriority = filterPriority === 'all' ||  task.priority === filterPriority;

        const matchesCompletion =
        filterCompletion === 'all' ||
        (filterCompletion === 'completed' && task.completed) ||
        (filterCompletion === 'pending' && !task.completed);

        return matchesSearch && matchesPriority && matchesCompletion;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">TaskFlow</h1>
                    <p className="text-gray-600">Your simple task manager</p>
                </div>

                <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                        <input type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none  focus:ring-2 focus:ring-blue-500"
                        />
                        </div>
                        
                        <select value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">🔥 High</option>
                            <option value="medium">⚡ Medium</option>
                            <option value="low">💤 Low</option>
                        </select>

                         <select
            value={filterCompletion}
            onChange={(e) => setFilterCompletion(e.target.value as 'all' | 'completed' | 'pending')}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
        </select>
        {(searchTerm || filterPriority !== 'all' || filterCompletion !== 'all') && (
            <button
                onClick={() => {
                    setSearchTerm('');
                    setFilterPriority('all');
                    setFilterCompletion('all');
                }}
                className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 font-medium"
            >
                Clear
            </button>
        )}
                    </div>
                    {filteredTasks.length !== sortedTasks.length && (
        <div className="mt-3 text-sm text-gray-600">
            Showing {filteredTasks.length} of {sortedTasks.length} tasks
            {searchTerm && ` matching "${searchTerm}"`}
        </div>
    )}
                </div>

                <form onSubmit={addTask} className="mb-8">
                    <div className="flex gap-2">
                        <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus-ring-2 focus:ring-blue-500"
                        >
                            <option value="low">💤 Low</option>
                            <option value="medium">⚡ Medium</option>
                            <option value="high">🔥 High</option>
                        </select>

                        <input type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <h2 className="text-xl font-semibold">Your Tasks</h2>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                            {tasks.filter(t => !t.completed).length} pending
                        </span>
                    </div>

                    {filteredTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
                    ) : (
                        <div className="space-y-3">
                            {filteredTasks.map(task => { 
                                const dueStatus = getDueDateStatus(task.dueDate);

                                return (
                                <div
                                key={task.id}
                                className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                                    task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'
                                }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input 
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                        className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                                        />
                                        <span className={
                                        task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                                        }>
                                            {task.text}
                                        </span>
                                        {dueStatus && (
                                        <div className={`text-xs font-medium px-2 py-1 rounded-full mt-1 ${dueStatus.color}`}>
                                        📅 {dueStatus.text}
                                        </div>
                                        )}
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                                            {task.priority === 'high' ? 'High':
                                            task.priority === 'medium' ? 'Medium':
                                            'Low'
                                            }

                                        </span>
                                    </div>

                                    <button 
                                    onClick={() => deleteTask(task.id)} 
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )})}
                        </div>
                    )}
                    
                    {/* Quick Stats */}
                    <div className="mt-4">
                        {tasks.length > 0 && ( 
                            <p className="text-gray-600 text-center">
                                {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
                            </p> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}