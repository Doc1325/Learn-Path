import './WeekCard.css';

export default function WeekCard({ week, completedLessons, currentLesson, onLessonClick, isActive, onClick }) {
  const weekProgress = week.lessons.filter(l => completedLessons.has(l.id)).length;
  const totalLessons = week.lessons.length;
  const progressPercent = (weekProgress / totalLessons) * 100;

  return (
    <div className={`week-card ${isActive ? 'week-card-active' : ''}`}>
      <div className="week-card-header" onClick={onClick}>
        <div className="week-card-info">
          <div className="week-card-icon">
            {isActive ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            )}
          </div>
          <div className="week-card-title-wrapper">
            <h3 className="week-card-title">{week.title}</h3>
            <p className="week-card-subtitle">{totalLessons} {totalLessons === 1 ? 'lección' : 'lecciones'}</p>
          </div>
        </div>
        
        <div className="week-card-progress-badge">
          {progressPercent === 100 ? (
            <div className="progress-badge-complete">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
          ) : (
            <span className="progress-badge-count">{weekProgress}/{totalLessons}</span>
          )}
        </div>
      </div>

      {isActive && (
        <div className="week-card-content">
          <div className="week-progress-bar">
            <div className="week-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="week-lessons-list">
            {week.lessons.map((lesson) => (
              <div 
                key={lesson.id}
                className={`sidebar-lesson-item ${currentLesson?.id === lesson.id ? 'sidebar-lesson-active' : ''} ${completedLessons.has(lesson.id) ? 'sidebar-lesson-completed' : ''}`}
                onClick={() => onLessonClick(lesson)}
              >
                <div className="sidebar-lesson-check">
                  {completedLessons.has(lesson.id) ? (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <div className="sidebar-lesson-check-empty"></div>
                  )}
                </div>
                
                <div className="sidebar-lesson-icon">
                  {lesson.type === 'video' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                  )}
                </div>
                
                <span className="sidebar-lesson-title">{lesson.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}