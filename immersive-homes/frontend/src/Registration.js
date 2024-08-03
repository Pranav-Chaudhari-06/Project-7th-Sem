import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Registration.css';

export default function Registration() {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-25 mt-5">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="text-center mb-4">Register</h3>
                <form>
                    {step === 1 && (
                        <div>
                            <h4>Personal Info</h4>
                            <div className="form-group mb-3">
                                <label htmlFor="firstName" className="form-label text-lg">First Name</label>
                                <input type="text" className="form-control" id="firstName" placeholder="Enter first name" />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="lastName" className="form-label text-lg">Last Name</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Enter last name" />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="age" className="form-label text-lg">Age</label>
                                <input type="number" className="form-control" id="age" placeholder="Enter age" />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="gender" className="form-label text-lg">Gender</label>
                                <select className="form-control" id="gender">
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h4>Contact Info</h4>
                            <div className="form-group mb-3">
                                <label htmlFor="phoneNumber" className="form-label text-lg">Phone Number</label>
                                <input type="tel" className="form-control" id="phoneNumber" placeholder="Enter phone number" />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="email" className="form-label text-lg">Email Address</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password" className="form-label text-lg">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password" />
                            </div>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={prevStep}>Previous</button>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h4>Confirm Info</h4>
                            <div className="form-group mb-3">
                                <label htmlFor="confirmPassword" className="form-label text-lg">Confirm Password</label>
                                <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm password" />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="Role" className="form-label text-lg">Register As</label>
                                <select className="form-control" id="gender">
                                    <option value="">Select your role</option>
                                    <option value="male">Architect</option>
                                    <option value="female">Developer</option>
                                </select>
                            </div>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={prevStep}>Previous</button>
                            <button type="submit" className="btn btn-custom w-100 mb-3">Submit</button>
                        </div>
                    )}
                    <div className="text-center my-3">
                        Already have an account?<Link to="/login" className="text-primary"> Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
