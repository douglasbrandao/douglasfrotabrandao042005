import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  menuOpen = signal(false);

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCreatePet() {
    this.closeMenu();
    this.router.navigate(['/pet-create']);
  }

  goToCreateTutor() {
    this.closeMenu();
    this.router.navigate(['/tutor-create']);
  }
}
