import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start">
      <div className="container-fluid mx-5">
        <Row>
          <Col lg={6} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Immersive Homes</h5>
            <p>Your gateway to the finest 3D models of homes and architecture.</p>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Contact Us</h5>
            <p className="text-dark">contact@immersivehomes.com</p>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Follow Us</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Instagram</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Twitter</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Facebook</a>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </footer>
  );
}

export default Footer;
