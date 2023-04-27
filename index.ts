import fetch from 'node-fetch';
import { Peloton } from './src/Peloton.js';

const TIME_TO_WAIT_FOR_WORKOUT = 60000;
const TIME_TO_WAIT_FOR_METRICS = 10000;

let peloton;

async function start() {
  peloton = new Peloton('pre-existing-session-id');
  if (!peloton.getSessionId()) {
    await peloton.login('email', 'password');
  }

  waitForWorkout();
}

async function checkInProgressWorkout(workoutId) {
  const workout = await peloton.getWorkoutById(workoutId);

  if (workout.status === 'COMPLETE') {
    console.log('Workout completed, waiting for workout');
    setTimeout(waitForWorkout, TIME_TO_WAIT_FOR_WORKOUT);
    return;
  }

  const workoutMetrics = await peloton.getWorkoutMetricsById(workoutId);
  const lastTimeInPedaling = workoutMetrics.seconds_since_pedaling_start.length ?
    workoutMetrics.seconds_since_pedaling_start[workoutMetrics.seconds_since_pedaling_start.length - 1] : 0;

  const { target_metrics } = workoutMetrics.target_metrics_performance_data;

  if (Array.isArray(target_metrics)) {
    let lastMetricSegment = target_metrics.find(metricsSegment => {
      console.log(metricsSegment);
      return lastTimeInPedaling >= metricsSegment.offsets.start && lastTimeInPedaling < metricsSegment.offsets.end;
    });

    if (lastMetricSegment) {
      let difficulty = 0;
      let speed = 0;
      lastMetricSegment.metrics.forEach(metric => {
        const value = Math.round((metric.lower + metric.upper) / 2);
        if (metric.name === 'speed' || metric.name === 'cadence') {
          speed = value;
        } else if (metric.name === 'incline' || metric.name === 'resistance') {
          difficulty = value;
        }
      });

      console.log(speed, difficulty);
    }
  }

  setTimeout(() => checkInProgressWorkout(workoutId), TIME_TO_WAIT_FOR_METRICS);
}

async function getTopWorkout() {
  const workouts = await peloton.getWorkouts(1);
  return workouts.data[0];
}

async function waitForWorkout() {
  const topWorkout = await getTopWorkout();
  if (topWorkout.status === 'IN_PROGRESS') {
    console.log('Workout in progress, monitoring');
    checkInProgressWorkout(topWorkout.id);
  } else {
    console.log('No workout in progress, waiting...');
    setTimeout(waitForWorkout, TIME_TO_WAIT_FOR_WORKOUT);
  }
}

start();
