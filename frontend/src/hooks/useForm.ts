import { useState, useCallback, useMemo } from 'react';
import { FormData, FormErrors, UseFormReturn } from '../types';

interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

interface FieldConfig {
  [key: string]: ValidationRule;
}

export const useForm = <T extends FormData>(
  initialValues: T,
  validationConfig?: FieldConfig
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función de validación
  const validateField = useCallback((name: string, value: any): string => {
    if (!validationConfig || !validationConfig[name]) return '';

    const rules = validationConfig[name];

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'Este campo es requerido';
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return '';
    }

    // Min/Max validation for numbers
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `El valor mínimo es ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `El valor máximo es ${rules.max}`;
      }
    }

    // MinLength/MaxLength validation for strings
    if (typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        return `Mínimo ${rules.minLength} caracteres`;
      }
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        return `Máximo ${rules.maxLength} caracteres`;
      }
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Formato inválido';
    }

    // Custom validation
    if (rules.custom) {
      const result = rules.custom(value);
      if (typeof result === 'string') return result;
      if (!result) return 'Valor inválido';
    }

    return '';
  }, [validationConfig]);

  // Validar todos los campos
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    Object.keys(values).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [values, validateField]);

  // Manejar cambio de valor
  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Validar campo si ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  // Manejar blur (cuando el campo pierde foco)
  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validar campo al perder foco
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  // Manejar submit
  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Marcar todos los campos como tocados
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouched(allTouched);

      // Validar todos los campos
      if (!validateAll()) {
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Error en submit:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateAll]);

  // Resetear formulario
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Establecer valor de campo específico
  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Establecer error de campo específico
  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Calcular si el formulario es válido
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && Object.keys(touched).length > 0;
  }, [errors, touched]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError
  };
};

// Validadores comunes
export const validators = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Formato de email inválido';
    }
  },
  
  password: {
    minLength: 8,
    custom: (value: string) => {
      if (!value) return true;
      if (value.length < 8) return 'Mínimo 8 caracteres';
      if (!/(?=.*[a-z])/.test(value)) return 'Debe contener al menos una minúscula';
      if (!/(?=.*[A-Z])/.test(value)) return 'Debe contener al menos una mayúscula';
      if (!/(?=.*\d)/.test(value)) return 'Debe contener al menos un número';
      return true;
    }
  },

  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    custom: (value: string) => {
      if (!value) return true;
      return /^[\+]?[1-9][\d]{0,15}$/.test(value) || 'Formato de teléfono inválido';
    }
  },

  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return 'URL inválida';
      }
    }
  },

  required: {
    required: true
  },

  minLength: (length: number) => ({
    minLength: length
  }),

  maxLength: (length: number) => ({
    maxLength: length
  }),

  min: (value: number) => ({
    min: value
  }),

  max: (value: number) => ({
    max: value
  }),

  numeric: {
    custom: (value: string) => {
      if (!value) return true;
      return /^\d+$/.test(value) || 'Solo números permitidos';
    }
  },

  alphanumeric: {
    custom: (value: string) => {
      if (!value) return true;
      return /^[a-zA-Z0-9]+$/.test(value) || 'Solo letras y números permitidos';
    }
  }
};

// Hook para manejar múltiples formularios
export const useMultiStepForm = <T extends FormData>(
  steps: T[],
  validationConfigs?: FieldConfig[]
) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<T[]>(steps);

  const forms = steps.map((step, index) => 
    useForm(step, validationConfigs?.[index])
  );

  const currentForm = forms[currentStep];

  const nextStep = useCallback(() => {
    if (currentForm.isValid && currentStep < steps.length - 1) {
      setStepData(prev => {
        const newData = [...prev];
        newData[currentStep] = currentForm.values;
        return newData;
      });
      setCurrentStep(prev => prev + 1);
    }
  }, [currentForm, currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const getAllData = useCallback(() => {
    const allData = { ...stepData[currentStep], ...currentForm.values };
    return stepData.reduce((acc, step, index) => {
      if (index === currentStep) {
        return { ...acc, ...currentForm.values };
      }
      return { ...acc, ...step };
    }, {});
  }, [stepData, currentStep, currentForm.values]);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return {
    currentStep,
    currentForm,
    nextStep,
    prevStep,
    goToStep,
    getAllData,
    isLastStep,
    isFirstStep,
    totalSteps: steps.length
  };
};

export default useForm;
