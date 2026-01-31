import { useState, useEffect } from 'react';

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiBaseUrl = process.env.REACT_APP_API_URL || '/api';
    const token = localStorage.getItem('token');
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }
    fetch(`${apiBaseUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error('Credenciales inválidas');
        }
        if (!res.ok) {
          throw new Error('Error obteniendo perfil');
        }
        return res.json();
      })
      .then(data => {
        setProfile(data.profile || data);
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        setError(false);
        setLoading(false);
      });
  }, []);

  const updateProfile = _newProfile => {
    // Implementa aquí la lógica para actualizar el perfil si lo necesitas
  };

  return { profile, updateProfile, loading, error };
}
