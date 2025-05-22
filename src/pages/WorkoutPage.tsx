import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Dumbbell, Plus, X, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Workout {
  id: string;
  name: string;
  created_at: string;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

const WorkoutPage: React.FC = () => {
  const { user } = useAuth0();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.sub) {
      fetchWorkouts();
    }
  }, [user]);

  const fetchWorkouts = async () => {
    try {
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (workoutsError) throw workoutsError;

      const workoutsWithExercises = await Promise.all(
        workoutsData.map(async (workout) => {
          const { data: exercisesData, error: exercisesError } = await supabase
            .from('exercises')
            .select('*')
            .eq('workout_id', workout.id)
            .order('created_at', { ascending: true });

          if (exercisesError) throw exercisesError;

          return {
            ...workout,
            exercises: exercisesData || []
          };
        })
      );

      setWorkouts(workoutsWithExercises);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setIsLoading(false);
    }
  };

  const handleAddWorkout = async () => {
    if (newWorkoutName.trim() === '' || !user?.sub) return;

    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert([
          {
            name: newWorkoutName,
            user_id: user.sub
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newWorkout = {
        ...data,
        exercises: []
      };

      setWorkouts([newWorkout, ...workouts]);
      setNewWorkoutName('');
      setShowAddWorkout(false);
      setSelectedWorkout(newWorkout);
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const handleAddExercise = async () => {
    if (!selectedWorkout || newExercise.name.trim() === '') return;

    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([
          {
            ...newExercise,
            workout_id: selectedWorkout.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const updatedWorkout = {
        ...selectedWorkout,
        exercises: [...selectedWorkout.exercises, data]
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
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkouts(workouts.filter(w => w.id !== id));
      if (selectedWorkout && selectedWorkout.id === id) {
        setSelectedWorkout(null);
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const handleDeleteExercise = async (workoutId: string, exerciseId: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Workouts List */}
      <div className="w-full md:w-1/3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Meine Workouts</h2>
            <button 
              onClick={() => setShowAddWorkout(true)}
              className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {workouts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Noch keine Workouts. Erstelle dein erstes Workout!</p>
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
                      <p className="text-sm text-gray-500">{workout.exercises.length} Übungen</p>
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
                  <h3 className="text-lg font-bold">Neues Workout hinzufügen</h3>
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
                    placeholder="z.B. Beintraining"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddWorkout}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Workout hinzufügen
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
                <span>Übung hinzufügen</span>
              </button>
            </div>
            
            {selectedWorkout.exercises.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Noch keine Übungen in diesem Workout. Füge deine erste Übung hinzu!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Übung</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sätze</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wiederholungen</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gewicht</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
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
                          {exercise.weight} kg
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
                    <h3 className="text-lg font-bold">Neue Übung hinzufügen</h3>
                    <button onClick={() => setShowAddExercise(false)}>
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Übungsname
                      </label>
                      <input
                        type="text"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="z.B. Kniebeugen"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sätze
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
                        Wiederholungen
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
                        Gewicht (kg)
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
                      Übung hinzufügen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
            <Dumbbell className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">Wähle ein Workout aus der Liste aus, um Details anzuzeigen</p>
            {workouts.length === 0 && (
              <button 
                onClick={() => setShowAddWorkout(true)}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Erstelle dein erstes Workout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;