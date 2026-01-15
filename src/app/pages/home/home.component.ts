import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div>
      <h1>Pet Manager</h1>
      <p>Autenticação realizada com sucesso!</p>
      <button (click)="logout()">Sair</button>
    </div>
  `
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
