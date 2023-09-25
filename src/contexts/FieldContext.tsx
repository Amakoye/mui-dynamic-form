import { models } from "components/dummy";
import {
  FC,
  ReactElement,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

const FieldContext = createContext<{
  fieldOptions: Option[];
  loading: boolean;
}>(null);

export const useGetFieldOptions = ({
  field,
  parentFieldValue,
}: UseGetFieldOptions) => {
  const { type, dependsOn, optionsUrl } = field;
  const [fieldOptions, setFieldOptions] = useState<Option[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const getFieldOptions = useCallback(async () => {
    if (type === "select" && dependsOn) {
      if (parentFieldValue) {
        /*   const options = await api
          .get<Option[]>(`${optionsUrl}/${parentFieldValue}`)
          .then((res) => res.data); */
        setLoading(true);
        const options = models[parentFieldValue];
        setTimeout(() => {
          setFieldOptions(options);
          setLoading(false);
        }, 5000);
      }
    }
  }, [dependsOn, parentFieldValue, type]);

  useEffect(() => {
    getFieldOptions();
  }, [getFieldOptions]);

  return {
    fieldOptions,
    loading,
  };
};

export const FieldContextProvider: FC<FieldContextProviderProps> = ({
  children,
  field,
  parentFieldValue,
}) => {
  const { fieldOptions, loading } = useGetFieldOptions({
    field,
    parentFieldValue,
  });
  return (
    <FieldContext.Provider value={{ fieldOptions, loading }}>
      {children}
    </FieldContext.Provider>
  );
};

type FieldContextProviderProps = {
  children: ReactElement;
  field: FormField;
  parentFieldValue: string | number;
};

type UseGetFieldOptions = {
  field: FormField;
  parentFieldValue?: string | number;
};
