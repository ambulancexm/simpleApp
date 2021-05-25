import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'cell',
        data: { pageTitle: 'myCellEntityApp.cell.home.title' },
        loadChildren: () => import('./cell/cell.module').then(m => m.CellModule),
      },
      {
        path: 'mx-cell',
        data: { pageTitle: 'myCellEntityApp.mxCell.home.title' },
        loadChildren: () => import('./mx-cell/mx-cell.module').then(m => m.MxCellModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
