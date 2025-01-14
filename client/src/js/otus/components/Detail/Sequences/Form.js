import { some } from "lodash-es";
import PropTypes from "prop-types";
import React from "react";
import {
    ModalBody,
    ModalFooter,
    Input,
    InputContainer,
    InputError,
    InputGroup,
    InputIcon,
    InputLabel,
    Loader,
    ModalBodyOverlay,
    SaveButton
} from "../../../../base";
import { getTargetChange } from "../../../../utils/utils";
import { getGenbank } from "../../../api";
import SequenceSegment from "./Segment";
import SequenceField from "./Field";

export class SequenceForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accession: props.accession || "",
            definition: props.definition || "",
            errorAccession: "",
            errorDefinition: "",
            errorSequence: "",
            host: props.host || "",
            pending: false,
            sequence: props.sequence || "",
            segment: props.segment || "",
            targetName: props.targetName || ""
        };
    }

    static propsTypes = {
        dataType: PropTypes.string.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    handleAutofill = () => {
        this.setState({ pending: true }, () => {
            getGenbank(this.state.accession).then(
                resp => {
                    const { accession, definition, host, sequence } = resp.body;

                    this.setState({
                        accession,
                        definition,
                        host,
                        sequence,
                        pending: false,
                        errorAccession: "",
                        errorDefinition: "",
                        errorSequence: ""
                    });
                },
                err => {
                    this.setState({
                        pending: false,
                        error: err.status === 404 ? "Accession not found" : ""
                    });
                    return err;
                }
            );
        });
    };

    handleChange = e => {
        const { name, value, error } = getTargetChange(e.target);

        if (name === "host") {
            return this.setState({ [name]: value });
        }

        if (name === "accession" && some(this.props.sequences, { accession: value })) {
            return this.setState({
                [name]: value,
                [error]: "Accession is already in use"
            });
        }

        this.setState({ [name]: value, [error]: "" });

        if (this.props.error) {
            this.props.onClearError("ADD_SEQUENCE_ERROR");
            this.props.onClearError("EDIT_SEQUENCE_ERROR");
        }
    };

    handleSubmit = e => {
        e.preventDefault();

        const { accession, definition, host, segment, sequence, targetName } = this.state;

        if (!accession.length) {
            return this.setState({ errorAccession: "Accession required" });
        }

        if (!definition.length) {
            return this.setState({ errorDefinition: "Definition required" });
        }

        if (!sequence.length) {
            return this.setState({ errorSequence: "Sequence required" });
        }

        this.props.onSubmit({ accession, definition, host, sequence, segment, targetName });
    };

    render() {
        let overlay;

        if (this.state.pending) {
            overlay = (
                <ModalBodyOverlay>
                    <span>
                        <Loader color="white" />
                    </span>
                </ModalBodyOverlay>
            );
        }

        let segmentSelect;

        if (this.props.dataType !== "barcode") {
            segmentSelect = <SequenceSegment value={this.state.segment} onChange={this.handleChange} />;
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <ModalBody>
                    {overlay}

                    <InputGroup>
                        <InputLabel>Accession (ID)</InputLabel>
                        <InputContainer align="right">
                            <Input
                                name="accession"
                                value={this.state.accession}
                                onChange={this.handleChange}
                                autoFocus
                            />
                            <InputIcon name="magic" onClick={this.handleAutofill} />
                        </InputContainer>
                        <InputError>{this.state.errorAccession}</InputError>
                    </InputGroup>

                    {segmentSelect}

                    <InputGroup>
                        <InputLabel>Host</InputLabel>
                        <Input name="host" value={this.state.host} onChange={this.handleChange} />
                    </InputGroup>

                    <InputGroup>
                        <InputLabel>Definition</InputLabel>
                        <InputContainer>
                            <Input name="definition" value={this.state.definition} onChange={this.handleChange} />
                            <InputError>{this.state.errorDefinition}</InputError>
                        </InputContainer>
                    </InputGroup>

                    <SequenceField
                        name="sequence"
                        sequence={this.state.sequence}
                        onChange={this.handleChange}
                        error={this.state.errorSequence}
                    />
                </ModalBody>
                <ModalFooter>
                    <SaveButton />
                </ModalFooter>
            </form>
        );
    }
}
