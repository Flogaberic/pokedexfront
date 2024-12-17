import { Component } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { Renderer2, OnInit } from '@angular/core';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  constructor(
    public apiService: ApiService,
    private renderer: Renderer2
  ){}

  async loggingout() {
    await this.apiService.logout();
  }

  isDarkMode = false;

  ngOnInit(): void {
    const darkModeSetting = localStorage.getItem('dark-mode');
    if (darkModeSetting === 'true') {
      this.isDarkMode = true;
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      localStorage.setItem('dark-mode', 'true');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      localStorage.setItem('dark-mode', 'false');
    }
  }
}
