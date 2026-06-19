import { useEffect, useState } from "react";
import supabase from "../services/clienteSupabase";
import "./MainMenu.css";
import { useApp } from '../context/AppContext';
import  {normalizePath } from  '../services/Normalizer'
export default function MainMenu() {

  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { state, dispatch } = useApp();
  const { user, loginStatus, screen, currentPath } = state;

  const GoToPath = (index) => {
    const selectedPath = paths.find( e => e.id == index )
    console.log("Ruta seleccionada:", selectedPath);
    dispatch({ type: 'SET_PATH', payload: selectedPath });
    dispatch({ type: 'SET_SCREEN', payload: 'app' });
  };

  const handleNewPath = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'generator' });
  };

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Logout failed:', error);
   dispatch({ type: 'SET_SCREEN', payload: 'login' });

  };

  const getPaths = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("Ruta")
      .select(`
        *,
        secciones:Seccion (
          *,
          lecciones:Leccion (*)
        )
      `)
      .order("orden", { foreignTable: "secciones" })
      .order("orden", { foreignTable: "secciones.lecciones" });

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      const normalizedPaths = data.map(p => normalizePath(p, "db"));
      setPaths(normalizedPaths);
    }

    setLoading(false);
  };

  useEffect(() => {
    getPaths();
  }, []);

  const calcularProgreso = (ruta) => {
    let total = 0;
    let completadas = 0;

    ruta.weeks?.forEach((s) => {
      s.lessons?.forEach((l) => {
        console.log(l.completado)
        total++;
        if (l.completado) completadas++;
      });
    });

    if (total === 0) return 0;
    return Math.round((completadas / total) * 100);
  };

  // Filtrar rutas
  const filteredPaths = paths.filter(path => {
    const matchesSearch = path.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'completed' && path.completado) ||
      (filterStatus === 'in-progress' && !path.completado);
    return matchesSearch && matchesFilter;
  });


  
  return (
    <div className="dashboard-layout">
      {/* Top Navigation Bar */}
      <header className="dashboard-topbar">
        <div className="topbar-content">
          <div className="topbar-left">
            <div className="logo-section">
              {/* <img className="logo-icon" src="/icono.png"/> */}
              <span className="logo-icon">🎓</span>
              <h1 className="logo-title">LearnPath</h1>
            </div>
          </div>
          
          <div className="topbar-right">
            <div className="user-profile">
              <img 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4299e1&color=fff`}
                alt={user?.name}
                className="user-avatar"
              />
              <span className="user-name">{user?.name || 'Usuario'}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-text">
              <h1 className="header-title">Mis rutas de aprendizaje</h1>
              <p className="header-subtitle">Continúa aprendiendo donde lo dejaste</p>
            </div>
            
            <button className="create-route-btn" onClick={handleNewPath}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nueva Ruta
            </button>
          </div>

          {/* Filters Section */}
          <div className="dashboard-filters">
            <div className="filter-search">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar rutas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filterStatus === 'all' ? 'filter-tab-active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Todas
              </button>
              <button 
                className={`filter-tab ${filterStatus === 'in-progress' ? 'filter-tab-active' : ''}`}
                onClick={() => setFilterStatus('in-progress')}
              >
                En progreso
              </button>
              <button 
                className={`filter-tab ${filterStatus === 'completed' ? 'filter-tab-active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Completadas
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">Cargando rutas...</p>
            </div>
          ) : filteredPaths.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <svg className="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <h3 className="empty-title">
                  {searchTerm || filterStatus !== 'all' ? 'No se encontraron rutas' : 'No tienes rutas todavía'}
                </h3>
                <p className="empty-description">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Intenta con otros filtros de búsqueda' 
                    : 'Crea tu primera ruta de aprendizaje personalizada'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <button className="empty-cta-button" onClick={handleNewPath}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Crear mi primera ruta
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="routes-grid">
              {filteredPaths.map((ruta) => {
                const totalSecciones = ruta.weeks?.length || 0;
                const totalLecciones = ruta.weeks?.reduce(
                  (acc, s) => acc + (s.lessons?.length || 0),
                  0
                ) || 0;
                const progreso = calcularProgreso(ruta);

                return (
                  <div key={ruta.id} className="route-card" onClick={() => GoToPath(ruta.id)}>
                    {/* Progress Bar Top */}

                    {console.log(ruta.id)}
                    <div className="route-card-progress-top">
                      <div 
                        className="route-card-progress-fill"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>

                    {/* Card Content */}
                    <div className="route-card-content">
                      {/* Header */}
                      <div className="route-card-header">
                        <h3 className="route-card-title">{ruta.name}</h3>
                        <span className={`route-status-badge ${ruta.completado ? 'status-completed' : 'status-progress'}`}>
                          {ruta.completado ? (
                            <>
                              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Completada
                            </>
                          ) : (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                              </svg>
                              En progreso
                            </>
                          )}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="route-stats">
                        <div className="route-stat-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                          </svg>
                          <span>{totalSecciones} {totalSecciones === 1 ? 'sección' : 'secciones'}</span>
                        </div>
                        <div className="route-stat-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                          </svg>
                          <span>{totalLecciones} {totalLecciones === 1 ? 'lección' : 'lecciones'}</span>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="route-progress-section">
                        <div className="route-progress-info">
                          <span className="progress-label">Progreso</span>
                          <span className="progress-value">{progreso}%</span>
                        </div>
                        <div className="route-progress-bar">
                          <div 
                            className="route-progress-bar-fill"
                            style={{ width: `${progreso}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="route-continue-btn">
                        <span>Continuar ruta</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}