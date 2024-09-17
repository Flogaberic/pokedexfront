import {Type} from "./type"; // <- here

export interface PokemonVariety {
  base_experience?: number;
  base_stat_attack: number;
  base_stat_defense: number;
  base_stat_hp: number;
  base_stat_special_attack: number;
  base_stat_special_defense: number;
  base_stat_speed: number;
  created_at: string;
  cry_url?: string;
  description: string;
  form_name?: string;
  height: number;
  id: number;
  is_default: boolean;
  name?: string;
  sprites?: {
    artwork_shiny_url?: string;
    artwork_url?: string;
    back_female_url?: string;
    back_shiny_female_url?: string;
    back_shiny_url?: string;
    back_url?: string;
    front_female_url?: string;
    front_shiny_female_url?: string;
    front_shiny_url?: string;
    front_url?: string;
  },
  types?: Type[]; // <- here
  updated_at: string;
  weight: number;
}
