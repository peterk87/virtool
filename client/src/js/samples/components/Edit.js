/**
 * @license
 * The MIT License (MIT)
 * Copyright 2015 Government of Canada
 *
 * @author
 * Ian Boyes
 *
 * @exports IsolateAdd
 */

import React from "react";
import { get } from "lodash";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { Row, Col, Modal, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

import { editSample } from "../actions";
import { Icon, Button } from "../../base";

const getInitialState = (props) => {
    return {
        name: props.name || "",
        isolate: props.isolate || "",
        host: props.host || "",
    };
};

class EditSample extends React.Component {

    constructor (props) {
        super(props);
        this.state = getInitialState(this.props);
    }

    modalEnter = () => {
        this.setState(getInitialState(this.props))
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onEdit(this.props.id, this.state);
    };

    render () {

        let error;

        if (this.props.error) {
            error = (
                <p className="text-danger">
                    <Icon name="warning" /> {this.props.error}
                </p>
            );
        }

        return (
            <Modal show={this.props.show} onEnter={this.modalEnter} onHide={this.props.onHide}>
                <Modal.Header onHide={this.props.onHide} closeButton>
                    Edit Sample
                </Modal.Header>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <ControlLabel>Name</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={this.state.name}
                                        onChange={(e) => this.setState({name: e.target.value})}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={12} md={6}>
                                <FormGroup>
                                    <ControlLabel>Isolate</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={this.state.isolate}
                                        onChange={(e) => this.setState({isolate: e.target.value})}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={12} md={6}>
                                <FormGroup>
                                    <ControlLabel>Host</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={this.state.host}
                                        onChange={(e) => this.setState({host: e.target.value})}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        {error}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" bsStyle="primary" icon="floppy">
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.samples.detail,
        show: get(state.router.location.state, "editSample", false),
        error: state.samples.editError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onHide: () => {
            dispatch(push({state: {showEdit: false}}));
        },

        onEdit: (sampleId, update) => {
            dispatch(editSample(sampleId, update));
        }
    };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(EditSample);

export default Container;