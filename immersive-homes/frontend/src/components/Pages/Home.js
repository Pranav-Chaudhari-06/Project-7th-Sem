import React from 'react';
import PopularModelsPage from '../../PopularModelsPage';
import Footer from '../Layouts/Footer';

export default function Home() {
  return (
    <>
      {/* Landing Page Introduction */}
      <div className="landing-page-intro text-center py-5" style={{ backgroundColor: '#f1f3f5' }}>
        <div>
          <h1 className="mb-4" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
            Bring Your Blueprints to Life with Virtual Reality
          </h1>
          <p className="mb-4" style={{ fontSize: '1.2rem', color: '#6c757d' }}>
            Experience the future of home design with immersive 3D models and seamless collaboration.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <div className="feature-box p-3" style={{ width: '250px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <h5 className="mb-2">Explore Models</h5>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                View high-quality, interactive 3D models of stunning home designs.
              </p>
            </div>
            <div className="feature-box p-3" style={{ width: '250px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <h5 className="mb-2">Collaborate Seamlessly</h5>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Work with expert architects to design and customize your dream home.
              </p>
            </div>
            <div className="feature-box p-3" style={{ width: '250px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <h5 className="mb-2">Effortless Management</h5>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Track model requests, manage payments, and explore completed projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Models Section */}
      <PopularModelsPage />

      {/* Footer */}
      <Footer />
    </>
  );
}
