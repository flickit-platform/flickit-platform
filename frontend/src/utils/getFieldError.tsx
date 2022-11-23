import { FieldError, FieldErrorsImpl, LiteralUnion } from "react-hook-form";
import { Trans } from "react-i18next";

type TErrorTypes =
  | "disabled"
  | "required"
  | "pattern"
  | "onBlur"
  | "onChange"
  | "value"
  | "min"
  | "max"
  | "maxLength"
  | "minLength"
  | "validate"
  | "valueAsNumber"
  | "valueAsDate"
  | "setValueAs"
  | "shouldUnregister"
  | "deps";

type TErrorMessagesBaseOnErrorTypes = Partial<Record<TErrorTypes, JSX.Element>>;

const errorMessagesBaseOnErrorTypes: TErrorMessagesBaseOnErrorTypes = {
  required: <Trans i18nKey="requiredFieldError" />,
  minLength: <Trans i18nKey="minLengthFieldError" />,
};

const getFieldError = (
  errors: FieldErrorsImpl<{
    [x: string]: any;
  }>,
  name: string
) => {
  const error = errors?.[name];
  const hasError = !!error?.type;
  const errorMessage =
    errorMessagesBaseOnErrorTypes[error?.type as TErrorTypes] || error?.message;

  return { hasError, errorMessage };
};

export default getFieldError;
