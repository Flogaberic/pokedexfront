import { Component } from '@angular/core';
import {ApiService} from "./shared/services/api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pokedexfront';

  constructor(
    public apiService: ApiService,
  ) {
    this.apiService.requestApi('/pokemon').then((pokemons) => {
      console.log(pokemons);
    });
  }
}
