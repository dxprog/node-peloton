import fetch from 'node-fetch';

import { PelotonLoginResponse, PelotonMeResponse, PelotonWorkout, PelotonWorkoutMetrics, PelotonWorkouts } from './types';

const BASE_URL = 'https://api.onepeloton.com';

enum HttpVerb {
  Get = 'GET',
  Post = 'POST'
}

export class Peloton {
  private username: string;
  private password: string;
  private sessionId: string;
  private userId: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId;
  }

  getSessionId() {
    return this.sessionId;
  }

  async login(username: string, password: string) {
    this.username = username;
    this.password = password;

    const response = await this._request<PelotonLoginResponse>('auth/login', HttpVerb.Post, {
      username_or_email: username,
      password,
    });

    this.sessionId = response.session_id;
    this.userId = response.user_id;
  }

  async getMe(): Promise<PelotonMeResponse> {
    if (!this.sessionId) {
      throw new Error('Unable to fetch workouts before logging in');
    }

    const response = await this._request<PelotonMeResponse>('api/me');

    // stash this while we have it
    this.userId = response.id;

    return response;
  }

  async getWorkouts(count: number = 0, page: number = 0): Promise<PelotonWorkouts> {
    if (!this.sessionId) {
      throw new Error('Unable to fetch workouts before logging in');
    }

    // we need the user ID, so if we don't have it, get it
    if (!this.userId) {
      await this.getMe();
    }

    return this._request<PelotonWorkouts>(`api/user/${this.userId}/workouts?sort_by=-created&page=${page}&limit=${count}`);
  }

  async getWorkoutById(workoutId: string): Promise<PelotonWorkout> {
    if (!this.sessionId) {
      throw new Error('Unable to fetch workouts before logging in');
    }

    return this._request<PelotonWorkout>(`api/workout/${workoutId}`);
  }

  async getWorkoutMetricsById(workoutId: string): Promise<PelotonWorkoutMetrics> {
    if (!this.sessionId) {
      throw new Error('Unable to fetch workouts before logging in');
    }

    return this._request<PelotonWorkoutMetrics>(`api/workout/${workoutId}/performance_graph?every_n=50`);
  }

  private async _request<T>(path: string, method: HttpVerb = HttpVerb.Get, data?: Record<string, string>) {
    const response = await fetch(`${BASE_URL}/${path}`, {
      method,
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'node-peloton',
        'Cookie': this.sessionId ? `peloton_session_id=${this.sessionId}` : undefined,
      },
    });

    return response.json() as T;
  }
}
