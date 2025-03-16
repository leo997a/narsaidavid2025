
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team, Player, Match, GroupStanding, KnockoutMatch } from '../types';

// البيانات الأولية للبطولة استنادًا إلى الصور المرفقة
const initialTeams: Team[] = [
  // المجموعة A
  { id: 'khoyada-a', name: 'KHOYADA A', logo: '/teams/khoyada-a.png', group: 'A' },
  { id: 'barwar-b', name: 'BARWAR B', logo: '/teams/barwar-b.png', group: 'A' },
  { id: 'hakkare', name: 'HAKKARE', logo: '/teams/hakkare.png', group: 'A' },
  
  // المجموعة B
  { id: 'barwar-a', name: 'BARWAR A', logo: '/teams/barwar-a.png', group: 'B' },
  { id: 'nergal', name: 'NERGAL', logo: '/teams/nergal.png', group: 'B' },
  { id: 'mangesh', name: 'MANGESH', logo: '/teams/mangesh.png', group: 'B' },
  
  // المجموعة C
  { id: 'rafiden', name: 'RAFIDEN', logo: '/teams/rafiden.png', group: 'C' },
  { id: 'gaznakh', name: 'GAZNAKH', logo: '/teams/gaznakh.png', group: 'C' },
  { id: 'batnaye', name: 'BATNAYE', logo: '/teams/batnaye.png', group: 'C' },
  
  // المجموعة D
  { id: 'nala', name: 'NALA', logo: '/teams/nala.png', group: 'D' },
  { id: 'karanjo', name: 'KARANJO', logo: '/teams/karanjo.png', group: 'D' },
  { id: 'khoyada-b', name: 'KHOYADA B', logo: '/teams/khoyada-b.png', group: 'D' },
];

// البيانات الأولية للمباريات استنادًا إلى الصور المرفقة
const initialMatches: Match[] = [
  // اليوم الأول
  { 
    id: 'day1-match1', 
    homeTeamId: 'khoyada-a', 
    awayTeamId: 'barwar-b', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-14', 
    time: '14:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'A',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day1-match2', 
    homeTeamId: 'rafiden', 
    awayTeamId: 'gaznakh', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-14', 
    time: '15:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'C',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day1-match3', 
    homeTeamId: 'nala', 
    awayTeamId: 'khoyada-b', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-14', 
    time: '16:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'D',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  
  // اليوم الثاني
  { 
    id: 'day2-match1', 
    homeTeamId: 'barwar-a', 
    awayTeamId: 'mangesh', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-16', 
    time: '15:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'B',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day2-match2', 
    homeTeamId: 'batnaye', 
    awayTeamId: 'gaznakh', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-16', 
    time: '16:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'C',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day2-match3', 
    homeTeamId: 'karanjo', 
    awayTeamId: 'khoyada-b', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-16', 
    time: '17:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'D',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  
  // اليوم الثالث
  { 
    id: 'day3-match1', 
    homeTeamId: 'hakkare', 
    awayTeamId: 'barwar-b', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-18', 
    time: '15:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'A',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day3-match2', 
    homeTeamId: 'nergal', 
    awayTeamId: 'mangesh', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-18', 
    time: '16:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'B',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day3-match3', 
    homeTeamId: 'rafiden', 
    awayTeamId: 'batnaye', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-18', 
    time: '17:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'C',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  
  // اليوم الرابع
  { 
    id: 'day4-match1', 
    homeTeamId: 'khoyada-a', 
    awayTeamId: 'hakkare', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-20', 
    time: '15:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'A',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day4-match2', 
    homeTeamId: 'barwar-a', 
    awayTeamId: 'nergal', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-20', 
    time: '16:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'B',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day4-match3', 
    homeTeamId: 'nala', 
    awayTeamId: 'karanjo', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-20', 
    time: '17:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'D',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
];

// بيانات اللاعبين - سنضيف تمثيل أولي
const initialPlayers: Player[] = [
  // أمثلة للاعبين من كل فريق
  { id: 'player1', name: 'لاعب 1', teamId: 'khoyada-a', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'player2', name: 'لاعب 2', teamId: 'khoyada-a', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'player3', name: 'لاعب 3', teamId: 'barwar-b', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'player4', name: 'لاعب 4', teamId: 'barwar-b', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  // يمكن إضافة المزيد من اللاعبين لاحقًا
];

// بيانات الأدوار الإقصائية - تكون فارغة في البداية وتملأ عند انتهاء دور المجموعات
const initialKnockoutMatches: KnockoutMatch[] = [
  // ربع النهائي
  { id: 'qf1', position: 'QF1', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'sf1', stage: 'quarterfinal' },
  { id: 'qf2', position: 'QF2', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'sf1', stage: 'quarterfinal' },
  { id: 'qf3', position: 'QF3', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'sf2', stage: 'quarterfinal' },
  { id: 'qf4', position: 'QF4', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'sf2', stage: 'quarterfinal' },
  
  // نصف النهائي
  { id: 'sf1', position: 'SF1', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'final', stage: 'semifinal' },
  { id: 'sf2', position: 'SF2', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'final', stage: 'semifinal' },
  
  // النهائي
  { id: 'final', position: 'F', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: null, stage: 'final' },
];

type TournamentStore = {
  teams: Team[];
  players: Player[];
  matches: Match[];
  knockoutMatches: KnockoutMatch[];
  standings: Record<string, GroupStanding[]>;
  
  // وظائف إدارة البيانات
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  updateMatch: (match: Match) => void;
  updateKnockoutMatch: (match: KnockoutMatch) => void;
  calculateStandings: () => void;
  setQualifiedTeams: () => void;
  
  // وظائف مساعدة
  getTeamById: (id: string) => Team | undefined;
  getPlayersByTeam: (teamId: string) => Player[];
  getTopScorers: (limit?: number) => Player[];
};

export const useTournamentStore = create<TournamentStore>()(
  persist(
    (set, get) => ({
      teams: initialTeams,
      players: initialPlayers,
      matches: initialMatches,
      knockoutMatches: initialKnockoutMatches,
      standings: {
        A: [] as GroupStanding[],
        B: [] as GroupStanding[],
        C: [] as GroupStanding[],
        D: [] as GroupStanding[],
      },
      
      addPlayer: (player) => {
        set((state) => ({
          players: [...state.players, player]
        }));
      },
      
      updatePlayer: (updatedPlayer) => {
        set((state) => ({
          players: state.players.map(player => 
            player.id === updatedPlayer.id ? updatedPlayer : player
          )
        }));
      },
      
      updateMatch: (updatedMatch) => {
        set((state) => ({
          matches: state.matches.map(match => 
            match.id === updatedMatch.id ? updatedMatch : match
          )
        }));
        // حساب ترتيب المجموعات تلقائيًا عند تحديث مباراة
        get().calculateStandings();
      },
      
      updateKnockoutMatch: (updatedMatch) => {
        set((state) => ({
          knockoutMatches: state.knockoutMatches.map(match => 
            match.id === updatedMatch.id ? updatedMatch : match
          )
        }));
        
        // تحديث المباراة التالية إذا تم تحديد الفائز
        if (updatedMatch.winner && updatedMatch.nextMatchId) {
          const nextMatch = get().knockoutMatches.find(m => m.id === updatedMatch.nextMatchId);
          if (nextMatch) {
            // تحديد الفريق A أو B في المباراة التالية بناءً على موقع المباراة الحالية
            const updatedNextMatch = { ...nextMatch };
            
            if (updatedMatch.position.includes('QF1') || updatedMatch.position.includes('QF2')) {
              updatedNextMatch.teamAId = updatedMatch.winner;
            } else if (updatedMatch.position.includes('QF3') || updatedMatch.position.includes('QF4')) {
              updatedNextMatch.teamBId = updatedMatch.winner;
            } else if (updatedMatch.position.includes('SF1')) {
              updatedNextMatch.teamAId = updatedMatch.winner;
            } else if (updatedMatch.position.includes('SF2')) {
              updatedNextMatch.teamBId = updatedMatch.winner;
            }
            
            set((state) => ({
              knockoutMatches: state.knockoutMatches.map(match => 
                match.id === updatedNextMatch.id ? updatedNextMatch : match
              )
            }));
          }
        }
      },
      
      calculateStandings: () => {
        const { teams, matches } = get();
        const completedMatches = matches.filter(m => m.status === 'completed' && m.stage === 'group');
        
        // تهيئة الترتيب
        const newStandings: Record<string, GroupStanding[]> = {
          A: [],
          B: [],
          C: [],
          D: [],
        };
        
        // إنشاء ترتيب أولي للفرق
        teams.forEach(team => {
          const groupStanding: GroupStanding = {
            teamId: team.id,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0,
          };
          
          if (team.group) {
            newStandings[team.group].push(groupStanding);
          }
        });
        
        // حساب النقاط والإحصائيات
        completedMatches.forEach(match => {
          if (match.homeScore !== null && match.awayScore !== null && match.group) {
            // تحديث إحصائيات الفريق المضيف
            const homeStanding = newStandings[match.group].find(s => s.teamId === match.homeTeamId);
            if (homeStanding) {
              homeStanding.played += 1;
              homeStanding.goalsFor += match.homeScore;
              homeStanding.goalsAgainst += match.awayScore;
              
              if (match.homeScore > match.awayScore) {
                homeStanding.won += 1;
                homeStanding.points += 3;
              } else if (match.homeScore === match.awayScore) {
                homeStanding.drawn += 1;
                homeStanding.points += 1;
              } else {
                homeStanding.lost += 1;
              }
            }
            
            // تحديث إحصائيات الفريق الضيف
            const awayStanding = newStandings[match.group].find(s => s.teamId === match.awayTeamId);
            if (awayStanding) {
              awayStanding.played += 1;
              awayStanding.goalsFor += match.awayScore;
              awayStanding.goalsAgainst += match.homeScore;
              
              if (match.awayScore > match.homeScore) {
                awayStanding.won += 1;
                awayStanding.points += 3;
              } else if (match.awayScore === match.homeScore) {
                awayStanding.drawn += 1;
                awayStanding.points += 1;
              } else {
                awayStanding.lost += 1;
              }
            }
          }
        });
        
        // ترتيب الفرق حسب النقاط ثم فارق الأهداف ثم الأهداف المسجلة
        Object.keys(newStandings).forEach(group => {
          newStandings[group].sort((a, b) => {
            if (b.points !== a.points) {
              return b.points - a.points;
            }
            const aDiff = a.goalsFor - a.goalsAgainst;
            const bDiff = b.goalsFor - b.goalsAgainst;
            if (bDiff !== aDiff) {
              return bDiff - aDiff;
            }
            return b.goalsFor - a.goalsFor;
          });
        });
        
        set({ standings: newStandings });
      },
      
      setQualifiedTeams: () => {
        const { standings, knockoutMatches } = get();
        
        // تعيين الفرق المتأهلة إلى ربع النهائي
        // الأول من كل مجموعة والثاني من كل مجموعة
        const qfMatches = [...knockoutMatches];
        
        if (
          standings.A.length >= 1 && 
          standings.B.length >= 1 && 
          standings.C.length >= 1 && 
          standings.D.length >= 1
        ) {
          // ربع النهائي 1: أول المجموعة A ضد ثاني المجموعة B
          const qf1 = qfMatches.find(m => m.id === 'qf1');
          if (qf1) {
            qf1.teamAId = standings.A[0]?.teamId || null;
            qf1.teamBId = standings.B[1]?.teamId || null;
          }
          
          // ربع النهائي 2: أول المجموعة B ضد ثاني المجموعة A
          const qf2 = qfMatches.find(m => m.id === 'qf2');
          if (qf2) {
            qf2.teamAId = standings.B[0]?.teamId || null;
            qf2.teamBId = standings.A[1]?.teamId || null;
          }
          
          // ربع النهائي 3: أول المجموعة C ضد ثاني المجموعة D
          const qf3 = qfMatches.find(m => m.id === 'qf3');
          if (qf3) {
            qf3.teamAId = standings.C[0]?.teamId || null;
            qf3.teamBId = standings.D[1]?.teamId || null;
          }
          
          // ربع النهائي 4: أول المجموعة D ضد ثاني المجموعة C
          const qf4 = qfMatches.find(m => m.id === 'qf4');
          if (qf4) {
            qf4.teamAId = standings.D[0]?.teamId || null;
            qf4.teamBId = standings.C[1]?.teamId || null;
          }
          
          set({ knockoutMatches: qfMatches });
        }
      },
      
      getTeamById: (id) => {
        return get().teams.find(team => team.id === id);
      },
      
      getPlayersByTeam: (teamId) => {
        return get().players.filter(player => player.teamId === teamId);
      },
      
      getTopScorers: (limit = 10) => {
        return [...get().players]
          .sort((a, b) => b.goals - a.goals)
          .slice(0, limit);
      },
    }),
    {
      name: 'tournament-storage',
    }
  )
);
