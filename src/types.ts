export type PelotonWorkoutCount = {
  name: string;
  slug: string;
  count: number;
  icon_url: string;
};

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
