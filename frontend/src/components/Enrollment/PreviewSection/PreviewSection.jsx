import "./PreviewSection.css";

import {

    ImagePlus,

    Upload,

} from "lucide-react";

export default function PreviewSection({

    image,

    onUpload,

}) {

    return (

        <section className="preview-card">

            <div className="preview-header">

                <div>

                    <h2>

                        Palm Preview

                    </h2>

                    <span>

                        Captured / Uploaded Image

                    </span>

                </div>

            </div>

            <div className="preview-box">

                {

                    image ?

                    (

                        <img

                            src={image}

                            alt="Palm Preview"

                        />

                    )

                    :

                    (

                        <div className="preview-placeholder">

                            <ImagePlus size={60}/>

                            <span>

                                No Image Selected

                            </span>

                        </div>

                    )

                }

            </div>

            <label className="upload-btn">

                <Upload size={18}/>

                Upload Palm Image

                <input

                    type="file"

                    accept="image/*"

                    onChange={onUpload}

                    hidden

                />

            </label>

        </section>

    );

}