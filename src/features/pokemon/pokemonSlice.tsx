import {createSlice} from '@reduxjs/toolkit'

import {pokemonApi} from "../../app/services/pokemon";
import {RootState} from '../../app/store'
import {PokemonInfo} from "../../types";

type PokemonState = {
  pokemon: string[]
  fighters: Record<string, PokemonInfo>
  log: string[]
}

type PokemonItem = {
  name: string
  url: string
}
const slice = createSlice({
  name: 'pokemon',
  initialState: {pokemon: [], fighters: {}, log: []} as PokemonState,
  reducers: {
    clearFighters: (state) => {
      state.fighters = {}
    },
    addFighterInfo: (state, action) => {
      if (!Object.keys(state.fighters).length) {
        state.fighters = {
          [action.payload.name]: action.payload,
        }
      } else {
        state.fighters[action.payload.name] = action.payload;
      }
    },
    appendLog: (state, action) => {
      state.log.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      pokemonApi.endpoints.getPokemonByName.matchFulfilled,
      (state, action) => {
        if (!action.meta.arg.originalArgs) {
          state.pokemon = action.payload.results.map((item: PokemonItem) => item.name);
        }
      },
    );
  },
});

export default slice.reducer

export const {clearFighters, addFighterInfo, appendLog} = slice.actions;

export const selectPokemon = (state: RootState) => state.pokemon.pokemon;

export const selectFighters = (state: RootState) => state.pokemon.fighters;

export const selectLog = (state: RootState) => state.pokemon.log;
