import React, { useState } from 'react';
import './HeartDiseaseForm.css';

const HeartDiseaseForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '1',
    ap_hi: '',
    ap_lo: '',
    cholesterol: '1',
    gluc: '1',
    smoke: '0',
    alco: '0',
    active: '0',
    weight: '',
    height: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {


      // Parse inputs
      let age = parseFloat(formData.age);
      const heightInMeters = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      let ap_hi = parseFloat(formData.ap_hi);
      let ap_lo = parseFloat(formData.ap_lo);
      const gender = parseFloat(formData.gender);
      const cholesterol = parseFloat(formData.cholesterol);
      const gluc = parseFloat(formData.gluc);
      const smoke = parseFloat(formData.smoke);
      const alco = parseFloat(formData.alco);
      const active = parseFloat(formData.active);

      // Age outlier handling (matching notebook: if age < 39, replace with mean ~53)
      if (age < 39) {
        age = 53;
      }

      // Blood pressure swap (matching notebook preprocessing)
      if (ap_hi < ap_lo) {
        [ap_hi, ap_lo] = [ap_lo, ap_hi];
      }

      // Calculate derived features
      const bmi = weight / (heightInMeters * heightInMeters);
      const pulse_pressure = ap_hi - ap_lo;

      // Prepare features array in the EXACT order expected by the model
      // [age, gender, ap_hi, ap_lo, cholesterol, gluc, smoke, alco, active, BMI, pulse_pressure]
      const features = [
        age,
        gender,
        ap_hi,
        ap_lo,
        cholesterol,
        gluc,
        smoke,
        alco,
        active,
        bmi,
        pulse_pressure,
      ];

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setPredictionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-wrapper">
      <div className="prediction-card">
        <header className="card-header">
          <div className="header-icon">❤️</div>
          <div className="header-text">
            <h1>CardioCheck</h1>
            <p>Advanced Cardiovascular Risk Assessment</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="prediction-form">
          <section className="form-section">
            <h2 className="section-title">Patient Profile</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age (Years)</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 45"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="1">Female</option>
                  <option value="2">Male</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 70"
                />
              </div>
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  id="height"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 175"
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">Vital Signs</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ap_hi">Systolic BP (mmHg)</label>
                <input
                  id="ap_hi"
                  type="number"
                  name="ap_hi"
                  value={formData.ap_hi}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 120"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ap_lo">Diastolic BP (mmHg)</label>
                <input
                  id="ap_lo"
                  type="number"
                  name="ap_lo"
                  value={formData.ap_lo}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 80"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cholesterol">Cholesterol Level</label>
                <select id="cholesterol" name="cholesterol" value={formData.cholesterol} onChange={handleChange}>
                  <option value="1">Normal</option>
                  <option value="2">Above Normal</option>
                  <option value="3">Well Above Normal</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="gluc">Glucose Level</label>
                <select id="gluc" name="gluc" value={formData.gluc} onChange={handleChange}>
                  <option value="1">Normal</option>
                  <option value="2">Above Normal</option>
                  <option value="3">Well Above Normal</option>
                </select>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">Lifestyle & Habits</h2>
            <div className="form-grid-3">
              <div className="form-group">
                <label htmlFor="smoke">Smoker</label>
                <select id="smoke" name="smoke" value={formData.smoke} onChange={handleChange}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="alco">Alcohol Intake</label>
                <select id="alco" name="alco" value={formData.alco} onChange={handleChange}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="active">Physically Active</label>
                <select id="active" name="active" value={formData.active} onChange={handleChange}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
          </section>

          <footer className="form-footer">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="loader-container">
                  <span className="loader"></span>
                  Analyzing...
                </span>
              ) : (
                'Generate Risk Report'
              )}
            </button>
          </footer>
        </form>

        {error && <div className="error-banner">{error}</div>}

        {prediction !== null && (
          <div className={`result-overlay ${prediction === 1 ? 'risk-high' : 'risk-low'}`}>
            <div className="result-content">
              <div className="result-icon">
                {prediction === 1 ? '⚠️' : '✅'}
              </div>
              <div className="result-text">
                <h3>{prediction === 1 ? 'Attention Required' : 'Good News'}</h3>
                <p>
                  {prediction === 1
                    ? 'Our assessment indicates a higher risk of cardiovascular disease. We recommend consulting a healthcare professional for a detailed evaluation.'
                    : 'Our assessment indicates a lower risk of cardiovascular disease. Continue maintaining a healthy lifestyle!'}
                </p>

                {/* Display additional prediction details */}
                <div className="prediction-details">
                  <div className="detail-item">
                    <span className="detail-label">Prediction Result:</span>
                    <span className="detail-value">{prediction === 1 ? 'High Risk' : 'Low Risk'}</span>
                  </div>

                  {predictionData?.probability !== undefined && (
                    <div className="detail-item">
                      <span className="detail-label">Confidence:</span>
                      <span className="detail-value">{(predictionData.probability * 100).toFixed(1)}%</span>
                    </div>
                  )}

                  {predictionData?.confidence !== undefined && (
                    <div className="detail-item">
                      <span className="detail-label">Model Confidence:</span>
                      <span className="detail-value">{(predictionData.confidence * 100).toFixed(1)}%</span>
                    </div>
                  )}

                  {formData.height && formData.weight && (
                    <div className="detail-item">
                      <span className="detail-label">Calculated BMI:</span>
                      <span className="detail-value">
                        {(parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2)).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => { setPrediction(null); setPredictionData(null); }} className="dismiss-btn">Dismiss</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeartDiseaseForm;
