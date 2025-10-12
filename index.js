import React from 'react';

import ReactDOM from 'react-dom/client';
import './index.css';
import './styles.css';

function Clock() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const pad = n => n.toString().padStart(2, '0');
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${pad(now.getDate())} ${months[now.getMonth()]} ${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return <span className="menu-clock">{dateStr}</span>;
}

function MenuBar() {
  return (
    <nav className="menu-bar">
      <div className="menu-logo">
        <img src={require('./Assets/Websitelogo.png').default} alt="Logo" width={50} height={50}/>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day Dock</span>
      </div>
      <div className="menu-center">
        <Clock />
      </div>
      <div className="menu-links">
        <button className="menu-home">Home</button>
        <div className="menu-profile">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
        </div>
      </div>
    </nav>
  );
}


function Timetable() {
  const [entries, setEntries] = React.useState(
    Array.from({ length: 24 }, (_, hour) => [{ id: 0, value: '' }])
  );

  const handleChange = (hour, idx, val) => {
    setEntries(prev => {
      const updated = prev.map(arr => arr.map(e => ({ ...e })));
      updated[hour][idx].value = val;
      return updated;
    });
  };

  const handleAdd = (hour) => {
    setEntries(prev => {
      const updated = prev.map(arr => arr.map(e => ({ ...e })));
      const nextId = updated[hour].length > 0 ? Math.max(...updated[hour].map(e => e.id)) + 1 : 0;
      updated[hour].push({ id: nextId, value: '' });
      return updated;
    });
  };

  return (
    <div className="timetable-container">
      {entries.map((hourEntries, hour) => (
        <div className="timetable-hour-row" key={hour}>
          <div className="timetable-hour-label">{hour}:00</div>
          <div className="timetable-inputs">
            {hourEntries.map((entry, idx) => (
              <textarea
                className="timetable-textarea"
                key={entry.id}
                value={entry.value}
                onChange={e => handleChange(hour, idx, e.target.value)}
                placeholder="Add note..."
              />
            ))}
          </div>
          <button className="timetable-plus-btn" onClick={() => handleAdd(hour)} title="Add more">
            +
          </button>
        </div>
      ))}
    </div>
  );
}

function MainLayout() {
  // Resizable layout state (percent-based)
  const [leftPercent, setLeftPercent] = React.useState(33);
  const minPercent = 20;
  const maxPercent = 80;
  const dragging = React.useRef(false);

  React.useEffect(() => {
    const handleMouseMove = e => {
      if (!dragging.current) return;
      const grid = document.querySelector('.main-grid');
      const rect = grid.getBoundingClientRect();
      let newPercent = ((e.clientX - rect.left) / rect.width) * 100;
      if (newPercent < minPercent) newPercent = minPercent;
      if (newPercent > maxPercent) newPercent = maxPercent;
      setLeftPercent(newPercent);
    };
    const handleMouseUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // State for vertical divider between Calendar and Notepad
  const [calPercent, setCalPercent] = React.useState(50);
  const minCal = 30;
  const maxCal = 70;
  const vDragging = React.useRef(false);

  React.useEffect(() => {
    const handleVMouseMove = e => {
      if (!vDragging.current) return;
      const rightSec = document.querySelector('.right-section');
      const rect = rightSec.getBoundingClientRect();
      let newPercent = ((e.clientY - rect.top) / rect.height) * 100;
      if (newPercent < minCal) newPercent = minCal;
      if (newPercent > maxCal) newPercent = maxCal;
      setCalPercent(newPercent);
    };
    const handleVMouseUp = () => { vDragging.current = false; };
    window.addEventListener('mousemove', handleVMouseMove);
    window.addEventListener('mouseup', handleVMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleVMouseMove);
      window.removeEventListener('mouseup', handleVMouseUp);
    };
  }, []);

  return (
    <div className="app-layout">
      <MenuBar />
      <div className="main-grid" style={{ display: 'flex', height: 'calc(100vh - 70px)' }}>
        <div
          className="timeline"
          style={{
            width: `${leftPercent}%`,
            minWidth: '20%',
            maxWidth: '80%',
            transition: dragging.current ? 'none' : 'width 0.2s',
            marginRight: 4,
            height: `calc(${calPercent}% - 3px + 12px + 3px + ${100 - calPercent}% - 3px)`
          }}
        >
          <h2>Timeline</h2>
          <Timetable />
        </div>
        <div
          className="window-divider"
          style={{ width: 12, cursor: 'ew-resize', background: '#ded4d4ff', zIndex: 2, height: '100%', marginRight: 3 }}
          onMouseDown={() => { dragging.current = true; }}
        />
        <div className="right-section" style={{ width: `${100 - leftPercent}%`, minWidth: '20%', maxWidth: '80%', transition: dragging.current ? 'none' : 'width 0.2s', display: 'flex', flexDirection: 'column'}}>
          <div className="calendar" style={{ height: `calc(${calPercent}% - 3px)`, minHeight: '30%', maxHeight: '70%', marginBottom: 3, transition: vDragging.current ? 'none' : 'height 0.2s' }}>
            <h2>Calendar</h2>
            <p>Your calendar content goes here.</p>
          </div>
          <div
            className="window-divider window-divider-vertical"
            style={{ height: 12, width: '100%', background: '#ded4d4ff', cursor: 'ns-resize', marginBottom: 3, borderRadius: 10 }}
            onMouseDown={() => { vDragging.current = true; }}
          />
          <div className="notepad" style={{ height: `calc(${100 - calPercent}% - 3px)`, minHeight: '30%', maxHeight: '70%', transition: vDragging.current ? 'none' : 'height 0.2s' }}>
            <h2>Notepad</h2>
            <p>Your notepad content goes here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainLayout />
  </React.StrictMode>
);
