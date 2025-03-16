
export type Team = {
  id: string;
  name: string;
  logo: string;
  group: string;
};

export type Player = {
  id: string;
  name: string;
  teamId: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
};

export type Match = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  stage: 'group' | 'quarterfinal' | 'semifinal' | 'final';
  group?: string;
  yellowCards: {
    homeTeam: number;
    awayTeam: number;
  };
  redCards: {
    homeTeam: number;
    awayTeam: number;
  };
};

export type GroupStanding = {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type KnockoutMatch = {
  id: string;
  position: string; // e.g. 'QF1', 'SF1', 'F'
  teamAId: string | null;
  teamBId: string | null;
  teamAScore: number | null;
  teamBScore: number | null;
  winner: string | null;
  nextMatchId: string | null;
  stage: 'quarterfinal' | 'semifinal' | 'final';
};
