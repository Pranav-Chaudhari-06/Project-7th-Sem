import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Registration.css';
import axios from 'axios';

export default function Registration() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',  // Age as number
        gender: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const { firstName, lastName, age, gender, phoneNumber, email, password, confirmPassword, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.id]: e.target.value });

    const validateForm = () => {
        const newErrors = {};
        // First name validation
        if (!firstName.trim()) newErrors.firstName = 'First name is required';
        // Last name validation
        if (!lastName.trim()) newErrors.lastName = 'Last name is required';
        // Age validation (minimum age 18, maximum age 100)
        if (!age) {
            newErrors.age = 'Age is required';
        } else if (age < 18 || age > 100) {
            newErrors.age = 'Age must be between 18 and 100';
        }
        // Gender validation
        if (!gender) newErrors.gender = 'Please select your gender';
        // Phone number validation
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits';
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) newErrors.email = 'Invalid email address';
        // Password validation
        if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        // Confirm password validation
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        // Role validation
        if (!role) newErrors.role = 'Please select your role';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (step === 1) {
            const personalInfoErrors = {};
            if (!firstName.trim()) personalInfoErrors.firstName = 'First name is required';
            if (!lastName.trim()) personalInfoErrors.lastName = 'Last name is required';
            if (!age) {
                personalInfoErrors.age = 'Age is required';
            } else if (age < 18 || age > 100) {
                personalInfoErrors.age = 'Age must be between 18 and 100';
            }
            if (!gender) personalInfoErrors.gender = 'Please select your gender';

            if (Object.keys(personalInfoErrors).length === 0) {
                setStep(2);
            } else {
                setErrors(personalInfoErrors);
            }
        } else if (step === 2) {
            const contactInfoErrors = {};
            const phonePattern = /^[0-9]{10}$/;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!phonePattern.test(phoneNumber)) contactInfoErrors.phoneNumber = 'Phone number must be 10 digits';
            if (!emailPattern.test(email)) contactInfoErrors.email = 'Invalid email address';
            if (password.length < 6) contactInfoErrors.password = 'Password must be at least 6 characters';
            if (password !== confirmPassword) contactInfoErrors.confirmPassword = 'Passwords do not match';

            if (Object.keys(contactInfoErrors).length === 0) {
                setStep(3);
            } else {
                setErrors(contactInfoErrors);
            }
        }
    };

    const prevStep = () => setStep(step - 1);

    const onSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await axios.post('http://localhost:5000/api/users/register', formData);
            console.log(res.data);
            alert('Registration successful! An OTP has been sent to your email.');
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
                                <input type="text" className="form-control" id="firstName" placeholder="Enter first name" value={firstName} onChange={onChange} />
                                {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="lastName" className="form-label text-lg">Last Name</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Enter last name" value={lastName} onChange={onChange} />
                                {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="age" className="form-label text-lg">Age</label>
                                <input type="number" className="form-control" id="age" placeholder="Enter your age" value={age} onChange={onChange} />
                                {errors.age && <div className="text-danger">{errors.age}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="gender" className="form-label text-lg">Gender</label>
                                <select className="form-control" id="gender" value={gender} onChange={onChange}>
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <div className="text-danger">{errors.gender}</div>}
                            </div>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h4>Contact Info</h4>
                            <div className="form-group mb-3">
                                <label htmlFor="phoneNumber" className="form-label text-lg">Phone Number</label>
                                <input type="tel" className="form-control" id="phoneNumber" placeholder="Enter phone number" value={phoneNumber} onChange={onChange} />
                                {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="email" className="form-label text-lg">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={onChange} />
                                {errors.email && <div className="text-danger">{errors.email}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password" className="form-label text-lg">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={onChange} />
                                {errors.password && <div className="text-danger">{errors.password}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="confirmPassword" className="form-label text-lg">Confirm Password</label>
                                <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm password" value={confirmPassword} onChange={onChange} />
                                {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                            </div>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={prevStep}>Back</button>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h4>Role Selection</h4>
                            <div className="form-group mb-3">
                                <label htmlFor="role" className="form-label text-lg">Select Role</label>
                                <select className="form-control" id="role" value={role} onChange={onChange}>
                                    <option value="">Select role</option>
                                    <option value="Architect">Architect</option>
                                    {/* <option value="admin">Admin</option> */}
                                </select>
                                {errors.role && <div className="text-danger">{errors.role}</div>}
                            </div>
                            <button type="button" className="btn btn-custom w-100 mb-3" onClick={prevStep}>Back</button>
                            <button type="submit" className="btn btn-custom w-100 mb-3">Submit</button>
                        </div>
                    )}
                </form>
                <p className="text-center mt-3">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}
