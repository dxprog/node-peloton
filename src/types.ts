export type PelotonLoginResponse = {
  session_id: string;
  user_id: string;
  pubsub_session: Record<string, unknown>;
}
