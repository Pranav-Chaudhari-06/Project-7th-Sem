import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SketchfabViewer from './SketchfabViewer'; // Import Sketchfab viewer component

const modelData = [
  { id: '7054d2d8710b4213ad3857c1e37e57ec', title: 'Modern House' },
  { id: '9da074958dba46e88d36c6f0a6c01f62', title: 'Modern' },
  { id: '50300550fbcb47edbd26f000e3d6c288', title: 'Modern House 01' },
  { id: '10b2bb7a9e3f4491b5caa278eb4aae4a', title: 'Modern House Low Poly' },
  { id: '845b9968f599409daadf40bc510b981a', title: 'modern house' },
  { id: '501ba9c13b434bc8bd1bec0fdda10789', title: 'Modern House' },
  { id: '4a056c19541d46288c267199d6fa7814', title: 'Modern House' },
  { id: '9f0dc07f5c084e189dfa9ecdbcbfb6f2', title: 'modern house' },
  { id: '3e497f7b3ec5410e9a2ffe0b2490cc0e', title: 'modern house' }
];

function PopularModelsPage() {
  return (
    <div className="mx-5">
      <h2 className="text-center mb-4">Popular House Models</h2>
      <Row>
        {modelData.map((model) => (
          <Col key={model.id} md={4} className="mb-4">
            <SketchfabViewer modelId={model.id} title={model.title} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default PopularModelsPage;
