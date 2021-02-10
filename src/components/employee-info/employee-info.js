import React from 'react';
import './employee-info.scss';
import { Container, Row, Col } from 'react-bootstrap';

class EmployeeInfo extends React.Component {

    render() {
        const { employeeReports } = this.props;
        return( 
            <Container>
                <Row>
                    <Col><h4>Employee Overview</h4></Col>
                </Row>
                <Row>
                    <Col>{this.getEmployeeHeading()}</Col>
                </Row>
                <Row>
                    {employeeReports ? (
                        <ul>
                            {employeeReports.map(item =>
                                <li key={item}> {item} </li>
                            )}
                        </ul>
                    ) : null}
                </Row>
            </Container>
        )
    }

    getEmployeeHeading() {
        const { employeeName, employeeReports } = this.props;
        return employeeReports.length ? (<p> Subordinates of Employee {employeeName}: </p>) : (<p> No Direct Reports for Employee {employeeName} </p>);
    }
}

export default EmployeeInfo;