import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FondoBonitoComponent } from './components/fondo-bonito/fondo-bonito.component';
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
import { GameSequenceComponent } from './pages/games/game-sequence/game-sequence.component';
import { MemoryGameComponent } from './pages/games/memorycard-game/memorycard-game.component';
import { SuggestionComponent } from './pages/suggestion/suggestion.component';
import { AdminSuggestionsComponent } from './pages/admin-suggestions/admin-suggestions.component';
import { PuzzleBoardComponent } from './pages/games/puzzle-board/puzzle-board.component';
import { WordSearchGameComponent } from './pages/games/word-search-game/word-search-game.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { CaregiverDashboardComponent } from './pages/caregiver-dashboard/caregiver-dashboard.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AdminUserListComponent } from './components/admin-user/admin-user-list/admin-user-list.component';
import { AdminUserFormComponent } from './components/admin-user/admin-user-form/admin-user-form.component';
import { AdminUserManagementComponent } from './pages/admin-user-management/admin-user-management.component';
import { MelodyMemoryComponent } from './pages/games/melody-memory/melody-memory.component';
import { CaregiverStatsComponent } from './pages/caregiver-stats/caregiver-stats.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AchievementsComponent } from './pages/achievements/achievements.component';
import { ComputerModeComponent } from './pages/games/chess/computer-mode/computer-mode.component';
import { ChessModeSelectorComponent } from './pages/games/chess/mode-selector/mode-selector.component';
import { UserVsUserComponent } from './pages/games/chess/user-vs-user/user-vs-user.component';
import { GameStatsComponent } from './pages/game-score-stat/game-score-stat.component';
import { TimelineLobbyComponent } from './pages/games/timeline/timeline-lobby/timeline-lobby.component';
import { TimelineBoardComponent } from './pages/games/timeline/timeline-board/timeline-board.component';

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
    path: 'timeline-lobby',
    component: TimelineLobbyComponent,
  },
  {
    path: 'timeline-dashboard',
    component: TimelineBoardComponent,
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
    path: 'caregiver-dashboard',
    component: CaregiverDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [IRoleType.caregiver]
    }
  },
  {
    path: 'caregiver-stats',
    component: CaregiverStatsComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [IRoleType.caregiver]
    }
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
    path: 'word-search-game',
    component: WordSearchGameComponent,
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
    path: 'achievements',
    component: AchievementsComponent,
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
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user, IRoleType.caregiver],
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
  },
  {
    path: 'chess',
    component: ChessModeSelectorComponent,
    canActivate: [AuthGuard],
    data: { authorities: [IRoleType.user] }
  },
  {
    path: 'chess/against-computer',
    component: ComputerModeComponent,
    canActivate: [AuthGuard],
    data: { authorities: [IRoleType.user] }
  },
  {
    path: 'chess/user-vs-user',
    component: UserVsUserComponent,
    canActivate: [AuthGuard],
    data: { authorities: [IRoleType.user] }
  },
  {
    path: 'game-stats',
    component: GameStatsComponent,
  }
];
