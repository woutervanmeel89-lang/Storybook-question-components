import type {
  ReasoningConfig,
  ReasoningValidationResult,
} from '../../../types/exercise';

export interface ReasoningFieldProps {
  reasoning: ReasoningConfig;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  validation?: ReasoningValidationResult;
}
