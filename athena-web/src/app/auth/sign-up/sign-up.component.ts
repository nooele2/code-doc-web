import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../../components/theme/theme-toggle.component';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule, ThemeToggleComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  onSignUp() {
  console.log('Starting sign-up...');

  this.authService.signUp(this.email, this.password)
    .then((userCredential) => {
      console.log('✅ Signed up:', userCredential.user);
      const uid = userCredential.user.uid;
      return this.userService.createUser(uid, this.email).then(() => {
  console.log('✅ User created in Firestore');
  this.router.navigateByUrl('/login'); // ✅ Navigate here directly
});
    })
    .catch((error) => {
      console.error('❌ Sign-up error:', error);
      this.errorMessage = error.message;
    });
}

}
