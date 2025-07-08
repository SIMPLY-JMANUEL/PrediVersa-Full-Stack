import { useState, useEffect } from 'react';

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }
    fetch('http://localhost:5001/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Credenciales inválidas');
        }
        return res.json();
      })
      .then(data => {
        setProfile(data.profile || data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const updateProfile = (newProfile) => {
    // Implementa aquí la lógica para actualizar el perfil si lo necesitas
  };

  return { profile, updateProfile, loading, error };
}