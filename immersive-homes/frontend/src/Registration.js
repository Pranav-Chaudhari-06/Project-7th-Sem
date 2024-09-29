import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Registration.css';
import axios from 'axios';

export default function Registration() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    const navigate = useNavigate();

    const { firstName, lastName, age, gender, phoneNumber, email, password, confirmPassword, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.id]: e.target.value });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/users/register', formData);
            console.log(res.data);
            alert('Registration successful! An OTP has been sent to your email.');

            // Redirect to OTP verification page
            navigate('/otp_verification', { state: { email } });
        } catch (err) {
            console.error(err);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-25 mt-1">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="text-center mb-4">Register</h3>
                <form onSubmit={onSubmit}>
                    {step === 1 && (
                        <div>
                            <h4>Personal Info</h4>
                            <div className="form-group mb-3">
                                <label htmlFor="firstName" className="form-label text-lg">First Name</label>
                                <input type="text" className="form-control" id="firstName" placeholder="Enter first name" value={firstName} onChange={onChange} required />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="lastName" className="form-label text-lg">Last Name</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Enter last name" value={lastName} onChange={onChange} required />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="age" className="form-label text-lg">Age</label>
                                <input type="number" className="form-control" id="age" placeholder="Enter age" value={age} onChange={onChange} required />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="gender" className="form-label text-lg">Gender</label>
                                <select className="form-control" id="gender" value={gender} onChange={onChange} required>
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
                                <input type="tel" className="form-control" id="phoneNumber" placeholder="Enter phone number" value={phoneNumber} onChange={onChange} required />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="email" className="form-label text-lg">Email Address</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={onChange} required />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password" className="form-label text-lg">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={onChange} required />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="confirmPassword" className="form-label text-lg">Confirm Password</label>
                                <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm password" value={confirmPassword} onChange={onChange} required />
                            </div>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={prevStep}>Previous</button>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h4>Confirm Info</h4>
                            <div className="form-group mb-3">
                                <label htmlFor="role" className="form-label text-lg">Register As</label>
                                <select className="form-control" id="role" value={role} onChange={onChange} required>
                                    <option value="">Select your role</option>
                                    <option value="architect">Architect</option>
                                    <option value="developer">Developer</option>
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