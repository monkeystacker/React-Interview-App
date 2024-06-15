export type Move = {
  name: string
  url: string
}

export type MoveInfo = {
  power: number
  name: string
}

export type PokemonInfo = {
  name: string
  moves: Move[]
  selectedMove: MoveInfo
}
