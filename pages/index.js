import { Component } from "react";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import Diapers from "../components/Diapers";
import FormDiaper from "../components/FormDiaper";

class Index extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col md="4" className="mt-5">
            <h3>Diapers</h3>
          </Col>
        </Row>
        <Row>
          <Col md="2" className="mt-5">
            <FormDiaper buttonLabel="Add Model" />
          </Col>
          <Col md="12" className="mt-5">
            <Diapers />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect()(Index);
