import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClienteComponent} from "./cliente/cliente/cliente.component"
import {ServicoComponent} from "./servico/servico/servico.component"

const routes: Routes = [
  { path: '', component: ClienteComponent },
  { path: 'servico/:id/:nome/:telefone', component: ServicoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
