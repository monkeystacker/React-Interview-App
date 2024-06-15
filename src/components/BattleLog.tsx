import React from 'react';
import styled from "@emotion/styled";

import {selectLog} from "../features/pokemon/pokemonSlice";
import {useAppSelector} from "../app/reduxHooks";

const Container = styled.div`
  border: 3px solid black;
  border-radius: 10px;
  flex: 1;
`;

const Title = styled.div`
  background-color: black;
  color: white;
  font-size: 27px;
  font-weight: bold;
  text-align: center;
`;

const LogItem = styled.div`
  text-align: left;
  margin-left: 10px;
  margin-top: 5px;
`;

const LogContainer = styled.div`
  height: 160px;
  overflow: auto;
`;

/**
 * Displays the log of all the battles (stored in the redux state)
 * @constructor
 */
const BattleLog = () => {
  const log = useAppSelector(selectLog);
  return (
    <Container>
      <Title>Battle Log</Title>
      <LogContainer>
        {log.map(item => <LogItem>{item}</LogItem>)}
      </LogContainer>
    </Container>
  )
};

export default BattleLog;
