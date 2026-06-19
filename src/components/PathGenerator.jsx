import { fetchGPTResponse } from '../services/ClienteModeloIA';
import { useState } from 'react';

import { normalizePath } from '../services/Normalizer'

import './PathGenerator.css';

import { useApp } from '../context/AppContext';

export default function PathGenerator() {

  const { state, dispatch } = useApp();
  const  {user, loginStatus, screen, currentPath} = state;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    focus: '',
    level: 'beginner',
    duration: 2,
    hoursPerWeek: 5
  });


  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newRoute = await fetchGPTResponse(formData)
 
    
     
    dispatch({ type: 'SET_PATH', payload: normalizePath(newRoute, 'api') });
    console.log(currentPath)
    setLoading(false);
    dispatch({ type: 'SET_SCREEN', payload: 'app' });

  };

  const handleLogout  = () => {

  } 

  const handleBack = () => {
       dispatch({ type: 'SET_SCREEN', payload: 'MainMenu' });

    

  }

  return (
    <div className='generator-container'>
      <header className="dashboard-topbar">
        <div className="topbar-content">
          <div className="topbar-left">
            <div className="logo-section">
              <span className="logo-icon">🎓</span>
              <button className="logo-title" onClick = {handleBack} > LearnPath</button>
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

          </div>
        </div>
      </header>
    <div className='path-generator-container'>
      
      <div className='path-generator-header'>
        <span style={{ fontSize: '4rem' }}>🎯</span>
        <h2 className='path-generator-title'>Generar Ruta de Aprendizaje</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Personaliza tu plan de estudios con IA
        </p>
      </div>

      <form className='path-generator-form' onSubmit={handleSubmit}>
        <div className='path-generator-form-topic' >
          <label className='path-generator-form-topic-title'>
            ¿Qué quieres aprender? *
          </label>
          <input
            type="text"
            className='path-generator-form-topic-textfield'
            value={formData.focus}
            onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
            placeholder="Ej: Desarrollo Web Frontend, Python, React..."
            required

          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className='path-generator-form-level-title'>
            Nivel de experiencia
          </label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className='path-generator-form-level-select'
          >
            <option value="beginner">🌱 Principiante - Empezando desde cero</option>
            <option value="intermediate">🚀 Intermedio - Tengo conocimientos básicos</option>
            <option value="advanced">⚡ Avanzado - Quiero profundizar</option>
          </select>
        </div>

        <div className='path-generator-form-duration'>

          <div>
            <label className='path-generator-form-duration-title'>
              Duración (semanas)
            </label>
            <input
              className='path-generator-form-duration-input'
              type="number"
              min="1"
              max="52"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}

            />
          </div>

          <div>
            <label className='path-generator-form-duration-title'>
              Horas por semana
            </label>
            <input
              className='path-generator-form-duration-input'

              type="number"
              min="1"
              max="40"
              value={formData.hoursPerWeek}
              onChange={(e) => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) })}

            />
          </div>
        </div>

        <div className='path-generator-form-total-duration'>
          <p className='path-generator-form-total-duration-text'>
            🕕 <strong>Tiempo estimado total:</strong> {formData.duration * formData.hoursPerWeek} horas
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`path-generator-form-submit-button ${loading ? 'is-loading' : ''}`}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
            }
          }}
        >
          {loading ? (
            <span>⏳ Generando tu ruta personalizada...</span>
          ) : (
            <span>✨ Generar Ruta de Aprendizaje</span>
          )}
        </button>
      </form>

      <p className='path-generator-footer'>
        La IA creará un plan personalizado basado en tus preferencias
      </p>
    </div>

    </div>
  );
}

