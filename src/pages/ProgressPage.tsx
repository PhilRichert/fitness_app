import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LineChart, BarChart, Activity, TrendingUp, Scale, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { de } from 'date-fns/locale';

interface WeightLog {
  id: string;
  weight: number;
  recorded_at: string;
}

interface WorkoutLog {
  id: string;
  workout_id: string;
  completed_at: string;
}

const ProgressPage: React.FC = () => {
  const { user } = useAuth0();
  const [activeTab, setActiveTab] = useState('weight');
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.sub) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [weightLogsResponse, workoutLogsResponse] = await Promise.all([
        supabase
          .from('weight_logs')
          .select('*')
          .order('recorded_at', { ascending: true }),
        supabase
          .from('workout_logs')
          .select('*')
          .order('completed_at', { ascending: true })
      ]);

      if (weightLogsResponse.error) throw weightLogsResponse.error;
      if (workoutLogsResponse.error) throw workoutLogsResponse.error;

      setWeightLogs(weightLogsResponse.data);
      setWorkoutLogs(workoutLogsResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight || !user?.sub) return;

    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .insert([
          {
            user_id: user.sub,
            weight: parseFloat(newWeight)
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setWeightLogs([...weightLogs, data]);
      setNewWeight('');
    } catch (error) {
      console.error('Error adding weight:', error);
    }
  };

  const calculateWeightChange = () => {
    if (weightLogs.length < 2) return 0;
    return weightLogs[weightLogs.length - 1].weight - weightLogs[0].weight;
  };

  const calculateMonthlyWorkouts = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return workoutLogs.filter(log => {
      const logDate = parseISO(log.completed_at);
      return logDate >= monthStart && logDate <= monthEnd;
    }).length;
  };

  const weightChange = calculateWeightChange();
  const totalWorkouts = workoutLogs.length;
  const monthlyWorkouts = calculateMonthlyWorkouts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gewichtsänderung</p>
              <p className={`text-2xl font-bold ${weightChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {weightChange.toFixed(1)} kg
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {weightChange <= 0 ? 'Abgenommen' : 'Zugenommen'} seit Beginn
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Workouts Gesamt</p>
              <p className="text-2xl font-bold text-indigo-600">{totalWorkouts}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Abgeschlossen seit Beginn
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dieser Monat</p>
              <p className="text-2xl font-bold text-purple-600">{monthlyWorkouts}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Workouts im aktuellen Monat
          </p>
        </div>
      </div>

      {/* Weight Tracking Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Gewichtsverlauf</h3>
          <div className="flex space-x-2">
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Gewicht eingeben"
              className="w-32 p-2 border border-gray-300 rounded-md"
              step="0.1"
            />
            <button 
              onClick={handleAddWeight}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Hinzufügen
            </button>
          </div>
        </div>

        {weightLogs.length > 0 ? (
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gewicht (kg)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {weightLogs.slice().reverse().map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(parseISO(log.recorded_at), 'dd.MM.yyyy', { locale: de })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {log.weight} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Noch keine Gewichtsdaten vorhanden. Füge deinen ersten Eintrag hinzu!
          </p>
        )}
      </div>

      {/* Workout History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-6">Workout-Verlauf</h3>
        {workoutLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workout</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workoutLogs.slice().reverse().map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(log.completed_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      Workout #{log.workout_id.slice(0, 8)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Noch keine Workouts abgeschlossen. Zeit für dein erstes Training!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;