export type TeamId = 'water' | 'zero' | 'power';

export interface TeamInfo {
  id: TeamId;
  name: string;
  emoji: string;
  className: string;
}

export interface Attendee {
  id: string;
  name: string;
  team: TeamId;
  timestamp: number;
}
