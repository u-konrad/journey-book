import { Field } from "formik";

const InputField = ({
  as = "input",
  onChange=()=>{},
  rows = "10",
  errors,
  touched,
  name,
  children,
  handleChange,
  divClass='mb-3',
  label,
  placeholder,
  disabled,
  autocomplete,
  onBlur,
  type,
  style
}) => {
  const processedLabel = label ?? name[0].toUpperCase() + name.slice(1);

  return (
    <div className={divClass}>
      <label className="form-label " htmlFor={name}>
        {processedLabel}
      </label>
      <Field
        placeholder={placeholder}
        disabled={disabled}
        as={as}
        name={name}
        className={`form-control ${
          touched[name] ? (!errors[name] ? "is-valid" : "is-invalid") : ""
        }`}
        type={type}
        id={name}
        rows={rows}
        onChange={(e) => {
          onChange(e);
          handleChange(e);
        }}
        onBlur={onBlur}
        autoComplete={autocomplete}
        style={style}
      >
        {children}
      </Field>
      {touched[name] && errors[name] ? (
        <div className="text-danger small">{errors[name]}</div>
      ) : null}
    </div>
  );
};

export default InputField;
