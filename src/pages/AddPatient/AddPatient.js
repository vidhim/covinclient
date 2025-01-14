import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  FormGroup,
  Label,
} from 'reactstrap';
import { DashboardLayout } from 'components/common/Layout';
import { InputField } from 'components/common/InputField';

import { getISODate, currentDate, getErrorMessage } from 'utils';
import * as patientService from 'services/patient';
import { GENDER_OPTIONS } from '../../constants';
import { patientValidation } from 'validations';
import { hideSpinner, showSpinner } from 'actions/spinner';
import { routes } from 'routers';
import { LinkButton } from 'components/common/Button';

const AddPatient = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, errors, getValues } = useForm({
    resolver: yupResolver(patientValidation),
    mode: 'onBlur',
  });
  const values = getValues();

  const disabled = useMemo(() => {
    return !(
      values.firstName &&
      values.phone &&
      values.email &&
      Object.keys(errors)?.length < 1
    );
  }, [errors, values]);

  const handleSave = async (patient) => {
    try {
      dispatch(showSpinner());
      await patientService.createPatient(patient);

      history.push(routes.patients.path);
    } catch (err) {
      if (err.response.data) {
        setServerError(err.response.data.message);
      }
    } finally {
      dispatch(hideSpinner());
    }
  };

  return (
    <DashboardLayout>
      <div className="header mb-1 d-flex justify-content-between px-3 py-2">
        <h3 className="page-title">Add New Patient</h3>
      </div>
      <Container>
        <Form onSubmit={handleSubmit(handleSave)}>
          <Row>
            <Col md={{ size: 6 }}>
              <InputField
                title="Cell Phone"
                name="phone"
                required
                error={getErrorMessage(errors, 'phone')}
                innerRef={register}
                defaultValue="+91-"
              />
            </Col>
            <Col md={{ size: 6 }}>
              <InputField
                title="Email"
                name="email"
                type="email"
                required
                error={getErrorMessage(errors, 'email')}
                innerRef={register}
                placeholder="Enter Patient Email ID"
              />
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 6 }}>
              <InputField
                title="First Name"
                name="firstName"
                required
                innerRef={register}
                error={getErrorMessage(errors, 'firstName')}
                placeholder="Enter Patient Full Name"
              />
            </Col>
            <Col md={{ size: 6 }}>
              <InputField
                title="Last Name"
                name="lastName"
                innerRef={register}
                placeholder="Enter Patient Last Name (Optional)"
              />
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 3 }}>
              <FormGroup check row className="mx-0 pl-0">
                <Label>Gender</Label>
                <div className="d-flex mt-2">
                  {GENDER_OPTIONS.map(({ label, value }) => (
                    <InputField
                      key={label}
                      id={value}
                      value={value}
                      name="gender"
                      innerRef={register}
                      title={label}
                      type="radio"
                    />
                  ))}
                </div>
              </FormGroup>
            </Col>
            <Col md={{ size: 3 }}>
              <InputField
                title="Date of Birth"
                name="birthDate"
                innerRef={register}
                type="date"
                max={getISODate(currentDate())}
                placeholder="Select Date"
              />
            </Col>
            <Col md={{ size: 3 }}>
              <InputField
                title="Height"
                name="height"
                innerRef={register}
                error={getErrorMessage(errors, 'height')}
                placeholder="Enter Height"
              />
            </Col>
            <Col md={{ size: 3 }}>
              <InputField
                title="Weight"
                name="weight"
                innerRef={register}
                placeholder="Enter Weight"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputField
                title="Address"
                name="addressOne"
                innerRef={register}
                placeholder="Enter Address"
              />
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 6 }}>
              <InputField
                title="City"
                name="city"
                innerRef={register}
                placeholder="Enter City"
              />
            </Col>
            <Col md={{ size: 4 }}>
              <InputField
                title="State"
                name="state"
                innerRef={register}
                placeholder="Enter State"
              />
            </Col>
            <Col md={{ size: 2 }}>
              <InputField
                title="Postal Code"
                name="zip"
                innerRef={register}
                placeholder="Enter Postal Code"
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              {serverError ? <Alert color="danger">{serverError}</Alert> : null}
              <div className="d-flex justify-content-end">
                <LinkButton
                  to={routes.patients.path}
                  className="btn-cancel mr-2">
                  Cancel
                </LinkButton>
                <Button className="btn-covin" type="submit" disabled={disabled}>
                  Add Patient
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </DashboardLayout>
  );
};

export default AddPatient;
