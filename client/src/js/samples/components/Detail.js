/**
 *
 *
 * @copyright 2017 Government of Canada
 * @license MIT
 * @author igboyes
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { includes } from "lodash";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavItem } from "react-bootstrap";

import { getSample, showRemoveSample } from "../actions";
import { Flex, FlexItem, Icon } from "../../base";
import General from "./General";
import Quality from "./Quality/Quality";
import Analyses from "./Analyses/Analyses";
import RemoveSample from "./Remove";

class SampleDetail extends React.Component {

    static propTypes = {
        detail: PropTypes.object,
        match: PropTypes.object,
        history: PropTypes.object,
        getSample: PropTypes.func,
        showRemove: PropTypes.func,
        remove: PropTypes.func
    };

    componentDidMount () {
        this.props.getSample(this.props.match.params.sampleId);
    }

    render () {

        if (this.props.detail === null) {
            return <div />;
        }

        const detail = this.props.detail;
        const sampleId = this.props.match.params.sampleId;

        let editIcon;

        if (includes(this.props.history.location.pathname, "general")) {
            editIcon = (
                <small style={{paddingLeft: "5px"}}>
                    <Icon
                        bsStyle="warning"
                        name="pencil"
                        tip="Edit Sample"
                        onClick={() => window.console.log("EDIT SAMPLE")}
                    />
                </small>
            );
        }

        return (
            <div>
                <h3 style={{marginBottom: "20px"}}>
                    <Flex alignItems="flex-end">
                        <FlexItem grow={1}>
                            <strong>
                                {detail.name}
                            </strong>
                        </FlexItem>

                        {editIcon}

                        <small style={{paddingLeft: "5px"}}>
                            <Icon
                                bsStyle="danger"
                                name="remove"
                                tip="Remove Sample"
                                onClick={() => this.props.showRemove(sampleId, detail.name)}
                            />
                        </small>
                    </Flex>
                </h3>

                <Nav bsStyle="tabs">
                    <LinkContainer to={`/samples/${sampleId}/general`}>
                        <NavItem>General</NavItem>
                    </LinkContainer>
                    <LinkContainer to={`/samples/${sampleId}/quality`}>
                        <NavItem>Quality</NavItem>
                    </LinkContainer>
                    <LinkContainer to={`/samples/${sampleId}/analyses`}>
                        <NavItem>Analyses</NavItem>
                    </LinkContainer>
                </Nav>

                <Switch>
                    <Redirect from="/samples/:sampleId" to={`/samples/${sampleId}/general`} exact/>
                    <Route path="/samples/:sampleId/general" component={General}/>
                    <Route path="/samples/:sampleId/quality" component={Quality}/>
                    <Route path="/samples/:sampleId/analyses" component={Analyses}/>
                </Switch>

                <RemoveSample name={detail.name} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        detail: state.samples.detail
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getSample: (sampleId) => {
            dispatch(getSample(sampleId));
        },

        showRemove: (sampleId, sampleName) => {
            dispatch(showRemoveSample(sampleId, sampleName));
        }
    };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(SampleDetail);

export default Container;
