import { useApp } from "../context/AppContext";
import { useState, useEffect } from "react";
import supabase from "../services/clienteSupabase";
import "./LearningPath.css";
import ProgressTracker from "../components/ProgressTracker";
import WeekCard from "../components/WeekCard";

export default function LearningPathApp() {

  const { state, dispatch } = useApp();
  const { user, loginStatus, screen, currentPath } = state;

  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Convertir estructura BD -> estructura esperada por UI
  const weeks = currentPath.weeks

const deleteRoute = (routeId) => {
  if (window.confirm("¿Estás seguro de que deseas eliminar esta ruta? Esta acción no se puede deshacer.")) {
    supabase
      .from("Ruta")
      .delete()
      .eq("id", routeId)
      .then(({ error }) => {
        if (error) {
          console.error("Error deleting route:", error);
        } else {
          console.log("Ruta eliminada");
          dispatch({ type: "SET_SCREEN", payload: "MainMenu" });
        }
      });
  }
};


  useEffect(() => {
  
    if (currentPath) {
      const storedLessons = currentPath.weeks
        ?.sort((a, b) => a.orden - b.orden)

        .flatMap(week =>
          week.lessons
            .filter(l => l.completado)
            .map(l => l.id)
        );
      setCompletedLessons(new Set(storedLessons));
      const totalLessons = weeks.reduce((sum, week) => {
        return sum + week.lessons.length;
      }, 0);

      // Set first lesson as current
      if (weeks.length > 0 && weeks[0].lessons.length > 0) {
        setCurrentLesson(weeks[0].lessons[0]);
      }
    }
  }, [currentPath]);

  const toggleLesson = (lessonId, isCompleted) => {

    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }

      if (currentPath) {
        supabase
          .from("Leccion")
          .update({ completado: isCompleted })
          .eq("id", lessonId)
          .then(({ error }) => {
            if (error) {
              console.error("Error updating lesson:", error);
            }
          });
      }

      if (newSet.size === totalLessons && !currentPath.completado) {

        const routeId = currentPath.id;
        console.log('xd')
        supabase
          .from("Ruta")
          .update({ completado: true })
          .eq("id", routeId)
          .then(({ error }) => {
            if (error) {
              console.error("Error updating path:", error);
            } else {
              console.log("Ruta marcada como completada");
            }
          });

      }

      return newSet;
    });
  };

  const handleBackButton = () => {
    dispatch({ type: "SET_SCREEN", payload: "MainMenu" });
    setCompletedLessons(new Set());
  };

  const totalLessons = weeks.reduce((sum, week) => {
    return sum + week.lessons.length;
  }, 0);

  const progress = totalLessons
    ? (completedLessons.size / totalLessons) * 100
    : 0;



  return (
    <div className="learning-path-layout">
      {/* Top Navigation Bar */}
      <header className="learning-path-topbar">
        <div className="topbar-left">
          <button onClick={handleBackButton} className="topbar-back-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
            </svg>
          </button>
          <h1 className="topbar-title">{currentPath?.nombre}</h1>
        </div>

        <div className="topbar-right">
          <button
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="learning-path-main">
        {/* Sidebar - Index of weeks and lessons */}
        <aside className={`learning-path-sidebar ${showSidebar ? 'sidebar-visible' : 'sidebar-hidden'}`}>
          <div className="sidebar-header">
            <div className="sidebar-header-content">
              <h2 className="sidebar-title">Contenido del curso</h2>
              <span className="route-delete-badge" onClick={() => deleteRoute(currentPath.id)}>

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </span>
            </div>
            <ProgressTracker
              progress={progress}
              completed={completedLessons.size}
              total={totalLessons}
            />
          </div>

          <div className="sidebar-content">
            {weeks.map((week) => (
              <WeekCard
                key={week.week}
                week={week}
                completedLessons={completedLessons}
                currentLesson={currentLesson}
                onLessonClick={(lesson) => setCurrentLesson(lesson)}
                isActive={currentWeek === week.week}
                onClick={() => setCurrentWeek(week.week)}
              />
            ))}
          </div>
        </aside>

        {/* Content Area - Shows the actual lesson content */}
        <main className={`learning-path-content ${showSidebar ? 'content-with-sidebar' : 'content-full'}`}>
          {currentLesson ? (
            <div className="content-wrapper">
              <div className="lesson-content-header">
                <div className="lesson-content-title-wrapper">
                  <h1 className="lesson-content-title">{currentLesson.title}</h1>
                  <span
                    className="lesson-content-type-badge"
                    style={{
                      background: currentLesson.type === 'video' ? '#ffe0e0' : '#e3f2fd',
                      color: currentLesson.type === 'video' ? '#d32f2f' : '#1976d2'
                    }}
                  >
                    {currentLesson.type}
                  </span>
                </div>
                <label className="lesson-complete-checkbox-main">
                  <input
                    type="checkbox"
                    checked={completedLessons.has(currentLesson.id)}
                    onChange={(e) => toggleLesson(currentLesson.id, e.target.checked)}
                  />
                  <span className="checkbox-custom-main"></span>
                  <span className="checkbox-label">Marcar como completada</span>
                </label>
              </div>

              <div className="lesson-content-body">
                {currentLesson.type === 'video' ? (
                  <div className="lesson-video-container">
                    <iframe
                      className="lesson-video-iframe"
                      src={currentLesson.content.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')}
                      title={currentLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="lesson-reading-container">
                    <pre className="lesson-reading-content">
                      {currentLesson.content}
                    </pre>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="lesson-navigation">
                <button
                  className="lesson-nav-button lesson-nav-prev"
                  onClick={() => {
                    const allLessons = weeks.flatMap(w => w.lessons);
                    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
                    if (currentIndex > 0) {
                      setCurrentLesson(allLessons[currentIndex - 1]);
                    }
                  }}
                  disabled={(() => {
                    const allLessons = weeks.flatMap(w => w.lessons);
                    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
                    return currentIndex === 0;
                  })()}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Anterior
                </button>

                <button
                  className="lesson-nav-button lesson-nav-next"
                  onClick={() => {
                    const allLessons = weeks.flatMap(w => w.lessons);
                    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
                    if (currentIndex < allLessons.length - 1) {
                      setCurrentLesson(allLessons[currentIndex + 1]);
                    }
                  }}
                  disabled={(() => {
                    const allLessons = weeks.flatMap(w => w.lessons);
                    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
                    return currentIndex === allLessons.length - 1;
                  })()}
                >
                  Siguiente
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-content">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3>Selecciona una lección</h3>
                <p>Elige una lección del menú lateral para comenzar</p>
              </div>
            </div>
          )}

          {progress === 100 && (
            <div className="completion-banner">
              <div className="completion-content">
                <span className="completion-icon">🎉</span>
                <div>
                  <h2>¡Felicitaciones!</h2>
                  <p>Has completado toda la ruta de aprendizaje</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}