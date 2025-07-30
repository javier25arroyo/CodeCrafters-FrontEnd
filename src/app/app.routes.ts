
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
import { DashboardUsuarioComponent } from './pages/dashboard-usuario/dashboard-usuario.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { GameGalleryComponent } from './pages/game-gallery/game-gallery.component';
import { TeamComponent } from './pages/team/team.component';
import { CrosswordGameComponent } from './pages/games/crossword-game/crossword-game.component';
import { GameSequenceComponent } from './pages/games/game-sequence/game-sequence.component';
import { MemoryGameComponent } from './pages/games/memorycard-game/memorycard-game.component';
import { WordSearchGameComponent } from './pages/games/word-search-game/word-search-game.component';
import { SuggestionComponent } from './pages/suggestion/suggestion.component';
import { AdminSuggestionsComponent } from './pages/admin-suggestions/admin-suggestions.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PuzzleBoardComponent } from './pages/games/puzzle-board/puzzle-board.component';
import { WordSearchGameComponent } from './pages/games/word-search-game/word-search-game.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AdminUserListComponent } from './components/admin-user/admin-user-list/admin-user-list.component';
import { AdminUserFormComponent } from './components/admin-user/admin-user-form/admin-user-form.component';
import { AdminUserManagementComponent } from './pages/admin-user-management/admin-user-management.component';
import { MelodyMemoryComponent } from './pages/melody-memory/melody-memory.component';


export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
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
    path: 'admin-suggestions',
    component: AdminSuggestionsComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [IRoleType.admin, IRoleType.superAdmin],
    },
  },
  {
    path: 'puzzle-board',
    component: PuzzleBoardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard-user',
    component: DashboardUsuarioComponent,
    canActivate: [AuthGuard],
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
    path: 'secuencia',
    component: GameSequenceComponent,
    canActivate: [AuthGuard],
  },
  {


  path: 'word-search',
  component: WordSearchGameComponent,
  canActivate: [AuthGuard],
  data: { authorities: [IRoleType.user] },
},

  {
    path: 'crossword',
    component: CrosswordGameComponent,
    canActivate: [AuthGuard],
    data: { authorities: [IRoleType.user] },
  },
  {
    path: 'memorycard-game',
    component: MemoryGameComponent,
    canActivate: [AuthGuard],
    data: { authorities: [IRoleType.user] },
  },
  {
    path: 'admin-suggestions',
    component: AdminSuggestionsComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user]
    }
  },
  {
    path: 'suggestions',
    component: SuggestionComponent,
    canActivate: [AuthGuard],
    data: { authorities: [IRoleType.user] },
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [IRoleType.user],
    },
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: AdminUserListComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin],
          name: 'Users',
          showInSidebar: true,
        },
      },
      {
        path: 'users/edit/:id',
        component: AdminUserFormComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin],
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
      },
    ],
  },
  {
    path: 'users/management',
    component: AdminUserManagementComponent,
    canActivate: [AdminRoleGuard],
    data: {
      authorities: [IRoleType.admin, IRoleType.superAdmin],
      name: 'User Management',
      showInSidebar: false,
    },
  },
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'melody-memory',
    component: MelodyMemoryComponent,
  }
];
