import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FondoBonitoComponent } from './fondo-bonito/fondo-bonito.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { DashboardUsuarioComponent } from './components/dashboard-usuario/dashboard-usuario.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { GameGalleryComponent } from './game-gallery/game-gallery.component';
import { TeamComponent } from './pages/team/team.component';
import { GameSequenceComponent } from './pages/games/game-sequence/game-sequence.component'; 
import { SuggestionComponent } from './pages/suggestion/suggestion.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component'; 

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SigUpComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: 'fondo-bonito',
    component: FondoBonitoComponent,
  },
  {
    path: 'team',
    component: TeamComponent,
  },
  {
    path: 'suggestions',
    component: SuggestionComponent, 
    canActivate: [AuthGuard],      
  },
  {
    path: 'secuencia',
    component: GameSequenceComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [IRoleType.user],
    },
  },
  {
    path: 'game-gallery',
    component: GameGalleryComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [IRoleType.user],
    },
  },
  {
    path: 'dashboard-user',
    component: DashboardUsuarioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [IRoleType.user],
    },
  },

  // 👉 RUTAS QUE USAN AppLayout (sidebar, navbar, etc.)
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: ProfileComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin],
          name: 'Users',
          showInSidebar: true,
        },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'profile',
          showInSidebar: false,
        },
      }
    ],
  },
];
