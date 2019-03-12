import { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import { addDiaper } from "../actions/Diapers";

const INITIAL_VALUES = {
  model: "",
  size: "",
  availableQty: ""
};

class FormDiaper extends Component {
  constructor(props) {
    super(props);

    this.state = { modal: false, diaper: { ...INITIAL_VALUES } };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState(prevState => ({
      diaper: {
        ...prevState.diaper,
        [name]: value
      }
    }));
  }

  handleSubmit(event) {
    event.preventDefault();

    const { model, size, availableQty } = this.state.diaper;

    this.props.add({ model, size, availableQty: parseInt(availableQty) });

    this.toggle();
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
      diaper: { ...INITIAL_VALUES }
    }));
  }

  render() {
    const { model, size, availableQty } = this.state;
    const { buttonLabel } = this.props;

    return (
      <div>
        <Button color="primary" onClick={this.toggle}>
          {buttonLabel}
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>{buttonLabel}</ModalHeader>
          <ModalBody>
            <Form className="mt-3" onSubmit={this.handleSubmit}>
              <FormGroup>
                <Input
                  type="text"
                  name="model"
                  placeholder="Model"
                  value={model}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="text"
                  name="size"
                  placeholder="Size"
                  value={size}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="number"
                  name="availableQty"
                  placeholder="Quantity"
                  value={availableQty}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
            <Button type="submit" color="primary" onClick={this.handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  add: diaper => dispatch(addDiaper(diaper))
});

export default connect(
  null,
  mapDispatchToProps
)(FormDiaper);
