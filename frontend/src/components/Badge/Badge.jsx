import "./Badge.css";

export default function Badge({

    children,
    variant = "primary"

}) {

    return (

        <span className={`badge badge-${variant}`}>

            {children}

        </span>

    );

}