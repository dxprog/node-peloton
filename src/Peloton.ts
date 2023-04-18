import fetch from 'node-fetch';

import { PelotonLoginResponse } from './types';

const BASE_URL = 'https://api.onepeloton.com';

enum HttpVerb {
  Get = 'GET',
  Post = 'POST'
}

export class Peloton {
  private username: string;
  private password: string;
  private session: string;
  private userId: string;

  constructor() {

  }

  async login(username: string, password: string) {
    this.username = username;
    this.password = password;

    const response = await this._request<PelotonLoginResponse>('auth/login', HttpVerb.Post, {
      username_or_email: username,
      password,
    });

    this.session = response.session_id;
    this.userId = response.user_id;
  }

  async _request<T>(path: string, method: HttpVerb = HttpVerb.Get, data?: Record<string, string>) {
    const response = await fetch(`${BASE_URL}/${path}`, {
      method,
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'node-peloton',
        'Cookie': this.session ? `peloton_session_id=${this.session}` : undefined,
      },
    });

    return response.json() as T;
  }
}
