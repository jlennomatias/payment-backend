import { ValidationError } from 'class-validator';

interface CustomValidationError extends ValidationError {
  code?: string;
  title?: string;
}

export default CustomValidationError;
