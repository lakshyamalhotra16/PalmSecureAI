import "./InfoCard.css";

export default function InfoCard({

    title,

    value,

    success = false,

}) {

    return (

        <div className="info-card">

            <h3>
                {title}
            </h3>

            <p className={success ? "success-text" : ""}>
                {value}
            </p>

        </div>

    );

}