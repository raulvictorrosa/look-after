import moment from "moment";
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
  ModalHeader,
  Table
} from "reactstrap";
import {
  buyDiaper,
  deleteDiaper,
  editDiaper,
  getDiaperByID,
  getDiapers
} from "../actions/Diapers";

const INITIAL_VALUES = {
  _id: "",
  model: "",
  description: "",
  availableQty: ""
};

class Diapers extends Component {
  constructor(props) {
    super(props);

    this.deleteDiaper = this.deleteDiaper.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.buyItem = this.buyItem.bind(this);
    this.calcEndProd = this.calcEndProd.bind(this);

    this.state = {
      modal: false,
      purchasedQty: 0,
      diaper: { ...INITIAL_VALUES }
    };
  }

  componentDidMount() {
    this.props.fetchDiapers();
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

    const { _id, model, availableQty, description } = this.state.diaper;

    this.props.edit({
      _id,
      model,
      availableQty: parseInt(availableQty),
      description
    });

    this.toggle();
  }

  handleFormValues({
    _id = "",
    model = "",
    description = "",
    availableQty = ""
  }) {
    const { modal } = this.state;

    if (modal) {
      this.setState({ diaper: { ...INITIAL_VALUES } });
    } else {
      this.setState({
        diaper: { _id, model, availableQty, description }
      });
    }

    this.toggle();
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  buyItem(id) {
    this.props.buy(id);
    this.setState(prevState => ({
      purchasedQty: prevState.purchasedQty + 1
    }));
  }

  deleteDiaper(id) {
    if (confirm("Really want to delete this model?")) {
      this.props.delDiaper(id);
    }
  }

  calcEndProd(diaper) {
    const { availableQty, purchasedQty, purchasedTimes } = diaper;
    if (purchasedTimes.length > 0) {
      const diff = purchasedTimes.map((d, index) =>
        moment(purchasedTimes[index + 1]).diff(moment(d))
      );

      let sumDiffs = 0;
      diff.forEach(d => {
        sumDiffs += d;
      });

      const value = (sumDiffs / purchasedQty) * availableQty;

      return `This model will be zeroed in ${moment(value).format("mm")} min`;
    }
  }

  render() {
    const { diapers } = this.props;
    const {
      modal,
      purchasedQty,
      diaper: { model, description, availableQty }
    } = this.state;

    return (
      <>
        You bought {purchasedQty} items
        {diapers && diapers.length > 0 ? (
          <>
            <Table className="table table-hover table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th />
                  <th>Model</th>
                  <th>Description</th>
                  <th>Available Qty</th>
                  <th>Purchased Qty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {diapers.map(diaper => (
                  <tr key={diaper.value._id} style={{ cursor: "pointer" }}>
                    <td>
                      <Button
                        color="primary"
                        onClick={() => this.buyItem(diaper.value._id)}
                        disabled={diaper.value.availableQty <= 0 ? true : false}
                      >
                        Buy
                      </Button>
                    </td>
                    <td onClick={() => this.handleFormValues(diaper.value)}>
                      {diaper.value.model}
                    </td>
                    <td onClick={() => this.handleFormValues(diaper.value)}>
                      {diaper.value.description}
                    </td>
                    <td onClick={() => this.handleFormValues(diaper.value)}>
                      {diaper.value.availableQty}
                    </td>
                    <td onClick={() => this.handleFormValues(diaper.value)}>
                      {diaper.value.purchasedQty}
                    </td>
                    <td>
                      <Button
                        color="primary"
                        onClick={() => this.deleteDiaper(diaper.value._id)}
                      >
                        X
                      </Button>
                    </td>
                    <td>{this.calcEndProd(diaper.value)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Modal
              isOpen={modal}
              toggle={this.toggle}
              className={this.props.className}
            >
              <ModalHeader toggle={this.toggle}>Edit Model</ModalHeader>
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
                      name="description"
                      placeholder="Description"
                      value={description}
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
                <Button
                  type="submit"
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  Save
                </Button>
              </ModalFooter>
            </Modal>
          </>
        ) : (
          <h3>No deaper registred!</h3>
        )}
      </>
    );
  }
}

const mapStateToProps = diapers => ({
  ...diapers
});

const mapDispatchToProps = dispatch => ({
  fetchDiapers: () => dispatch(getDiapers()),
  delDiaper: id => dispatch(deleteDiaper(id)),
  edit: diaper => dispatch(editDiaper(diaper)),
  getByID: id => dispatch(getDiaperByID(id)),
  buy: id => dispatch(buyDiaper(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Diapers);
