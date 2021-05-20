import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'cell',
        data: { pageTitle: 'simpleAppSpringApp.cell.home.title' },
        loadChildren: () => import('./cell/cell.module').then(m => m.CellModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
