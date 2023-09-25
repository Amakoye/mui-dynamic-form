import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Iconify from "components/iconify/Iconify";
import {
  FieldContextProvider,
  useGetFieldOptions,
} from "contexts/FieldContext";
import { MenuProps } from "hooks/useRenderFormFields";
import { FC } from "react";
import { Controller } from "react-hook-form";

const DEFAULT_FIELD_WIDTH = "14em";

export const Field: FC<FieldProps> = ({
  field,
  fieldError,
  backendError,
  fieldProps,
  control,
  parentField,
  parentFieldValue,
  handleParentFieldValueChange,
  setValue,
}) => {
  const {
    label,
    type,
    options,
    name,
    variant,
    width,
    multiline,
    rows,
    size,
    multiple,
    dependsOn,
  } = field;

  const { fieldOptions, loading } = useGetFieldOptions({
    field,
    parentFieldValue,
  });

  const getField = () => {
    switch (type) {
      case "text":
      case "number":
        return (
          <Box width={width ? width : DEFAULT_FIELD_WIDTH} key={label}>
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label={label}
                  size={size}
                  error={!!fieldError || !!backendError}
                  variant={variant}
                  helperText={
                    fieldError
                      ? backendError || (fieldError?.message as string)
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </Box>
        );

      case "date":
        return (
          <Box width={width ? width : DEFAULT_FIELD_WIDTH} key={label}>
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field: { ref, value, ...field } }) => (
                <DatePicker
                  value={value || null}
                  label={label}
                  {...field}
                  onChange={(e) => {
                    setValue(name, e?.toString() ?? null);
                  }}
                  renderInput={(props) => (
                    <TextField
                      fullWidth
                      label={label}
                      type={type}
                      size={size}
                      error={!!fieldError || !!backendError}
                      variant={variant}
                      helperText={
                        fieldError
                          ? backendError || (fieldError?.message as string)
                          : ""
                      }
                      {...props}
                      name={name}
                      ref={ref}
                    />
                  )}
                />
              )}
            />
          </Box>
        );

      case "textarea":
        return (
          <Box width={width ? width : DEFAULT_FIELD_WIDTH} key={label}>
            <Controller
              key={name}
              name={name}
              control={control}
              render={({}) => (
                <TextField
                  fullWidth
                  label={label}
                  name={name}
                  size={size}
                  variant={variant}
                  multiline={multiline}
                  rows={rows}
                  error={!!fieldError || !!backendError}
                  helperText={
                    fieldError
                      ? backendError || (fieldError?.message as string)
                      : ""
                  }
                  {...fieldProps}
                />
              )}
            />
          </Box>
        );

      case "email":
      case "password":
        return (
          <Box width={width ? width : DEFAULT_FIELD_WIDTH} key={name}>
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label={label}
                  type={type}
                  size={size}
                  error={!!fieldError || !!backendError}
                  variant={variant}
                  helperText={
                    fieldError
                      ? backendError || (fieldError?.message as string)
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </Box>
        );
      case "select":
        if (multiple) {
          return (
            <Box width={width ? width : DEFAULT_FIELD_WIDTH} key={label}>
              <FormControl fullWidth error={!!fieldError}>
                <InputLabel id="multiple-chip-label">{label}</InputLabel>
                <Controller
                  name={name}
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="multiple-chip-label"
                      id="multiple-chip"
                      multiple
                      input={
                        <OutlinedInput
                          id="select-multiple-chip"
                          label={label}
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {selected?.map((value) => {
                            const selectedOption = options?.find(
                              (option) => option.value === value
                            );
                            return (
                              <Chip
                                key={value}
                                label={
                                  selectedOption ? selectedOption.label : ""
                                }
                              />
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {/*        {sentenceCase(option.label as string)} */}
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>
                  {fieldError
                    ? backendError || (fieldError?.message as string)
                    : ""}
                </FormHelperText>
              </FormControl>
            </Box>
          );
        }
        if (dependsOn) {
          return (
            <Box width={width ? width : DEFAULT_FIELD_WIDTH} key={label}>
              <FormControl fullWidth error={!!fieldError}>
                <InputLabel>
                  {label}
                  <>
                    {loading && <CircularProgress sx={{ ml: 1 }} size={15} />}
                  </>
                </InputLabel>
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={`${label}${
                        loading ? (
                          <CircularProgress sx={{ ml: 1 }} size={15} />
                        ) : null
                      }`}
                      disabled={!parentFieldValue || loading}
                      multiple={multiple}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      size={size}
                      inputProps={{
                        startAdornment: (
                          <Iconify icon={"eva:alert-triangle-outline"} />
                        ),
                      }}
                    >
                      {fieldOptions?.map(({ value, label }) => (
                        <MenuItem key={`${value}-${label}`} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>
                  {fieldError
                    ? backendError || (fieldError?.message as string)
                    : ""}
                </FormHelperText>
              </FormControl>
            </Box>
          );
        }
        return (
          <Box width={width ? width : DEFAULT_FIELD_WIDTH} key={label}>
            <FormControl fullWidth error={!!fieldError}>
              <InputLabel>{label}</InputLabel>
              <Controller
                key={name}
                name={name}
                control={control}
                render={({ field }) => (
                  <Select
                    multiple={multiple}
                    value={field.value || ""}
                    label={label}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (parentField?.name === dependsOn) {
                        handleParentFieldValueChange(name, e.target.value);
                      }
                    }}
                    size={size}
                  >
                    {options?.map(({ value, label }) => (
                      <MenuItem key={`${value}-${label}`} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>
                {fieldError
                  ? backendError || (fieldError?.message as string)
                  : ""}
              </FormHelperText>
            </FormControl>
          </Box>
        );
      case "checkbox":
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({}) => (
              <Box key={label}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox name={name} color="primary" {...fieldProps} />
                    }
                    label={label}
                  />
                </FormGroup>
              </Box>
            )}
          />
        );
      default:
        return null;
    }
  };

  const formField = getField();

  return (
    <FieldContextProvider {...{ parentFieldValue, field }}>
      {formField}
    </FieldContextProvider>
  );
};
