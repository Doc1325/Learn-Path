import './ProgressTracker.css';

export default function ProgressTracker({ progress, completed, total }) {
  const progressPercent = Math.round(progress);
  
  return (
    <div className="progress-tracker">
      <div className="progress-stats">
        <div className="progress-stat-item">
          <span className="progress-stat-label">Progreso</span>
          <span className="progress-stat-value">{progressPercent}%</span>
        </div>
        <div className="progress-stat-item">
          <span className="progress-stat-label">Completadas</span>
          <span className="progress-stat-value">{completed}/{total}</span>
        </div>
      </div>
      
      <div className="progress-bar-wrapper">
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          >
            <span className="progress-bar-shimmer"></span>
          </div>
        </div>
      </div>
      
      {progressPercent === 100 && (
        <div className="progress-complete-badge">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          <span>¡Curso completado!</span>
        </div>
      )}
    </div>
  );
}