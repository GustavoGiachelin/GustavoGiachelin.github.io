import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { ClienteComponent } from './cliente/cliente/cliente.component';
import { ServicoComponent } from './servico/servico/servico.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { TelefonePipe } from './telefone.pipe'

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    ServicoComponent,
    TelefonePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
