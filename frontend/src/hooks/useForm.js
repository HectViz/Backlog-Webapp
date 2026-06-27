import { useState, useCallback } from 'react';

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setValues((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setValues((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    handleChange,
    resetForm,
    setFieldValue,
    setValues,
  };
}

export default useForm;
