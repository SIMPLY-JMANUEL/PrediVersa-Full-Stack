import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejo de formularios con validación
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación
 * @param {Function} onSubmit - Función a ejecutar al enviar el formulario
 */
export function useForm(initialValues, validationRules, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) {
      return '';
    }

    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        return error;
      }
    }
    return '';
  }, [validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    // Validar en tiempo real solo si el campo ya fue tocado
    if (touched[name] || value.length > 0) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateField, touched]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validar al perder el foco
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {};
    Object.keys(values).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return false;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      return true;
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateField, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    setError,
    isValid: Object.keys(errors).length === 0
  };
}

// Validadores comunes
export const validators = {
  required: (message = 'Este campo es requerido') => (value) => {
    return !value || !value.toString().trim() ? message : '';
  },

  minLength: (min, message) => (value) => {
    if (!value) {
      return '';
    }
    return value.length < min ? (message || `Debe tener al menos ${min} caracteres`) : '';
  },

  maxLength: (max, message) => (value) => {
    if (!value) {
      return '';
    }
    return value.length > max ? (message || `No puede exceder ${max} caracteres`) : '';
  },

  email: (message = 'Ingresa un correo válido') => (value) => {
    if (!value) {
      return '';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : message;
  },

  phone: (message = 'Ingresa un teléfono válido') => (value) => {
    if (!value) {
      return '';
    }
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(value) ? '' : message;
  },

  pattern: (regex, message) => (value) => {
    if (!value) {
      return '';
    }
    return regex.test(value) ? '' : message;
  }
};
