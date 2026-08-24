import "./EmployeeForm.css";

export default function EmployeeForm({ formData, handleChange }) {

    return (

        <section className="employee-form-card">

            <div className="form-title">

                <h2>Employee Information</h2>

                <p>Fill employee details before biometric enrollment.</p>

            </div>

            <div className="employee-form-grid">

                <div className="input-group">

                    <label>Employee ID</label>

                    <input
                        type="text"
                        name="employeeId"
                        placeholder="EMP-1001"
                        value={formData.employeeId}
                        onChange={handleChange}
                    />

                </div>

                <div className="input-group">

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="name"
                        placeholder="Lakshya Malhotra"
                        value={formData.name}
                        onChange={handleChange}
                    />

                </div>

                <div className="input-group">

                    <label>Department</label>

                    <input
                        type="text"
                        name="department"
                        placeholder="Computer Science"
                        value={formData.department}
                        onChange={handleChange}
                    />

                </div>

                <div className="input-group">

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="employee@company.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                </div>

            </div>

        </section>

    );

}