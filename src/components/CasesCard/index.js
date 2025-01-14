import React from 'react';
import styled from 'styled-components';
import { CMLine } from '../../third-party/senze-graphs/dist';
import {
  mildPreferences,
  moderatePreferences,
  severePreferences,
} from '../../global';

const CasesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Tile = styled.div`
  background-color: #fff;
  cursor: pointer;
  width: 32.5%;
  height: 7.25rem;
  padding: 0 1.25rem;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  @media (max-width: 768px) {
    border: 0;
    width: 33%;
    height: 10.25rem;
    padding: 0;
  }
`;
const Severe = styled(Tile)`
  border: 1px solid;
  border-bottom: ${(props) => (props.selected ? '0.625rem' : '0.3125rem')} solid;
  border-color: ${(props) =>
    props.riskType === 'high'
      ? '#eb2f2f'
      : props.riskType === 'moderate'
      ? '#e5881b'
      : '#657396'};
  @media (max-width: 768px) {
    border: 0;
    border-bottom: 0.625rem solid;
    border-color: ${(props) =>
      props.riskType === 'high'
        ? '#eb2f2f'
        : props.riskType === 'moderate'
        ? '#e5881b'
        : '#657396'};
  }
`;

const Arrow = styled.div`
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  left: 50%;
  transform: translate(-50%);
  @media (min-width: 768px) {
    border-left: 0.625rem solid transparent;
    border-right: 0.625rem solid transparent;
    border-bottom: 0.625rem solid #f2f7fd;
    bottom: -0.62rem;
  }
  @media (max-width: 768px) {
    border-left: 0.625rem solid transparent;
    border-right: 0.625rem solid transparent;
    border-bottom: 0.625rem solid #fff;
    bottom: -0.625rem;
  }
`;

const Title = styled.h5`
  text-align: left;
  text-transform: uppercase;
  font-size: 1.25rem;
  letter-spacing: 0.15em;
  color: #657396;
  margin: 0.875rem 0 0 0;
  @media (max-width: 768px) {
    text-align: center;
    margin: 0.3125rem 0 0 0;
    font-size: 0.875rem;
    line-height: 1.875rem;
  }
`;
const SubTitle = styled.span`
  display: none;
  @media (max-width: 768px) {
    display: block;
    text-align: center;
    color: #657396;
    font-size: 0.8125rem;
    line-height: 1.125rem;
  }
`;

const NumberAndGraphWrap = styled.div`
  display: flex;
  padding-bottom: 0.3125rem;
  align-items: flex-end;
  justify-content: space-between;
  @media (max-width: 768px) {
    display: block;
    padding-bottom: 0;
  }
`;

const GraphAndValueWrap = styled.div`
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    width: 45%;
  }
`;

const Value = styled.h6`
  font-size: 2.25rem;
  margin: 0.3125rem 0;
  color: ${(props) =>
    props.type === 'high'
      ? '#eb2f2f'
      : props.type === 'moderate'
      ? '#e5881b'
      : '#657396'};
  font-weight: bold;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.875rem;
    line-height: 1.875rem;
  }
`;

const CurrentRise = styled.span`
  @media (max-width: 768px) {
    display: block;
    font-weight: bold;
    font-size: 0.875rem;
    line-height: 0.625rem;
    text-align: center;
    letter-spacing: 0.15em;
    color: #657396;
  }
`;

const GraphWrapper = styled.div`
  width: 100%;
  height: 2.75rem;
`;

const CasesCardComponent = (props) => {
  const { changesCases, selectedCases, casesCardData } = props;
  return (
    <CasesWrapper>
      {casesCardData?.map((item, i) => {
        return (
          <Severe
            key={i}
            selected={
              selectedCases?.toLowerCase() === item?.riskType?.toLowerCase()
            }
            riskType={item?.riskType?.toLowerCase()}
            onClick={() => changesCases(item?.riskType)}>
            <Title>{item?.riskType}</Title>
            <SubTitle>Risk</SubTitle>
            <NumberAndGraphWrap>
              <Value type={item?.riskType?.toLowerCase()}>
                {item.numberOfCases}
              </Value>
              <GraphAndValueWrap>
                <CurrentRise>{item?.rises}</CurrentRise>
                <GraphWrapper>
                  <CMLine
                    className="custom-class"
                    data={item?.riskDays}
                    preferences={
                      item?.riskType?.toLowerCase() === 'high'
                        ? severePreferences
                        : item?.riskType?.toLowerCase() === 'moderate'
                        ? moderatePreferences
                        : mildPreferences
                    }
                  />
                </GraphWrapper>
              </GraphAndValueWrap>
            </NumberAndGraphWrap>
            {selectedCases?.toLowerCase() === item?.riskType?.toLowerCase() && (
              <Arrow />
            )}
          </Severe>
        );
      })}
    </CasesWrapper>
  );
};

export default CasesCardComponent;
