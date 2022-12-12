import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'styling-components',
    loadChildren: () =>
      import('./styling-components/styling-components.module').then(m => m.StylingComponentsModule)
  },
  {
    path: 'reactive-code',
    loadChildren: () =>
      import('./reactive-code/reactive-code.module').then(m => m.ReactiveCodeModule)
  },
  { path: '', redirectTo: 'reactive-code', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
