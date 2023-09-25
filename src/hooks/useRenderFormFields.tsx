import { yupResolver } from "@hookform/resolvers/yup";
import { Field } from "components/field/Field";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const useRenderFormFields = ({
  fields,
  validationSchema,
  backendErrors,
}: UseRenderFormFieldsProps) => {
  const [parentFieldValues, setParentFieldValues] = useState<{
    [key: string]: string | number;
  }>({});

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: fields.reduce((initialValues: any, field) => {
      initialValues[field.name] =
        field.type === "select" && field.multiple
          ? []
          : field.type === "select" && !field.multiple
          ? ""
          : field.type === "checkbox"
          ? false
          : "";
      return initialValues;
    }, {}),
    resolver: yupResolver(validationSchema || yup.object()),
    shouldUnregister: false,
  });

  const setInitialValues = useCallback(
    () =>
      fields.forEach((field) => {
        const { name, value } = field;
        if (value) {
          setValue(name, value);
        }
      }),
    [fields, setValue]
  );

  const handleParentFieldValueChange = (parentFieldName, value) => {
    setParentFieldValues((prevValues) => ({
      ...prevValues,
      [parentFieldName]: value,
    }));
  };

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  const formFields = useMemo(
    () =>
      fields?.map((field) => {
        const fieldProps = register(field.name);
        const { name, dependsOn } = field;
        const fieldError = errors[name];
        const backendError = backendErrors ? backendErrors[name] : "";

        let parentField: FormField;
        let parentFieldValue: string | number;

        if (dependsOn) {
          parentField = fields.find((f) => f.name === dependsOn);
          parentFieldValue = parentFieldValues[dependsOn] || "";
        }

        return (
          <Field
            key={name}
            {...{
              field,
              fieldProps,
              fieldError,
              control,
              backendError,
              parentField,
              parentFieldValue,
              handleParentFieldValueChange,
              setValue,
            }}
          />
        );
      }),
    [
      fields,
      register,
      errors,
      backendErrors,
      control,
      setValue,
      parentFieldValues,
    ]
  );

  return { formFields, handleSubmit, isSubmitting };
};

type UseRenderFormFieldsProps = {
  fields: FormField[];
  validationSchema?: yup.ObjectSchema<any>;
  backendErrors?: BackendErrors;
};
