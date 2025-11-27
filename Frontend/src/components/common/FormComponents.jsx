import React from 'react';
import PropTypes from 'prop-types';

/**
 * Form components using Tailwind CSS for the PropertyHub design system
 */

// Base Input Component
export const Input = ({
    id,
    name,
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    error,
    helperText,
    disabled = false,
    required = false,
    className = '',
    icon,
    iconPosition = 'left',
    ...props
}) => {
    const inputClasses = `
    w-full 
    px-4 
    py-2 
    bg-white
    border 
    ${error ? 'border-error-500 focus:ring-error-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'} 
    rounded 
    shadow-sm
    focus:outline-none 
    focus:ring-2 
    focus:ring-opacity-50
    transition-colors
    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `;

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium mb-1 ${error ? 'text-error-600' : 'text-gray-700'}`}
                >
                    {label}
                    {required && <span className="ml-1 text-error-500">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && iconPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        {icon}
                    </div>
                )}

                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={inputClasses}
                    {...props}
                />

                {icon && iconPosition === 'right' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        {icon}
                    </div>
                )}
            </div>

            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-error-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

// TextArea Component
export const TextArea = ({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    rows = 4,
    error,
    helperText,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    const textareaClasses = `
    w-full 
    px-4 
    py-2 
    bg-white
    border 
    ${error ? 'border-error-500 focus:ring-error-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'} 
    rounded 
    shadow-sm
    focus:outline-none 
    focus:ring-2 
    focus:ring-opacity-50
    transition-colors
    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
    ${className}
  `;

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium mb-1 ${error ? 'text-error-600' : 'text-gray-700'}`}
                >
                    {label}
                    {required && <span className="ml-1 text-error-500">*</span>}
                </label>
            )}
            <textarea
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                rows={rows}
                disabled={disabled}
                required={required}
                className={textareaClasses}
                {...props}
            />
            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-error-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

// Select Component
export const Select = ({
    id,
    name,
    label,
    value,
    onChange,
    options = [],
    error,
    helperText,
    disabled = false,
    required = false,
    placeholder = 'Select an option',
    className = '',
    ...props
}) => {
    const selectClasses = `
    w-full 
    px-4 
    py-2 
    bg-white 
    border 
    ${error ? 'border-error-500 focus:ring-error-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'} 
    rounded 
    shadow-sm
    focus:outline-none 
    focus:ring-2 
    focus:ring-opacity-50
    transition-colors
    appearance-none
    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
    ${className}
  `;

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium mb-1 ${error ? 'text-error-600' : 'text-gray-700'}`}
                >
                    {label}
                    {required && <span className="ml-1 text-error-500">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={selectClasses}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-error-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

// Checkbox Component
export const Checkbox = ({
    id,
    name,
    label,
    checked,
    onChange,
    error,
    helperText,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    return (
        <div className={`flex items-start mb-4 ${className}`}>
            <div className="flex items-center h-5">
                <input
                    id={id}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`
            w-4 
            h-4 
            text-primary-600 
            border-gray-300 
            rounded 
            focus:ring-primary-500
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                    {...props}
                />
            </div>
            <div className="ml-3 text-sm">
                {label && (
                    <label
                        htmlFor={id}
                        className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-700'} ${error ? 'text-error-600' : ''}`}
                    >
                        {label}
                        {required && <span className="ml-1 text-error-500">*</span>}
                    </label>
                )}
                {(error || helperText) && (
                    <p className={`text-sm ${error ? 'text-error-600' : 'text-gray-500'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        </div>
    );
};

// Radio Button Component
export const Radio = ({
    id,
    name,
    label,
    value,
    checked,
    onChange,
    error,
    helperText,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    return (
        <div className={`flex items-start mb-4 ${className}`}>
            <div className="flex items-center h-5">
                <input
                    id={id}
                    name={name}
                    type="radio"
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`
            w-4 
            h-4 
            text-primary-600 
            border-gray-300 
            focus:ring-primary-500
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                    {...props}
                />
            </div>
            <div className="ml-3 text-sm">
                {label && (
                    <label
                        htmlFor={id}
                        className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-700'} ${error ? 'text-error-600' : ''}`}
                    >
                        {label}
                        {required && <span className="ml-1 text-error-500">*</span>}
                    </label>
                )}
                {(error || helperText) && (
                    <p className={`text-sm ${error ? 'text-error-600' : 'text-gray-500'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        </div>
    );
};

// Form Group Component
export const FormGroup = ({ children, className = '', ...props }) => {
    return (
        <div className={`mb-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

// Field Description Component
export const FieldDescription = ({ children, className = '', ...props }) => {
    return (
        <p className={`mt-1 text-sm text-gray-500 ${className}`} {...props}>
            {children}
        </p>
    );
};

// Range Slider Component
export const RangeSlider = ({
    id,
    name,
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    error,
    helperText,
    disabled = false,
    showValue = true,
    className = '',
    ...props
}) => {
    return (
        <div className="mb-4">
            <div className="flex justify-between">
                {label && (
                    <label
                        htmlFor={id}
                        className={`block text-sm font-medium mb-1 ${error ? 'text-error-600' : 'text-gray-700'}`}
                    >
                        {label}
                    </label>
                )}
                {showValue && (
                    <span className="text-sm text-gray-500">{value}</span>
                )}
            </div>
            <input
                id={id}
                name={name}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
          w-full 
          h-2 
          bg-gray-200 
          rounded-lg 
          appearance-none 
          cursor-pointer 
          accent-primary-600
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
                {...props}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{min}</span>
                <span>{max}</span>
            </div>
            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-error-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

// File Upload Component
export const FileUpload = ({
    id,
    name,
    label,
    onChange,
    error,
    helperText,
    disabled = false,
    required = false,
    accept,
    multiple = false,
    className = '',
    ...props
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium mb-1 ${error ? 'text-error-600' : 'text-gray-700'}`}
                >
                    {label}
                    {required && <span className="ml-1 text-error-500">*</span>}
                </label>
            )}
            <div className={`
        mt-1 
        flex 
        justify-center 
        px-6 
        pt-5 
        pb-6 
        border-2 
        ${error ? 'border-error-500' : 'border-gray-300'} 
        border-dashed 
        rounded-md
        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
        ${className}
      `}>
                <div className="space-y-1 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                        <label
                            htmlFor={id}
                            className={`
                relative 
                font-medium 
                text-primary-600 
                hover:text-primary-500 
                focus-within:outline-none 
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
                        >
                            <span>Upload a file</span>
                            <input
                                id={id}
                                name={name}
                                type="file"
                                accept={accept}
                                multiple={multiple}
                                onChange={onChange}
                                disabled={disabled}
                                required={required}
                                className="sr-only"
                                {...props}
                            />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                        {accept?.split(',').join(', ') || 'Any file format'}
                        {multiple && ' (multiple files allowed)'}
                    </p>
                </div>
            </div>
            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-error-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

// Define prop types for all components
Input.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
};

TextArea.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    rows: PropTypes.number,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
};

Select.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
};

Radio.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
};

FormGroup.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

FieldDescription.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

RangeSlider.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    showValue: PropTypes.bool,
    className: PropTypes.string,
};

FileUpload.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    className: PropTypes.string,
};