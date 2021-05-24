import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';

import { CommunicationButtons } from 'components/CreateEncounter';
import arrowIcon from 'assets/images/svg-icons/arrow-left.svg';
import collapseIcon from 'assets/images/svg-icons/showMore.svg';
import expandIcon from 'assets/images/svg-icons/showLess.svg';
import mobileIcon from 'assets/images/svg-icons/icon-phone.svg';
import checkedIcon from 'assets/images/svg-icons/checkedIcon.svg';
import {
  GENDER_SHORTHAND,
  PATIENT_CURRENT_STATUS,
  RISK,
} from '../../constants';
import { getFormatedDate, handleCallAppointment } from 'utils';
import { INTAKE_FORM_GROUPS } from '../../constants';

const PersonalInfoWrap = styled.div`
  position: relative;
`;

const TopView = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: baseline;
  }
`;

const HiddenView = styled.div`
  display: ${(props) => (props.showMore ? 'flex' : 'none')};
  z-index: 5;
  position: absolute;
  background: #fff;
  width: 100%;
  box-shadow: 0 5px 10px -5px rgba(101, 115, 150, 0.1);
  border-radius: 5px;
  padding: 0 3.75rem 0 3.75rem;
  flex-wrap: wrap;
`;

const Status = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    props.risk === 'High'
      ? '#eb2f2f'
      : props.risk === 'Moderate'
      ? '#e5881b'
      : '#657396'};
  width: 1rem;
  height: 1rem;
  margin-right: 1.25rem;
`;

const PatientNameWrap = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.span`
  font-size: 1.25rem;
  line-height: 1.875rem;
  color: #01518d;
  margin-right: 0.9375rem;
`;
const ShowLessMore = styled.img`
  cursor: pointer;
  margin-top: 0.4rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const CheckIcon = styled.img``;

const RiskLevelWrap = styled.div`
  display: flex;
  position: relative;
  width: 7rem;
  @media (max-width: 768px) {
    margin-bottom: 1.875rem;
  }
  input[type='radio'] {
    -webkit-appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    outline: none;
    border: 1px solid #9fa7ba;
    cursor: pointer;
    margin-left: 0;
  }

  input[type='radio']:before {
    content: '';
    display: block;
    width: 60%;
    height: 60%;
    margin: 20% auto;
    border-radius: 50%;
  }

  input[type='radio']:checked:before {
    background: #22335e;
  }
`;

const Button = styled.button`
  background: #22335e;
  border: 1px solid #657396;
  box-sizing: border-box;
  box-shadow: 0px 3px 0px #657396;
  border-radius: 3px;
  width: 205px;
  height: 2.8125rem;
  font-weight: bold;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  letter-spacing: 0.2em;
  color: #ffffff;
  @media (max-width: 768px) {
    display: none;
  }
`;

const extraCss = css`
  display: flex;
  align-items: center;
`;

const Info = styled.div`
  margin-right: 3.125rem;
  padding: 1rem 0;
  width: ${(props) => (props.width ? props.width : '5%')};
  ${(props) => props.extraCss}
`;
const Label = styled.div`
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: #22335e;
  opacity: 0.5;
  margin-right: ${(props) => (props.margin ? props.margin : '0')};
`;
const Value = styled.div`
  font-size: 1rem;
  line-height: 1.125rem;
  color: #22335e;
  a {
    display: flex;
    align-items: center;
  }
  img {
    width: 0.9375rem;
    height: 0.9375rem;
    margin-right: 0.5rem;
  }
`;

const BackButton = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    font-size: 1rem;
    line-height: 1.25rem;
    color: #657396;
    margin-bottom: 1.5rem;
    img {
      margin-right: 0.625rem;
      margin-top: 0.1rem;
    }
  }
`;

const MobAgeAndGender = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const ShowRiskLevelDropdown = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(101, 115, 150, 0.3);
  border-radius: 5px;
  position: absolute;
  margin-top: 2rem;
  padding: 1.5rem;
  z-index: 10;
  left: -50%;
  width: 15.188rem;
`;

const DropdownContent = styled.div`
  background: ${(props) =>
    props.riskLevel === props.radio ? '#f2f7fd' : '#fff'};
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  cursor: pointer;
  fontsize: 1rem;
  color: ${(props) =>
    props.riskLevel === props.radio ? '#22335E' : '#657396'};
`;

const RiskLevelTextStyle = styled.div`
  font-size: 1rem;
  color: #657396;
`;

export const PersonalInformation = ({
  data,
  setRiskLevel,
  riskLevel,
  handleRiskLevelChange,
  onSave,
  dispatch,
}) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const [showRiskLevel, setShowRiskLevel] = useState(false);
  const radioMenu = Object.values(RISK);
  const toggleShowMore = () => setIsShowMore((state) => !state);
  const toggleRiskLevelIcon = () => setShowRiskLevel((state) => !state);
  const onCall = useCallback(
    () => handleCallAppointment(dispatch, data?.patientId),
    [dispatch, data],
  );

  useEffect(() => {
    setRiskLevel(data?.riskLevel?.toLowerCase());
  }, []);

  return (
    <PersonalInfoWrap>
      <TopView>
        <BackButton onClick={onSave}>
          <img src={arrowIcon} alt="arrow" />
          Back
        </BackButton>
        <PatientNameWrap>
          <Status risk={riskLevel} />
          <Name>{data?.fullName}</Name>
          <ShowLessMore
            src={isShowMore ? expandIcon : collapseIcon}
            onClick={toggleShowMore}
          />
        </PatientNameWrap>
        <MobAgeAndGender>
          <Info extraCss={extraCss} width="auto">
            <Label margin="0.3rem">Gender:</Label>
            <Value>{GENDER_SHORTHAND[data?.gender]}</Value>
          </Info>
          <Info extraCss={extraCss} width="auto">
            <Label margin="0.3rem">Age:</Label>
            <Value>{data?.age || '-'}</Value>
          </Info>
        </MobAgeAndGender>
        <RiskLevelWrap>
          <div
            className="d-flex justify-content-between"
            style={{ width: '100%' }}>
            <RiskLevelTextStyle>{riskLevel}</RiskLevelTextStyle>
            <ShowLessMore
              src={showRiskLevel ? expandIcon : collapseIcon}
              onClick={toggleRiskLevelIcon}
            />
          </div>
          {showRiskLevel && (
            <ShowRiskLevelDropdown>
              {radioMenu.map((radio, index) => {
                return (
                  <DropdownContent
                    radio={radio}
                    key={index}
                    riskLevel={riskLevel}
                    onClick={() => setRiskLevel(radio)}
                    onChange={() => handleRiskLevelChange(radio)}>
                    <div>{radio}</div>
                    {riskLevel === radio && <CheckIcon src={checkedIcon} />}
                  </DropdownContent>
                );
              })}
            </ShowRiskLevelDropdown>
          )}
        </RiskLevelWrap>
        <CommunicationButtons onCall={onCall} />
        <Button onClick={onSave}>SAVE AND CLOSE</Button>
      </TopView>
      <HiddenView showMore={isShowMore}>
        <Info>
          <Label>Gender:</Label>
          <Value>{GENDER_SHORTHAND[data?.gender]}</Value>
        </Info>
        <Info>
          <Label>Age:</Label>
          <Value>{data?.age || '-'}</Value>
        </Info>
        <Info>
          <Label>Height:</Label>
          <Value>{data?.height || '-'}</Value>
        </Info>
        <Info>
          <Label>Weight:</Label>
          <Value>{data?.weight || '-'} kg</Value>
        </Info>
        <Info width="12%">
          <Label>Mobile:</Label>
          <Value>
            <button className="transparent-button d-flex p-0" onClick={onCall}>
              <img src={mobileIcon} alt="mobile" /> {data?.phone}
            </button>
          </Value>
        </Info>
        <Info width="12%">
          <Label>Current Status:</Label>
          <Value>{data?.currentStatus ?? PATIENT_CURRENT_STATUS.ACTIVE}</Value>
        </Info>
        <Info width="12%">
          <Label>Address:</Label>
          <Value>{data?.address || '-'}</Value>
        </Info>
        <Info width="12%">
          <Label>Patient Since:</Label>
          <Value>{getFormatedDate(data.createdDate) || '-'}</Value>
        </Info>
        <Info width="12%">
          <Label>Known Allergies:</Label>
          {data?.[INTAKE_FORM_GROUPS.ALLERGY]?.length > 0 ? (
            <>
              <Value>{data?.[INTAKE_FORM_GROUPS.ALLERGY]?.join(', ')}</Value>
            </>
          ) : (
            <Value>-</Value>
          )}
        </Info>
        <Info width="15%">
          <Label>Pre-Existing Conditions:</Label>
          {data?.[INTAKE_FORM_GROUPS.PRE_EXISTING_CONDITION]?.length > 0 ? (
            <>
              <Value>
                {data?.[INTAKE_FORM_GROUPS.PRE_EXISTING_CONDITION]?.join(', ')}
              </Value>
            </>
          ) : (
            <Value>-</Value>
          )}
        </Info>
        <Info width="12%">
          <Label>Family History:</Label>
          {data?.familyHistory?.length > 0 ? (
            <>
              <Value>{data.familyHistory.join(', ')}</Value>
            </>
          ) : (
            <Value>-</Value>
          )}
        </Info>
      </HiddenView>
    </PersonalInfoWrap>
  );
};
