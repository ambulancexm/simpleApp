import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'cell',
        data: { pageTitle: 'myApp.cell.home.title' },
        loadChildren: () => import('./cell/cell.module').then(m => m.CellModule),
      },
      {
        path: 'mx-cell',
        data: { pageTitle: 'myApp.mxCell.home.title' },
        loadChildren: () => import('./mx-cell/mx-cell.module').then(m => m.MxCellModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'myApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'myApp.event.home.title' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'gateway',
        data: { pageTitle: 'myApp.gateway.home.title' },
        loadChildren: () => import('./gateway/gateway.module').then(m => m.GatewayModule),
      },
      {
        path: 'message',
        data: { pageTitle: 'myApp.message.home.title' },
        loadChildren: () => import('./message/message.module').then(m => m.MessageModule),
      },
      {
        path: 'process',
        data: { pageTitle: 'myApp.process.home.title' },
        loadChildren: () => import('./process/process.module').then(m => m.ProcessModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
