import "./AIStatusCard.css";

import { FiCpu } from "react-icons/fi";

export default function AIStatusCard({

    confidence,

    similarity,

}) {

    return (

        <div className="ai-status-card">

            <div className="ai-header">

                <FiCpu />

                <h2>
                    AI Authentication
                </h2>

            </div>

            <div className="ai-grid">

                <div>

                    <span>Confidence</span>

                    <h3>
                        {confidence ?? "--"}%
                    </h3>

                </div>

                <div>

                    <span>Similarity</span>

                    <h3>
                        {similarity ?? "--"}%
                    </h3>

                </div>

                <div>

                    <span>Status</span>

                    <h3 className="verified">

                        VERIFIED

                    </h3>

                </div>

            </div>

        </div>

    );

}