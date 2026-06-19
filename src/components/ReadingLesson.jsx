import './ReadingLesson.css';

export default function ReadingLesson({ content, title }) {
    return (
        <div className="reading-lesson-wrapper">
            <article className="reading-lesson-article">
                {title && (
                    <header className="reading-lesson-header">
                        <h2 className="reading-lesson-heading">{title}</h2>
                    </header>
                )}
                
                <div className="reading-lesson-body">
                    <pre className="reading-lesson-text">
{content}
                    </pre>
                </div>
            </article>
        </div>
    );
}