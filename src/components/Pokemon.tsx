import {useMemo, useEffect} from 'react';
import styled from "@emotion/styled";
import Chip from '@mui/material/Chip';

import {useGetPokemonByNameQuery, useGetPokemonMoveByNameQuery} from '../app/services/pokemon'
import {capitalizeFirstLetter, convertToTitleCase, randomIntFromInterval} from "../utils/utils";
import {useAppDispatch} from "../app/reduxHooks";
import {addFighterInfo} from "../features/pokemon/pokemonSlice";
import Background from '../background.gif';

interface ICProps {
  isLeft?: boolean
  isAttacking?: boolean
}

const Image = styled.img<ICProps>`
  height: 35vh;
  ${(props: ICProps) => props.isAttacking ? `transform: ${props.isLeft ? 'scale(-1.75, 1.75)' : 'scale(1.75)'};` :
  `transform: ${props.isLeft ? 'scaleX(-1)' : ''};`}
  overflow: hidden;
   transition: all 0.5s ease-out;
`;

const ImageContainer = styled.div<ICProps>`
  text-align: ${(props: ICProps) => props.isLeft ? 'left' : 'right'};
  flex: 1;
`;

const Container = styled.div<ICProps>`
  display: flex;
  flex-direction: ${(props: ICProps) => props.isLeft ? 'row-reverse' : 'row'};
  overflow: hidden;
  flex: 1;
`;

const Action = styled.div`
  border: 3px solid black;
  border-radius: 15px;
  margin: auto 10%;
  padding: 20px;
  font-weight: bold;
  font-size: 30px;
  align-content: center;
  background-color: white;
`;

const StyledChip = styled(Chip)`
  margin-left: 20px;
`;

/**
 * Displays a Pokemon at rest and attacking
 * @param name Name of the Pokemon
 * @param isLeft Side of the screen the Pokemon should be on
 * @param isAttacking Pokemon is attacking
 * @constructor
 */
const Pokemon = ({
                   name,
                   isLeft,
                   isAttacking,
                 }: {
  name: string
  isLeft?: boolean
  isAttacking?: boolean
}) => {
  const {data, error, isLoading} = useGetPokemonByNameQuery(name);
  const dispatch = useAppDispatch();

  const move = useMemo(() => {
    if (data?.moves?.length) {
      return data.moves[randomIntFromInterval(0, data.moves.length - 1)]
    }
  }, [data]);


  const {data: moveData} = useGetPokemonMoveByNameQuery(move?.move?.name);

  useEffect(() => {
    if (moveData && Object.keys(moveData).length) {
      const info = {...data, selectedMove: moveData};
      dispatch(addFighterInfo(info))
    }
  }, [moveData]);

  return (
    <>
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <Container isLeft={isLeft} style={isAttacking ? {
          backgroundImage: "url(" + Background + ")",
          backgroundSize: "cover",
        } : undefined}>
          <Action>
            {capitalizeFirstLetter(name)}
            <StyledChip color={isLeft ? "success" : "primary"}
                        label={`${convertToTitleCase(move?.move?.name)}: ${moveData?.power ?? 0}`}/>
          </Action>
          <ImageContainer isLeft={isLeft}>
            <Image isLeft={isLeft} isAttacking={isAttacking} src={data.sprites.front_shiny}
                   alt={data.species.name}/>
          </ImageContainer>
        </Container>
      ) : null}
    </>
  )
};

export default Pokemon;
