import { useApp } from "../context/AppContext";
import { useState } from "react";
import supabase from "../services/clienteSupabase";
import './Login.css';


export default function Login() {
  const { state, dispatch } = useApp();
  const { user, loginStatus, screen, currentPath } = state;
  const [isLogin, setIsLogin] = useState(true);
  const [isdemo, SetIsDemo] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }


    const { email, password } = formData;
    //logica de autenticacion
    if (isLogin) {

      await supabase.auth.signInWithPassword({ email, password })
        .then(({ data, error }) => {
          if (error) {
            setError('Error de autenticación: ' + error.message);
            setLoading(false);
            return;
          } else {
            dispatch({ type: 'SET_SCREEN', payload: 'MainMenu' });
            setLoading(false);
          }

          if (formData.email === testUser.email && formData.password === testUser.password) {
            dispatch({ type: 'SET_SCREEN', payload: 'MainMenu' });
            setLoading(false);
            return;
          } else {
            setError('Credenciales incorrectas');
            setLoading(false);
            return;
          }
        });
    } else {
      await supabase.auth.signUp({ email, password })
        .then(({ data, error }) => {
          if (error) {
            setError('Error de registro: ' + error.message);
            setLoading(false);
            return;
          } else {
            setLoading(false);
            setError('Registro exitoso, por favor inicia sesión');
          }
        });
    }
  };

  const handleDemoLogin = async () => {


      formData.email = 'demo@ejemplo.com',
      formData.password = "123456"

      const {email, password} = formData

      await supabase.auth.signInWithPassword({ email, password })
      .then(({ data, error }) => {
        if (error) {
          setError('Error de autenticación: ' + error.message);
          setLoading(false);
          return;
        } else {
          dispatch({ type: 'SET_SCREEN', payload: 'MainMenu' });
          setLoading(false);
        }



      });

  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Lado izquierdo - Branding */}
        <div className="login-brand">
          <div className="brand-content">
            <div className="brand-header">
              <div className="brand-icon-wrapper">
                <svg className="brand-icon-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h1 className="brand-title">LearnPath</h1>
              <p className="brand-tagline">Tu plataforma personalizada de rutas de aprendizaje con IA</p>
            </div>

            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Rutas personalizadas</h3>
                  <p>Contenido adaptado a tu nivel y objetivos</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="20" x2="12" y2="10" />
                    <line x1="18" y1="20" x2="18" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="16" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Seguimiento de progreso</h3>
                  <p>Monitorea tu avance en tiempo real</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Recursos curados</h3>
                  <p>Contenido de calidad seleccionado para ti</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">
                {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta'}
              </h2>
              <p className="form-subtitle">
                {isLogin ? 'Inicia sesión para continuar tu aprendizaje' : 'Únete y comienza a aprender hoy'}
              </p>
            </div>

            {error && (
              <div className="error-alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {!isLogin && (
                <div className="input-group">
                  <label className="input-label">Nombre completo</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Juan Pérez"
                      required={!isLogin}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label className="input-label">Correo electrónico</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Contraseña</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="input-group">
                  <label className="input-label">Confirmar contraseña</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      required={!isLogin}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? (
                  <>
                    <svg className="spinner-icon" width="20" height="20" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="form-divider">
              <span className="divider-line"></span>
              <span className="divider-text">o continúa con</span>
              <span className="divider-line"></span>
            </div>

            <button onClick={handleDemoLogin} className="demo-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Probar con cuenta demo
            </button>

            <div className="form-footer">
              <p>
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
                  }}
                  className="toggle-link"
                >
                  {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}