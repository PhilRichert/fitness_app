import React, { useState } from 'react';
import { Dumbbell, Plus, X, Edit, Trash2 } from 'lucide-react';

interface Workout {
  id: number;
  name: string;
  exercises: Exercise[];
}

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

const initialWorkouts: Workout[] = [
  {
    id: 1,
    name: 'Full Body Workout',
    exercises: [
      { id: 1, name: 'Squats', sets: 3, reps: 12, weight: 135 },
      { id: 2, name: 'Bench Press', sets: 3, reps: 10, weight: 155 },
      { id: 3, name: 'Deadlifts', sets: 3, reps: 8, weight: 185 }
    ]
  },
  {
    id: 2,
    name: 'Upper Body Focus',
    exercises: [
      { id: 1, name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
      { id: 2, name: 'Shoulder Press', sets: 3, reps: 10, weight: 65 },
      { id: 3, name: 'Bicep Curls', sets: 3, reps: 12, weight: 30 }
    ]
  }
];

const WorkoutPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'id'>>({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0
  });

  const handleAddWorkout = () => {
    if (newWorkoutName.trim() === '') return;
    
    const newWorkout: Workout = {
      id: Date.now(),
      name: newWorkoutName,
      exercises: []
    };
    
    setWorkouts([...workouts, newWorkout]);
    setNewWorkoutName('');
    setShowAddWorkout(false);
    setSelectedWorkout(newWorkout);
  };

  const handleAddExercise = () => {
    if (!selectedWorkout || newExercise.name.trim() === '') return;
    
    const updatedExercise = {
      ...newExercise,
      id: Date.now()
    };
    
    const updatedWorkout = {
      ...selectedWorkout,
      exercises: [...selectedWorkout.exercises, updatedExercise]
    };
    
    setWorkouts(workouts.map(w => w.id === selectedWorkout.id ? updatedWorkout : w));
    setSelectedWorkout(updatedWorkout);
    setNewExercise({
      name: '',
      sets: 3,
      reps: 10,
      weight: 0
    });
    setShowAddExercise(false);
  };

  const handleDeleteWorkout = (id: number) => {
    setWorkouts(workouts.filter(w => w.id !== id));
    if (selectedWorkout && selectedWorkout.id === id) {
      setSelectedWorkout(null);
    }
  };

  const handleDeleteExercise = (workoutId: number, exerciseId: number) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;
    
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter(e => e.id !== exerciseId)
    };
    
    setWorkouts(workouts.map(w => w.id === workoutId ? updatedWorkout : w));
    if (selectedWorkout && selectedWorkout.id === workoutId) {
      setSelectedWorkout(updatedWorkout);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Workouts List */}
      <div className="w-full md:w-1/3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">My Workouts</h2>
            <button 
              onClick={() => setShowAddWorkout(true)}
              className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {workouts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No workouts yet. Create your first workout!</p>
          ) : (
            <div className="space-y-3">
              {workouts.map(workout => (
                <div 
                  key={workout.id}
                  className={`p-4 rounded-lg cursor-pointer flex justify-between items-center ${selectedWorkout?.id === workout.id ? 'bg-indigo-100 border border-indigo-300' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => setSelectedWorkout(workout)}
                >
                  <div className="flex items-center">
                    <Dumbbell className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <h3 className="font-medium">{workout.name}</h3>
                      <p className="text-sm text-gray-500">{workout.exercises.length} exercises</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkout(workout.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Workout Modal */}
          {showAddWorkout && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Add New Workout</h3>
                  <button onClick={() => setShowAddWorkout(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    value={newWorkoutName}
                    onChange={(e) => setNewWorkoutName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Leg Day"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddWorkout}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add Workout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Workout Details */}
      <div className="w-full md:w-2/3">
        {selectedWorkout ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{selectedWorkout.name}</h2>
              <button 
                onClick={() => setShowAddExercise(true)}
                className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Add Exercise</span>
              </button>
            </div>
            
            {selectedWorkout.exercises.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No exercises in this workout yet. Add your first exercise!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedWorkout.exercises.map(exercise => (
                      <tr key={exercise.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{exercise.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {exercise.sets}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {exercise.reps}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {exercise.weight} lbs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleDeleteExercise(selectedWorkout.id, exercise.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Add Exercise Modal */}
            {showAddExercise && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Add New Exercise</h3>
                    <button onClick={() => setShowAddExercise(false)}>
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exercise Name
                      </label>
                      <input
                        type="text"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Squats"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        value={newExercise.sets}
                        onChange={(e) => setNewExercise({...newExercise, sets: parseInt(e.target.value) || 0})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        value={newExercise.reps}
                        onChange={(e) => setNewExercise({...newExercise, reps: parseInt(e.target.value) || 0})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        value={newExercise.weight}
                        onChange={(e) => setNewExercise({...newExercise, weight: parseInt(e.target.value) || 0})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleAddExercise}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Add Exercise
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
            <Dumbbell className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">Select a workout from the list to view details</p>
            {workouts.length === 0 && (
              <button 
                onClick={() => setShowAddWorkout(true)}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Create Your First Workout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;