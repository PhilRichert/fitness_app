import React, { useState } from 'react';
import { LineChart, BarChart, Activity, TrendingUp, Scale, Calendar } from 'lucide-react';

// Mock data for charts
const weightData = [
  { date: '2025-01-01', value: 185 },
  { date: '2025-01-08', value: 183 },
  { date: '2025-01-15', value: 181 },
  { date: '2025-01-22', value: 180 },
  { date: '2025-01-29', value: 178 },
  { date: '2025-02-05', value: 177 },
  { date: '2025-02-12', value: 176 },
];

const workoutData = [
  { date: '2025-01', value: 12 },
  { date: '2025-02', value: 15 },
  { date: '2025-03', value: 10 },
  { date: '2025-04', value: 18 },
  { date: '2025-05', value: 20 },
  { date: '2025-06', value: 22 },
];

const strengthData = {
  'Bench Press': [135, 145, 155, 160, 165, 170],
  'Squat': [185, 195, 205, 215, 225, 235],
  'Deadlift': [225, 235, 245, 255, 265, 275],
};

const ProgressPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('weight');
  const [weightLog, setWeightLog] = useState(weightData);
  const [newWeight, setNewWeight] = useState('');

  const handleAddWeight = () => {
    if (!newWeight) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newWeightEntry = {
      date: today,
      value: parseFloat(newWeight)
    };
    
    setWeightLog([...weightLog, newWeightEntry]);
    setNewWeight('');
  };

  // Calculate stats
  const calculateWeightChange = () => {
    if (weightLog.length < 2) return 0;
    return weightLog[weightLog.length - 1].value - weightLog[0].value;
  };

  const weightChange = calculateWeightChange();
  const totalWorkouts = workoutData.reduce((sum, item) => sum + item.value, 0);
  const avgWorkoutsPerMonth = totalWorkouts / workoutData.length;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Weight Change</p>
              <p className={`text-2xl font-bold ${weightChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {weightChange} lbs
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {weightChange <= 0 ? 'Lost' : 'Gained'} since tracking began
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Workouts</p>
              <p className="text-2xl font-bold text-indigo-600">{totalWorkouts}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Completed since tracking began
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Average</p>
              <p className="text-2xl font-bold text-purple-600">{avgWorkoutsPerMonth.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Workouts per month
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('weight')}
            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'weight' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Weight Tracking
          </button>
          <button 
            onClick={() => setActiveTab('workouts')}
            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'workouts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Workout Frequency
          </button>
          <button 
            onClick={() => setActiveTab('strength')}
            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'strength' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Strength Progress
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'weight' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Weight Over Time</h3>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Enter weight"
                    className="w-24 p-2 border border-gray-300 rounded-md"
                  />
                  <button 
                    onClick={handleAddWeight}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 text-sm"
                  >
                    Log Weight
                  </button>
                </div>
              </div>
              
              {/* Weight Chart */}
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full">
                    {/* This is a simplified chart representation */}
                    <div className="relative h-48">
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                      <div className="absolute left-0 bottom-0 top-0 w-px bg-gray-200"></div>
                      
                      <div className="flex h-full items-end">
                        {weightLog.map((item, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-2 bg-indigo-500 rounded-t-sm" 
                              style={{ 
                                height: `${(item.value - 170) / 30 * 100}%`,
                                maxHeight: '100%'
                              }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                              {item.date.split('-').slice(1).join('/')}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between">
                        <span className="text-xs text-gray-500">200 lbs</span>
                        <span className="text-xs text-gray-500">185 lbs</span>
                        <span className="text-xs text-gray-500">170 lbs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Recent Weight Entries</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (lbs)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {weightLog.slice().reverse().slice(0, 5).map((entry, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{entry.value} lbs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'workouts' && (
            <div>
              <h3 className="text-lg font-bold mb-6">Monthly Workout Frequency</h3>
              
              {/* Workout Frequency Chart */}
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full">
                    {/* This is a simplified chart representation */}
                    <div className="relative h-48">
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                      <div className="absolute left-0 bottom-0 top-0 w-px bg-gray-200"></div>
                      
                      <div className="flex h-full items-end">
                        {workoutData.map((item, index) => (
                          <div key={index} className=" flex-1 flex flex-col items-center">
                            <div 
                              className="w-8 bg-purple-500 rounded-t-sm" 
                              style={{ 
                                height: `${item.value / 25 * 100}%`,
                                maxHeight: '100%'
                              }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.date.split('-')[1]}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between">
                        <span className="text-xs text-gray-500">25</span>
                        <span className="text-xs text-gray-500">12</span>
                        <span className="text-xs text-gray-500">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Monthly Summary</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workouts</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">vs. Previous</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workoutData.slice().reverse().map((entry, index, arr) => {
                        const prevValue = index < arr.length - 1 ? arr[index + 1].value : null;
                        const diff = prevValue !== null ? entry.value - prevValue : null;
                        
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{entry.value}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {diff !== null && (
                                <span className={`${diff >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                                  {diff >= 0 ? '+' : ''}{diff}
                                  {diff > 0 && <TrendingUp className="h-4 w-4 ml-1" />}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'strength' && (
            <div>
              <h3 className="text-lg font-bold mb-6">Strength Progress</h3>
              
              {/* Strength Progress Charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(strengthData).map(([exercise, data]) => (
                  <div key={exercise} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">{exercise}</h4>
                    <div className="h-32 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full">
                          {/* This is a simplified chart representation */}
                          <div className="relative h-24">
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                            
                            <div className="flex h-full items-end">
                              {data.map((value, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                  <div 
                                    className="w-2 bg-indigo-500 rounded-t-sm" 
                                    style={{ 
                                      height: `${(value - (data[0] - 50)) / 100 * 100}%`,
                                      maxHeight: '100%'
                                    }}
                                  ></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-xs text-gray-500">Start: {data[0]} lbs</span>
                      <span className="text-xs text-gray-500">Current: {data[data.length - 1]} lbs</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-green-600">
                      +{data[data.length - 1] - data[0]} lbs improvement
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium mb-3">Personal Records</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current PR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Weight</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(strengthData).map(([exercise, data]) => (
                        <tr key={exercise}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{exercise}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{data[data.length - 1]} lbs</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data[0]} lbs</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            +{data[data.length - 1] - data[0]} lbs
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;