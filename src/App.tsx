import React, {useCallback, useState, useEffect} from 'react';
import Button from '@mui/material/Button'
import styled from "@emotion/styled";

import './App.css';
import {selectFighters, selectPokemon} from "./features/pokemon/pokemonSlice";
import {useGetPokemonByNameQuery} from "./app/services/pokemon";
import {capitalizeFirstLetter, getTwoUniqueRandomNumbers, convertToTitleCase} from "./utils/utils";
import {useAppDispatch, useAppSelector} from "./app/reduxHooks";
import {clearFighters, appendLog} from './features/pokemon/pokemonSlice';

import Pokemon from "./components/Pokemon";
import BattleLog from "./components/BattleLog";
import {PokemonInfo} from "./types";

const Arena = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  border: 5px solid dodgerblue;
  border-radius: 10px;
  flex: 1;
`;

const ActionsContainer = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: row;
  height: 200px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  height: 100%;  
`;

const generateBattleResult = (winner: string, loser: string, move: string) => {
  return `${winner} lands a decisive blow with ${convertToTitleCase(move)} knocking out ${loser}!`;
};

const App = () => {
  const pokemon = useAppSelector(selectPokemon);
  const fighters = useAppSelector(selectFighters);
  const dispatch = useAppDispatch();
  const [challengers, setChallengers] = useState<string[]>([]);
  const [homeAttack, setHomeAttack] = useState(false);
  const [awayAttack, setAwayAttack] = useState(false);
  const [fightEnded, setFightEnded] = useState(false);

  useGetPokemonByNameQuery('');

  const getChallengers = useCallback(() => {
    if (pokemon?.length) {
      const [home, away] = getTwoUniqueRandomNumbers(0, pokemon.length - 1);
      return [pokemon[home], pokemon[away]];
    }

    return [];
  }, [pokemon]);

  useEffect(() => {
    setChallengers(getChallengers());
  }, [getChallengers]);

  const nextBattle = useCallback(() => {
    setChallengers([]);
    dispatch(clearFighters());
  }, [dispatch]);

  const logWinner = useCallback(() => {
    if (Object.keys(fighters).length === 2 && fightEnded) {
      const fightersArray: [string, PokemonInfo][] = Object.entries(fighters);
      const fighterOneName = capitalizeFirstLetter(fightersArray[0][0]);
      const fighterTwoName = capitalizeFirstLetter(fightersArray[1][0]);
      const fighterOnePower = fightersArray[0][1].selectedMove.power;
      const fighterTwoPower = fightersArray[1][1].selectedMove.power;

      let result;
      if (fighterOnePower === fighterTwoPower) {
        result = `It's a draw between ${fighterOneName} and ${fighterTwoName}!`;
      } else if (fighterOnePower > fighterTwoPower) {
        result = generateBattleResult(fighterOneName, fighterTwoName, fightersArray[0][1].selectedMove.name);
      } else {
        result = generateBattleResult(fighterTwoName, fighterOneName, fightersArray[1][1].selectedMove.name);
      }

      dispatch(appendLog(result));
    }
  }, [fighters, fightEnded, dispatch]);

  const fight = useCallback(() => {
    setHomeAttack(true);
    setTimeout(() => {
      setAwayAttack(true);
      setFightEnded(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (fightEnded) {
      logWinner();
    }
  }, [fightEnded, logWinner]);

  useEffect(() => {
    if (Object.keys(fighters).length <= 0) {
      const challengers = getChallengers();
      setChallengers(challengers);
      setAwayAttack(false);
      setHomeAttack(false);
      setFightEnded(false);
    }
  }, [fighters, getChallengers]);

  return (
    <div className="App">
      <Arena>
        {challengers?.length === 2 &&
        <>
            <Pokemon name={challengers[0]} isAttacking={homeAttack}/>
            <Pokemon name={challengers[1]} isLeft isAttacking={awayAttack}/>
        </>
        }
      </Arena>
      <ActionsContainer>
        <BattleLog/>
        <ButtonContainer>
          <Button disabled={fightEnded || Object.keys(fighters).length < 2} variant="contained"
                  onClick={fight}>Start Battle!</Button>
          <Button disabled={!fightEnded} onClick={nextBattle}>Next Battle!</Button>
        </ButtonContainer>
      </ActionsContainer>
    </div>
  );
}

export default App;
