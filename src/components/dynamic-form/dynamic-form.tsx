import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useRenderFormFields } from "hooks/useRenderFormFields";
import React from "react";
import * as yup from "yup";

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  style,
  formStyle,
  direction,
  spacing,
  validationSchema,
  useFlexGap,
  maxWidth,
  gap,
  flexWrap,
  backendErrors,
}) => {
  const { formFields, handleSubmit, isSubmitting } = useRenderFormFields({
    fields,
    validationSchema,
    backendErrors,
  });

  return (
    <Stack
      component="form"
      direction={"column"}
      style={style}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack
        direction={direction}
        style={formStyle}
        spacing={spacing}
        flexWrap={flexWrap}
        useFlexGap={useFlexGap}
        gap={gap}
        maxWidth={maxWidth}
        mb={2}
      >
        {formFields}
      </Stack>
      <Box>
        <LoadingButton
          type="submit"
          loading={isSubmitting}
          variant="contained"
          size="large"
        >
          Submit
        </LoadingButton>
      </Box>
    </Stack>
  );
};

const generateValidationSchema = (fields: FormField[]) => {
  const schemaObject: { [key: string]: yup.AnySchema } = {};

  fields.forEach((field) => {
    const { name, type, rules, multiple } = field;

    let fieldSchema;

    switch (type) {
      case "text":
      case "email":
      case "password":
      case "textarea":
        fieldSchema = yup.string();
        break;
      case "number":
        fieldSchema = yup.number();
        break;
      case "checkbox":
        fieldSchema = yup.boolean();
        break;
      case "select":
        fieldSchema = multiple ? yup.array() : yup.string();
        break;
      default:
        fieldSchema = yup.string();
        break;
    }

    if (rules) {
      rules.forEach((validation) => {
        switch (validation.type) {
          case "required":
            fieldSchema = fieldSchema.required(validation.message);
            break;
          case "minLength":
            fieldSchema = fieldSchema.min(validation.value, validation.message);
            break;
          case "maxLength":
            fieldSchema = fieldSchema.max(validation.value, validation.message);
            break;
          case "pattern":
            fieldSchema = fieldSchema.matches(
              validation.value,
              validation.message
            );
            break;
          default:
            break;
        }
      });
    }

    schemaObject[name] = fieldSchema;
  });

  return yup.object().shape(schemaObject);
};

export { generateValidationSchema };

export default DynamicForm;
