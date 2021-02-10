import React from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import  EmployeeInfo from './components/employee-info/employee-info';
import  NoEmployee from './components/no-employee/no-employee';
import { Button, Container, Form, Row, Col, InputGroup } from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormSubmitted: false,
      searchInput: null,
      employeeReports: [],
      employeeFound: false,
      hasError: false,
    }
  }

  handleFormSubmit = (event) => {
    const { searchInput } = this.state;
    this.setState({
      isFormSubmitted: false,
      employeeReports: [],
    })
    this.fetchEmployeeReports(searchInput)
    event.preventDefault();
  }

  handleNameInput = (event) => {
    this.setState({
      isFormSubmitted: false,
      searchInput: event.target.value,
    })
  }

  fetchEmployeeReports(employeeName) {
    const requestOptions = {
      method: "GET"
    };
    const fetchUrl = "http://api.additivasia.io/api/v1/assignment/employees/" + employeeName;

    fetch(fetchUrl, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if(response.status === 404) {
          return Promise.reject('error 404')
        }
      })
      .then(
        result => {
          const employeeReportsList = result.find(item => item.hasOwnProperty('direct-subordinates'));
          
          if (employeeReportsList) {
            const newList = this.state.employeeReports.concat(employeeReportsList['direct-subordinates']);
            const uniqueList = newList.filter(function(elem, index, self) {
              return index === self.indexOf(elem);
            });

            this.setState({
              isFormSubmitted: true,
              employeeReports: employeeReportsList ? uniqueList : [],
              employeeFound: true,
            });
            employeeReportsList['direct-subordinates'].map(item => {this.fetchEmployeeReports(item);})
          }
          else {
            this.setState({
              isFormSubmitted: true,
              employeeFound: true,
            });
          }
        }, error => {
          this.setState({
            isFormSubmitted: true,
            employeeReports: [],
            employeeFound: false,
          });
        }
      )
  }

  getEmployeeOverview() {
    const { employeeReports, employeeFound, searchInput } = this.state;
    return employeeFound ? <EmployeeInfo employeeName={searchInput} employeeReports={employeeReports} /> : <NoEmployee />;
  }


  render() {
    const { isFormSubmitted } = this.state;

    return (
      <Container>
        <Row>
          <Col><h3>Employee Explorer</h3></Col>
        </Row>
        <Row>
          <Col>
            <Form onSubmit={this.handleFormSubmit}>
              <Form.Group>
                  <InputGroup >
                      <Form.Control
                          type="text"
                          placeholder="Search for Employee"
                          onChange={this.handleNameInput}
                      />
                      <InputGroup.Append> 
                      <Button variant="primary" type="submit">SEARCH</Button>
                      </InputGroup.Append>
                  </InputGroup>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          {isFormSubmitted && this.getEmployeeOverview()}
        </Row>
      </Container>
    );
  }
}

export default App;
