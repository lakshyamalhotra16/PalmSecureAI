import "./Input.css";

function Input({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    name,
    id,
    leftIcon,
    rightIcon,
    helperText,
    error,
    success,
    disabled = false,
    required = false,
    className = "",
}) {

    const inputClasses = [
        "input-field",
        error ? "input-error" : "",
        success ? "input-success" : "",
        leftIcon ? "has-left-icon" : "",
        rightIcon ? "has-right-icon" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (

        <div className="input-wrapper">

            {label && (

                <label
                    htmlFor={id}
                    className="input-label"
                >

                    {label}

                    {required && (
                        <span className="required">*</span>
                    )}

                </label>

            )}

            <div className="input-container">

                {leftIcon && (
                    <span className="input-icon left">
                        {leftIcon}
                    </span>
                )}

                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={inputClasses}
                />

                {rightIcon && (
                    <span className="input-icon right">
                        {rightIcon}
                    </span>
                )}

            </div>

            {helperText && !error && !success && (
                <small className="helper-text">
                    {helperText}
                </small>
            )}

            {error && (
                <small className="error-text">
                    {error}
                </small>
            )}

            {success && (
                <small className="success-text">
                    {success}
                </small>
            )}

        </div>

    );

}

export default Input;