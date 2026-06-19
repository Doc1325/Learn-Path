import './LessonItem.css';
import ReadingLesson from './ReadingLesson';

export default function LessonItem({ lesson, isCompleted, onToggle }) {
    const getIcon = (type) => {
        switch (type) {
            case 'video': return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            );
            case 'lectura': return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
            );
            case 'ejercicio': return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                </svg>
            );
            case 'quiz': return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
            );
            default: return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
            );
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'video': return '#e53e3e';
            case 'lectura': return '#3182ce';
            case 'ejercicio': return '#805ad5';
            case 'quiz': return '#dd6b20';
            default: return '#718096';
        }
    };

    const typeColor = getTypeColor(lesson.type);

    return (
        <div className={`lesson-item ${isCompleted ? 'lesson-item-completed' : ''}`}>
            <div className="lesson-item-row">
                <label className="lesson-checkbox-wrapper">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={(e) => onToggle(lesson.id, e.target.checked)}
                        className="lesson-checkbox"
                    />
                    <span className="checkbox-custom"></span>
                </label>

                <div 
                    className="lesson-icon" 
                    style={{ color: typeColor }}
                >
                    {getIcon(lesson.type)}
                </div>

                <div className="lesson-info">
                    <h4 className={`lesson-title ${isCompleted ? 'lesson-title-completed' : ''}`}>
                        {lesson.title}
                    </h4>
                    <span 
                        className="lesson-type-badge" 
                        style={{ 
                            background: `${typeColor}15`,
                            color: typeColor 
                        }}
                    >
                        {lesson.type}
                    </span>
                </div>
            </div>

            {/* Content expandido cuando está activo */}
            <div className="lesson-content-area">
                {lesson.type === 'video' ? (
                    <div className="lesson-video-wrapper">
                        <iframe 
                            className="lesson-video"
                            src={lesson.content.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')} 
                            title={lesson.title}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerPolicy="strict-origin-when-cross-origin" 
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <ReadingLesson
                        title={lesson.title}
                        content={lesson.content}
                    />
                )}
            </div>
        </div>
    );
}
