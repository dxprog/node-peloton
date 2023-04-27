type Nullable<T> = T | null;

export type PelotonWorkoutCount = {
  name: string;
  slug: string;
  count: number;
  icon_url: string;
};

export type PelotonSegment = {
  id: string;
  length: number;
  start_time_offset: number;
  icon_url: string;
  intensity_in_mets: number;
  metrics_type: string;
  icon_name: string;
  icon_slug: string;
  name: string;
  is_drill: boolean;
};

export type PelotonEffortZones = {
  total_effort_points: number;
  heart_rate_zone_durations: {
    heart_rate_z1_duration: number;
    heart_rate_z2_duration: number;
    heart_rate_z3_duration: number;
    heart_rate_z4_duration: number;
    heart_rate_z5_duration: number;
  }
}

export type PelotonWorkout = {
  created_at: number;
  device_type: string,
  end_time: Nullable<number>;
  fitness_discipline: string;
  has_pedaling_metrics: boolean;
  has_leaderboard_metrics: boolean;
  id: string;
  is_total_work_personal_record: boolean;
  is_outdoor: boolean;
  metrics_type: any;
  name: string;
  peloton_id: string;
  platform: string;
  start_time: number;
  status: 'IN_PROGRESS' | 'COMPLETE';
  timezone: string;
  title: string | null;
  total_work: number;
  user_id: string;
  workout_type: string;
  total_video_watch_time_seconds: number;
  total_video_buffering_seconds: number;
  v2_total_video_watch_time_seconds: Nullable<number>;
  v2_total_video_buffering_seconds: Nullable<number>;
  total_music_audio_play_seconds: Nullable<number>;
  total_music_audio_buffer_seconds: Nullable<number>;
  created: number;
  device_time_created_at: number;
  strava_id: Nullable<string>;
  fitbit_id: Nullable<string>;
  effort_zones: Nullable<PelotonEffortZones>;
  service_id: any;
};

export type PelotonTargetMetrics = {
  offsets: {
    start: number;
    end: number;
  };
  segment_type: string;
  metrics: [
    {
      name: 'speed' | 'incline' | 'cadence' | 'resistance';
      lower: number;
      upper: number;
    }
  ];
};

export type PelotonWorkoutMetrics = {
  duration: number;
  is_class_plan_shown: boolean;
  segment_list: PelotonSegment[];
  seconds_since_pedaling_start: number[];
  target_metrics_performance_data: {
    target_metrics:  PelotonTargetMetrics[]
  };
};

export type PelotonWorkouts = {
  data: Partial<PelotonWorkout>[];
}

export type PelotonMeResponse = {
  id: string;
  username: string;
  location: string;
  first_name: string;
  middle_initial: string;
  last_name: string;
  name: string;
  created_at: number;
  total_workouts: number;
  total_non_pedaling_metric_workouts: number;
  workout_counts: PelotonWorkoutCount[];
};

export type PelotonLoginResponse = {
  session_id: string;
  user_id: string;
  pubsub_session: Record<string, unknown>;
};
