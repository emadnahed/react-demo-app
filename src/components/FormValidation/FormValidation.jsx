import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './FormValidation.css';

const schema = yup.object().shape({
  fullName: yup
    .string()
    .required('Full name is required')
    .matches(/^[a-zA-Z\s]*$/, 'Name should only contain letters and spaces'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const FormValidation = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    formState: { isDirty, isValid }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange', // Validate on every change
  });

  // Watch all form values
  const formValues = watch();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === 'checkbox' ? checked : value, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    setIsSubmitted(true);
    
    // Reset form and hide success message after 3 seconds
    reset();
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="form-container">
      <h2>Registration Form</h2>
      {isSubmitted && (
        <div className="success-message">
          Form submitted successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formValues.fullName || ''}
            onChange={handleInputChange}
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <div className="error-message">{errors.fullName.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formValues.email || ''}
            onChange={handleInputChange}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <div className="error-message">{errors.email.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formValues.password || ''}
            onChange={handleInputChange}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <div className="error-message">{errors.password.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formValues.confirmPassword || ''}
            onChange={handleInputChange}
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword.message}</div>
          )}
        </div>

        <div className="form-group checkbox-group">
          <div className="form-check">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formValues.agreeToTerms || false}
              onChange={handleInputChange}
              className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
            />
            <label className="form-check-label" htmlFor="agreeToTerms">
              I agree to the terms and conditions
            </label>
            {errors.agreeToTerms && (
              <div className="error-message">{errors.agreeToTerms.message}</div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormValidation;
