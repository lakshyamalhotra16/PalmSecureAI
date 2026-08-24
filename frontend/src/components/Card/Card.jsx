import "./Card.css";

function Card({
    children,
    title,
    subtitle,
    icon,
    actions,
    hover = false,
    glass = false,
    elevation = "md",
    className = "",
}) {

    const cardClasses = [
        "card",
        `card-${elevation}`,
        hover ? "card-hover" : "",
        glass ? "card-glass" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <section className={cardClasses}>

            {(title || subtitle || icon || actions) && (

                <div className="card-header">

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "18px",
                        flex: 1
                    }}>

                        {icon && (
                            <div className="card-icon">
                                {icon}
                            </div>
                        )}

                        <div>

                            {title && (
                                <h3 className="card-title">
                                    {title}
                                </h3>
                            )}

                            {subtitle && (
                                <p className="card-subtitle">
                                    {subtitle}
                                </p>
                            )}

                        </div>

                    </div>

                    {actions}

                </div>

            )}

            <div className="card-body">

                {children}

            </div>

        </section>
    );

}

export default Card;