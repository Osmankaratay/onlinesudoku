.app-shell {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1f2a44 0%, #111827 38%, #040816 100%);
  color: #edf2ff;
  font-family: Inter, 'Segoe UI', sans-serif;
}

button,
select,
input {
  font: inherit;
}

* {
  box-sizing: border-box;
}

.container {
  width: min(1100px, calc(100% - 24px));
  margin: 0 auto;
  padding: 32px 0 48px;
}

.panel {
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.4);
}

.app-header {
  text-align: center;
  margin-bottom: 28px;
}

.app-header h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.app-header p {
  margin-top: 12px;
  color: #bfdbfe;
  font-size: 1rem;
}

.screen {
  padding: 32px;
}

.landing-box {
  display: grid;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.card {
  background: rgba(15, 118, 110, 0.12);
  border: 1px solid rgba(94, 234, 212, 0.2);
  border-radius: 20px;
  padding: 22px;
}

.card h3 {
  margin: 0 0 12px;
  font-size: 1.1rem;
}

.form-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
}

input,
select {
  background: rgba(15, 23, 42, 0.9);
  color: white;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  padding: 12px 14px;
}

input {
  flex: 1;
  min-width: 180px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #14b8a6, #3b82f6);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  background: rgba(59, 130, 246, 0.16);
  border: 1px solid rgba(147, 197, 253, 0.4);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 700;
}

.status-ready {
  background: rgba(34, 197, 94, 0.15);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.35);
}

.status-not-ready {
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.room-header h2,
.game-header h2,
.leaderboard-header h2 {
  margin: 0;
}

.room-code {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 118, 110, 0.12);
  border: 1px solid rgba(45, 212, 191, 0.3);
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.player-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.player-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 14px 16px;
}

.player-name-wrap {
  display: flex;
  flex-direction: column;
}

.player-name-wrap strong {
  font-size: 1rem;
}

.host-tag {
  margin-top: 4px;
  font-size: 0.7rem;
  color: #93c5fd;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lobby-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.game-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.5fr);
  gap: 24px;
}

.board-panel,
.sidebar-panel {
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.68);
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.timer {
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  font-weight: 800;
  color: #67e8f9;
}

.sudoku-grid {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 1px;
  padding: 6px;
  border-radius: 18px;
  background: rgba(148, 163, 184, 0.28);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: clamp(30px, 6vw, 58px);
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.9);
  font-weight: 700;
  font-size: clamp(1rem, 2vw, 1.45rem);
  user-select: none;
  cursor: pointer;
}

.cell.fixed {
  background: rgba(30, 41, 59, 0.95);
  color: #f8fafc;
}

.cell.selected {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(96, 165, 250, 0.8);
}

.cell.correct {
  background: rgba(34, 197, 94, 0.22);
}

.cell.incorrect {
  background: rgba(239, 68, 68, 0.2);
}

.numpad {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.numpad button {
  min-height: 46px;
}

.sidebar-panel {
  display: grid;
  gap: 16px;
  align-content: start;
}

.meta-block h3,
.meta-block h4 {
  margin: 0 0 10px;
}

.meta-list {
  display: grid;
  gap: 8px;
  color: #dbeafe;
}

.leaderboard-list {
  display: grid;
  gap: 10px;
}

.leaderboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.84);
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  background: rgba(59, 130, 246, 0.15);
  color: #bfdbfe;
}

.empty-state {
  color: #cbd5e1;
  font-size: 0.95rem;
}

.notice {
  border-radius: 12px;
  padding: 12px 14px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.2);
  color: #dbeafe;
}

@media (max-width: 840px) {
  .game-shell {
    grid-template-columns: 1fr;
  }
}
