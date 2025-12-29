'use client';

import { useEffect, useState, useRef } from 'react';

export default function DopamineDashboard() {
  // Pomodoro Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime] = useState(25 * 60);
  
  // Tasks State
  const [tasks, setTasks] = useState<Array<{ id: string; text: string; completed: boolean }>>([]);
  const [newTask, setNewTask] = useState('');
  
  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dopamine-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);
  
  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('dopamine-tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Pomodoro Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };
  
  // Task Management
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };
  
  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a0014] via-[#1a0a2e] to-[#0f0520] text-white">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      {/* Main Layout */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Section: Pomodoro + Tasks */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pb-0">
          
          {/* Left Panel: Pomodoro Timer */}
          <div className="glass-card p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-8 neon-text-cyan">POMODORO</h2>
            
            {/* Circular Progress */}
            <div className="relative w-64 h-64 mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className={`transition-all duration-1000 ${isRunning ? 'neon-glow-cyan' : ''}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#ff00ff" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold neon-text-cyan tracking-wider">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex gap-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="cyber-button cyber-button-cyan px-8 py-3 text-lg font-bold"
                >
                  START
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="cyber-button cyber-button-magenta px-8 py-3 text-lg font-bold"
                >
                  PAUSE
                </button>
              )}
              <button
                onClick={handleReset}
                className="cyber-button cyber-button-green px-8 py-3 text-lg font-bold"
              >
                RESET
              </button>
            </div>
          </div>
          
          {/* Right Panel: Quick Tasks */}
          <div className="glass-card p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 neon-text-magenta">QUICK TASKS</h2>
            
            {/* Add Task Input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className="flex-1 bg-white/5 border border-cyan-500/30 rounded px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <button
                onClick={addTask}
                className="cyber-button cyber-button-cyan px-6 py-3 font-bold"
              >
                +
              </button>
            </div>
            
            {/* Task List */}
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item flex items-center gap-3 p-4 bg-white/5 border border-magenta-500/30 rounded backdrop-blur-sm transition-all duration-300 hover:border-magenta-500 ${
                    task.completed ? 'opacity-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 accent-cyan-500 cursor-pointer"
                  />
                  <span className={`flex-1 ${task.completed ? 'line-through text-white/50' : ''}`}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-400 transition-colors font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar: Lofi Player */}
        <div className="glass-card m-6 mt-0 p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold neon-text-green">LOFI BEATS</span>
            <div className="flex-1">
              <iframe
                width="100%"
                height="80"
                src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=1&modestbranding=1"
                title="Lofi Girl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

