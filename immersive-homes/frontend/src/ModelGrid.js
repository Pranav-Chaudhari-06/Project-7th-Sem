import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

const models = [
  { id: 1, name: 'Modern House', author: 'John Doe', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Luxury Apartment', author: 'Jane Smith', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Villa', author: 'Mike Ross', image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Cozy Cottage', author: 'Rachel Zane', image: 'https://via.placeholder.com/150' }
];

function ModelGrid() {
  return (
    <Row>
      {models.map(model => (
        <Col key={model.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
          <Card>
            <Card.Img variant="top" src={model.image} alt={model.name} />
            <Card.Body>
              <Card.Title>{model.name}</Card.Title>
              <Card.Text>By {model.author}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ModelGrid;
