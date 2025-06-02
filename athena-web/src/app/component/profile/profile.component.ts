import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Auth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  menuVisible = false;
  isProfileModalVisible = false;
  isSettingsModalVisible = false;

  userProfile = {
    name: '',
    email: '',
    apiKey: '',
    password: '', // New password field
  };

  menuItems = [
    { icon: 'fa fa-user', label: 'View Profile', action: 'viewProfile' },
    { icon: 'fa fa-cog', label: 'Settings', action: 'settings' },
    { icon: 'fa fa-sign-out', label: 'Logout', action: 'logout' },
  ];

  constructor(
    private userService: UserService,
    private auth: Auth, // Inject AngularFire Auth
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      if (user && user.uid) {
        this.userService.getUserData(user.uid).subscribe((userData) => {
          if (userData) {
            this.userProfile.name = userData.name || '';
            this.userProfile.apiKey = userData.apiKey || '';
          }
          this.userProfile.email = user.email || '';
        });
      }
    });
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  saveProfile() {
    const { name, password, apiKey } = this.userProfile;
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      alert('No user is currently logged in.');
      return;
    }

    // Update user profile
    this.userService
      .updateUser({ name, apiKey })
      .then(() => alert('Profile updated successfully!'))
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      });

    // Update password
    if (password) {
      const currentPassword = prompt('Enter current password to update password:');
      if (!currentPassword) {
        alert('Password update canceled.');
        return;
      }

      const credential = EmailAuthProvider.credential(currentUser.email as string, currentPassword);
      reauthenticateWithCredential(currentUser, credential)
        .then(() => updatePassword(currentUser, password))
        .then(() => alert('Password updated successfully!'))
        .catch((error) => {
          console.error('Error updating password:', error);
          alert('Failed to update password.');
        });
    }

    this.closeProfileModal();
  }

  onMenuClick(menuItem: { label: string; action: string }) {
    this.menuVisible = false;

    switch (menuItem.action) {
      case 'viewProfile':
        this.isProfileModalVisible = true;
        break;

      case 'settings':
        this.isSettingsModalVisible = true;
        break;

      case 'logout':
        this.auth.signOut().then(() => this.router.navigate(['/login']));
        break;

      default:
        console.log(`Unknown action: ${menuItem.action}`);
    }
  }

  closeProfileModal() {
    this.isProfileModalVisible = false;
  }

  closeSettingsModal() {
    this.isSettingsModalVisible = false;
  }
}
