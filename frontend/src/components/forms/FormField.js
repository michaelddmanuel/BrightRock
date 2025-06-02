import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';

/**
 * FormField - A reusable form field component that supports various input types
 *
 * @param {string} name - Field name
 * @param {string} label - Field label
 * @param {string} type - Field type (text, password, email, number, select, textarea, checkbox)
 * @param {Object} formik - Formik instance
 * @param {string} placeholder - Placeholder text
 * @param {string} helperText - Helper text
 * @param {React.ReactNode} leftElement - Element to show on the left of the input
 * @param {React.ReactNode} rightElement - Element to show on the right of the input
 * @param {Array} options - Options for select fields
 * @param {Object} props - Additional props to pass to the input component
 */
const FormField = ({
  name,
  label,
  type = 'text',
  formik,
  placeholder,
  helperText,
  leftElement,
  rightElement,
  options = [],
  ...props
}) => {
  const error = formik.errors[name];
  const touched = formik.touched[name];
  const value = formik.values[name];
  
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={placeholder}
            {...props}
          />
        );
        
      case 'select':
        return (
          <Select
            id={name}
            name={name}
            value={value || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={placeholder}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
        
      case 'checkbox':
        return (
          <Checkbox
            id={name}
            name={name}
            isChecked={value || false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            {...props}
          >
            {placeholder}
          </Checkbox>
        );
        
      case 'number':
        return (
          <NumberInput
            id={name}
            name={name}
            value={value || ''}
            onChange={(valueString) => formik.setFieldValue(name, valueString)}
            onBlur={formik.handleBlur}
            {...props}
          >
            <NumberInputField placeholder={placeholder} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        );
        
      default:
        return (
          <InputGroup>
            {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
            <Input
              id={name}
              name={name}
              type={type}
              value={value || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={placeholder}
              {...props}
            />
            {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
          </InputGroup>
        );
    }
  };
  
  return (
    <FormControl isInvalid={error && touched} mb={4}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {renderField()}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
      {error && touched && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default FormField;
