import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen bg-authentification bg-cover">
      <img src="/img/logo_pokémon_noir 1.png" class="w-1/4 mx-auto">
      <div class="flex items-center justify-center">
        <button class="btn bg-btn_github hover:bg-btn_github border-0 uppercase text-white rounded-none px-16 py-4 w-1/4 my-auto" (click)="login()">
          <span>Connexion avec Github</span>
        </button>
      </div>
    </div>
  `
})
export class LoginComponent {
  constructor(private apiService: ApiService) {}

  async login() {
    await this.apiService.redirectToGithub();
  }
}
