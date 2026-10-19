import React, { useState, useEffect } from 'react';
import { TeamId } from './types';

const MAX_ATTENDEES = 50;

const TEAM_NAMES: Record<TeamId, string> = {
  water: 'Team Water Wise',
  zero: 'Team Net Zero',
  power: 'Team Renewables',
};

interface TeamCounts {
  water: number;
  zero: number;
  power: number;
}

export const App: React.FC = () => {
  const [attendeeName, setAttendeeName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamId | ''>('');
  
  const [teamCounts, setTeamCounts] = useState<TeamCounts>(() => {
    const saved = localStorage.getItem('intel_team_counts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { water: 0, zero: 0, power: 0 };
  });

  const [greeting, setGreeting] = useState<string>(() => {
    return localStorage.getItem('intel_greeting') || '';
  });

  const totalAttendees = teamCounts.water + teamCounts.zero + teamCounts.power;
  const progressPercentage = Math.min(100, (totalAttendees / MAX_ATTENDEES) * 100);

  useEffect(() => {
    localStorage.setItem('intel_team_counts', JSON.stringify(teamCounts));
  }, [teamCounts]);

  useEffect(() => {
    if (greeting) {
      localStorage.setItem('intel_greeting', greeting);
    }
  }, [greeting]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = attendeeName.trim();
    if (!trimmedName || !selectedTeam) {
      return;
    }

    const teamKey = selectedTeam as TeamId;
    const teamLabel = TEAM_NAMES[teamKey];

    // Increment team count
    setTeamCounts((prev) => ({
      ...prev,
      [teamKey]: prev[teamKey] + 1,
    }));

    // Set personalized greeting message
    setGreeting(`Welcome to the summit, ${trimmedName}! You're checked in with ${teamLabel}.`);

    // Reset the form
    setAttendeeName('');
    setSelectedTeam('');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset attendance counts?')) {
      setTeamCounts({ water: 0, zero: 0, power: 0 });
      setGreeting('');
      localStorage.removeItem('intel_team_counts');
      localStorage.removeItem('intel_greeting');
    }
  };

  return (
    <>
      {/* Hero section with Intel branding */}
      <div className="hero">
        <div className="hero-content">
          <img src="/img/intel-logo.svg" alt="Intel Logo" className="intel-logo" />
          <h1>Team Sustainability Summit</h1>
          <div className="hero-divider"></div>
          <p>
            <i className="fas fa-leaf"></i> Check-in system for sustainability event
            attendees
          </p>
        </div>
      </div>

      {/* Attendance tracking */}
      <div className="attendance-tracker">
        <div className="attendance-header">
          <i className="fas fa-users"></i>
          Attendance: <span id="attendeeCount">{totalAttendees}</span>/{MAX_ATTENDEES}
        </div>
        <div className="progress-container">
          <div
            id="progressBar"
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="container">
        {/* Feedback message */}
        <p
          id="greeting"
          className={`success-message ${greeting ? 'visible' : ''}`}
          style={{ display: greeting ? 'block' : 'none' }}
        >
          {greeting}
        </p>

        {/* Check-in form */}
        <form className="check-in" id="checkInForm" onSubmit={handleSubmit}>
          <label htmlFor="attendeeName" className="form-label">
            Attendee Check-In
          </label>
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="text"
                id="attendeeName"
                name="attendeeName"
                placeholder="Enter name..."
                required
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
              />
              <select
                id="teamSelect"
                name="team"
                required
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value as TeamId)}
              >
                <option value="" disabled>
                  Select Team...
                </option>
                <option value="water">Team Water Wise</option>
                <option value="zero">Team Net Zero</option>
                <option value="power">Team Renewables</option>
              </select>
            </div>
            <button type="submit" id="checkInBtn">
              <i className="fas fa-user-check"></i> Check In
            </button>
          </div>
        </form>

        {/* Team stats */}
        <div className="team-stats">
          <h3>Team Attendance</h3>
          <div className="teams-grid">
            <div className="team-card water">
              <span className="team-name">🌊 Team Water Wise</span>
              <span className="team-count" id="waterCount">
                {teamCounts.water}
              </span>
            </div>
            <div className="team-card zero">
              <span className="team-name">🌿 Team Net Zero</span>
              <span className="team-count" id="zeroCount">
                {teamCounts.zero}
              </span>
            </div>
            <div className="team-card power">
              <span className="team-name">⚡ Team Renewables</span>
              <span className="team-count" id="powerCount">
                {teamCounts.power}
              </span>
            </div>
          </div>
        </div>

        {totalAttendees > 0 && (
          <div className="action-links">
            <button
              type="button"
              className="btn-secondary-link"
              onClick={handleReset}
              title="Reset all check-in counts"
            >
              Reset Attendance Counts
            </button>
          </div>
        )}
      </div>

      <footer className="footer">
        &copy; 2025 Intel &bull;{' '}
        <a
          href="https://www.intel.com/content/www/us/en/corporate-responsibility/2030-goals.html"
          className="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sustainability Goals
        </a>
      </footer>
    </>
  );
};

export default App;
