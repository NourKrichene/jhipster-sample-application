import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'task',
        data: { pageTitle: 'Tasks' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'collaborater',
        data: { pageTitle: 'Collaboraters' },
        loadChildren: () => import('./collaborater/collaborater.module').then(m => m.CollaboraterModule),
      },
      {
        path: 'file',
        data: { pageTitle: 'Files' },
        loadChildren: () => import('./file/file.module').then(m => m.FileModule),
      },
      {
        path: 'project',
        data: { pageTitle: 'Projects' },
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      {
        path: 'message',
        data: { pageTitle: 'Messages' },
        loadChildren: () => import('./message/message.module').then(m => m.MessageModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
