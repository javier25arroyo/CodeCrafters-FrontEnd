import { Routes } from "@angular/router";
import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { FondoBonitoComponent } from "./fondo-bonito/fondo-bonito.component";
import { AuthGuard } from "./guards/auth.guard";
import { GuestGuard } from "./guards/guest.guard";
import { IRoleType } from "./interfaces";
import { AccessDeniedComponent } from "./pages/access-denied/access-denied.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { SigUpComponent } from "./pages/auth/sign-up/signup.component";
import { DashboardAdminComponent } from "./pages/dashboard-admin/dashboard-admin.component";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { ProfileComponent } from "./pages/profile/profile.component";


export const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "game-gallery",
    loadComponent: () =>
      import("./game-gallery/game-gallery.component").then(
        (m) => m.GameGalleryComponent
      ),
  },
  {
    path: "dashboard-user",
    loadComponent: () =>
      import("./components/dashboard-usuario/dashboard-usuario.component").then(
        (m) => m.DashboardUsuarioComponent
      ),
  },
  {
    path: "dashboard-admin",
    component: DashboardAdminComponent,
    data: {
      name: "dashboard admin",
      showInSidebar: true,
    },
  },
  {
    path: "signup",
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
  },
  {
    path: "access-denied",
    component: AccessDeniedComponent,
  },
  {
    path: "fondo-bonito",
    component: FondoBonitoComponent,
  },
  {
    path: "app",
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "app",
        redirectTo: "users",
        pathMatch: "full",
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "profile",
          showInSidebar: false,
        },
      },
    ],
  },
];
