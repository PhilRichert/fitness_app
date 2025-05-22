import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';

interface ScheduledWorkout {
  id: number;
  workoutName: string;
  date: Date;
  time: string;
  completed: boolean;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const initialSchedule: ScheduledWorkout[] = [
  {
    id: 1,
    workoutName: 'Full Body Workout',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    time: '07:00',
    completed: true
  },
  {
    id: 2,
    workoutName: 'Upper Body Focus',
    date: new Date(),
    time: '18:30',
    completed: false
  },
  {
    id: 3,
    workoutName: 'Full Body Workout',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: '07:00',
    completed: false
  }
];

const SchedulePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduledWorkout[]>(initialSchedule);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    workoutName: '',
    time: '08:00'
  });

  // Get days in month for calendar
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Calendar navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Check if a date has a scheduled workout
  const hasWorkout = (date: Date) => {
    return schedule.some(workout => 
      workout.date.getDate() === date.getDate() && 
      workout.date.getMonth() === date.getMonth() && 
      workout.date.getFullYear() === date.getFullYear()
    );
  };

  // Get workouts for selected date
  const getWorkoutsForDate = (date: Date) => {
    return schedule.filter(workout => 
      workout.date.getDate() === date.getDate() && 
      workout.date.getMonth() === date.getMonth() && 
      workout.date.getFullYear() === date.getFullYear()
    );
  };

  // Add new workout to schedule
  const handleAddWorkout = () => {
    if (newWorkout.workoutName.trim() === '') return;
    
    const newScheduledWorkout: ScheduledWorkout = {
      id: Date.now(),
      workoutName: newWorkout.workoutName,
      date: selectedDate,
      time: newWorkout.time,
      completed: false
    };
    
    setSchedule([...schedule, newScheduledWorkout]);
    setNewWorkout({
      workoutName: '',
      time: '08:00'
    });
    setShowAddWorkout(false);
  };

  // Toggle workout completion status
  const toggleWorkoutCompletion = (id: number) => {
    setSchedule(schedule.map(workout => 
      workout.id === id ? { ...workout, completed: !workout.completed } : workout
    ));
  };

  // Delete workout from schedule
  const deleteWorkout = (id: number) => {
    setSchedule(schedule.filter(workout => workout.id !== id));
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 border border-gray-200"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const hasWorkoutOnDay = hasWorkout(date);
      
      days.push(
        <div 
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-10 border border-gray-200 flex items-center justify-center cursor-pointer relative
            ${isToday ? 'bg-blue-50' : ''}
            ${isSelected ? 'bg-indigo-100 border-indigo-400' : 'hover:bg-gray-50'}
          `}
        >
          <span className={isToday ? 'font-bold text-blue-600' : ''}>{day}</span>
          {hasWorkoutOnDay && (
            <div className="absolute bottom-1 w-4 h-1 rounded-full bg-indigo-500"></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const selectedDateWorkouts = getWorkoutsForDate(selectedDate);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Calendar */}
      <div className="w-full md:w-2/3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Workout Schedule</h2>
            <div className="flex items-center space-x-4">
              <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-medium">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {daysOfWeek.map(day => (
              <div key={day} className="h-10 flex items-center justify-center font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {renderCalendarDays()}
          </div>
        </div>
      </div>
      
      {/* Selected Day Schedule */}
      <div className="w-full md:w-1/3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              {selectedDate.toDateString() === new Date().toDateString() 
                ? 'Today' 
                : `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`}
            </h2>
            <button 
              onClick={() => setShowAddWorkout(true)}
              className="bg-indigo-600 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-700 transition"
            >
              Add Workout
            </button>
          </div>
          
          {selectedDateWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No workouts scheduled for this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateWorkouts.map(workout => (
                <div key={workout.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{workout.workoutName}</h3>
                      <div className="flex items-center text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{workout.time}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleWorkoutCompletion(workout.id)}
                        className={`p-1 rounded-full ${workout.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteWorkout(workout.id)}
                        className="p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className={`text-sm ${workout.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {workout.completed ? 'Completed' : 'Not completed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Workout Modal */}
          {showAddWorkout && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Schedule Workout</h3>
                  <button onClick={() => setShowAddWorkout(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Scheduling for: {selectedDate.toDateString()}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Workout Name
                      </label>
                      <input
                        type="text"
                        value={newWorkout.workoutName}
                        onChange={(e) => setNewWorkout({...newWorkout, workoutName: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Full Body Workout"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={newWorkout.time}
                        onChange={(e) => setNewWorkout({...newWorkout, time: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddWorkout}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Schedule Workout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;