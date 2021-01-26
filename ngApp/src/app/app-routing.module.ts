import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { ThreadListComponent } from './thread-list/thread-list.component';
import { ThreadMgmtComponent } from './thread-mgmt/thread-mgmt.component';
import { ThreadComponent } from './thread/thread.component';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'threads',
    pathMatch: 'full'
  },
  {
    path: 'threads/:id',
    children: [
      { path: '', redirectTo: '1', pathMatch: 'full' },
      { path: ':page', component: ThreadComponent }
    ]
  },
  {
    path: 'threads',
    component: ThreadListComponent
  },
  {
    path: 'search',
    children: [
      { path: '', component: SearchComponent  },
      { path: ':id', component: SearchComponent  }
    ]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    children: [
      { path: '', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: ':id', component: ProfileComponent },
      { path: ':id/posts', component: ProfileComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['admin']
    },
    children: [
      { path: '', redirectTo: 'threads', pathMatch: 'full' },
      { path: 'threads', component: ThreadMgmtComponent },
      { path: 'users', component: UserMgmtComponent }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  AdminPanelComponent,
  LoginComponent,
  PageNotFoundComponent,
  ProfileComponent,
  RegisterComponent,
  SearchComponent,
  ThreadListComponent,
  ThreadMgmtComponent,
  ThreadComponent,
  UserMgmtComponent
]
