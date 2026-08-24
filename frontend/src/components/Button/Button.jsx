import "./Button.css";

function Button({
    children,
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    onClick,
    className = "",
}) {

    const buttonClasses = [
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? "btn-full" : "",
        loading ? "btn-loading" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            aria-busy={loading}
        >
            {loading ? (
                <>
                    <span className="btn-spinner" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon && (
                        <span className="btn-icon">
                            {leftIcon}
                        </span>
                    )}

                    <span className="btn-label">
                        {children}
                    </span>

                    {rightIcon && (
                        <span className="btn-icon">
                            {rightIcon}
                        </span>
                    )}
                </>
            )}
        </button>
    );

}

export default Button;