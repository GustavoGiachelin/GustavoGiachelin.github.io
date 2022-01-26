import { Component, OnInit, Input  } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Servico } from '../servico';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  templateUrl: './servico.component.html',
  styleUrls: ['../../app.component.scss']
})
export class ServicoComponent implements OnInit {

  constructor(private db: AngularFireDatabase,private route: ActivatedRoute) { }

  servicosRef: AngularFireList<any>;
  servicos: Observable<any>;
  servico: Servico;
  key: string = '';
  filter: string = '';
  clienteId: string = "";
  clienteNome: string = "";
  clienteTelefone: string = "";
  title: string = '';
  public tipoServico: string = '';
  public parcelas: string = '1';

  isConcreto:boolean=false;
  isFerro:boolean=false;
  isInox:boolean=false;
  isPolipropileno:boolean=false;
  isFibra:boolean=false;
  isAmianto:boolean=false;

  ngOnInit(): void {
    this.clienteId = this.route.snapshot.paramMap.get("id");
    this.clienteNome = this.route.snapshot.paramMap.get("nome");
    this.clienteTelefone = this.route.snapshot.paramMap.get("telefone");
    this.servico = new Servico();
    this.db_getAll();
    console.log("Lista ->", this.servicos);
    this.title = "Serviços prestados ao cliente: " +this.clienteNome;
  }

  setService(){
    if(this.tipoServico == "1"){
      this.servico.tipoServico = "Caixa D'água";
    }else if(this.tipoServico == "2"){
      this.servico.tipoServico = "Dedetização";
    }else if(this.tipoServico == "3"){
      this.servico.tipoServico = "Caixa D'água e Dedetização";
    }
  }
  setParcelas(){
      this.servico.parcelas = this.parcelas;
  }

  setMaterial(tipo:string){
    if(tipo == "ferro"){
      this.isFerro = !this.isFerro;
    }
    if(tipo == "inox"){
      this.isInox = !this.isInox;
    }
    if(tipo == "concreto"){
      this.isConcreto = !this.isConcreto;
    }
    if(tipo == "amianto"){
      this.isAmianto = !this.isAmianto;
    }
    if(tipo == "polipropileno"){
      this.isPolipropileno = !this.isPolipropileno;
    }
    if(tipo == "fibra"){
      this.isFibra = !this.isFibra;
    }
  }

  onSubmit() {
    this.servico.nomeCliente = this.clienteNome;
    this.servico.telefoneCliente = this.clienteTelefone;
    this.servico.clientKey = this.clienteId;
    this.servico.valorTotal = (this.servico.valorDedetizacao + this.servico.valorCaixa) - this.servico.desconto;
    this.servico.isAmianto = this.isAmianto;
    this.servico.isFerro = this.isFerro;
    this.servico.isConcreto = this.isConcreto;
    this.servico.isFibra = this.isFibra;
    this.servico.isPolipropileno = this.isPolipropileno;
    this.servico.isInox = this.isInox;
    this.servico.vctoSeisMeses = $("#6meses").is(":checked");
    this.servico.vctoUmAno = $("#1ano").is(":checked");
    if(this.servico.dataRealizacaoDedetizacao !=null){
      this.servico.dataRealizacao = this.servico.dataRealizacaoDedetizacao;
    }
    if(this.servico.dataRealizacaoCaixa !=null){
      this.servico.dataRealizacao = this.servico.dataRealizacaoCaixa;
    }
    
    if (this.key) {
      this.db_update(this.servico, this.key);
    } else {
      this.db_insert(this.servico);
    }
    this.key = "";
    this.servico.valorTotal = 0;
    this.servico.isAmianto = false;
    this.servico.isFerro = false;
    this.servico.isConcreto = false;
    this.servico.isFibra = false;
    this.servico.isPolipropileno = false;
    this.servico.isInox = false;
    this.tipoServico = "";
    this.servico.vctoSeisMeses = false;
    this.servico.vctoUmAno = false;
    this.servico = new Servico();
    this.db_getAll();
    this.updateLast();
  }

  delete(key: string) {
    this.db_delete(key);
  }


  async updateLast() {
    var i = 1
    this.servicos.forEach(serv=>{
      serv.forEach(s => {
        s.isLast = false;
        if(i<serv.length){
          this.db_update(s,s.key)
        }
        i = i+1
      });
    })
  }

  edit(isEdit:boolean,servico?: Servico, key?: string) {
    if(isEdit){
      this.title = "Editando Registro";
      this.servico = servico;
      this.key = key;
      this.tipoServico = this.servico.tipoServico == "Caixa D'água" ? "1" : this.servico.tipoServico == "Dedetização" ? "2" : "3"; 
      
    }
    else{
      this.title = "Inserindo novo Registro"
    }
    //this.changeServico(servico, key);
    $("#list").hide();
    $("#gif").show();
    setTimeout(()=>{  
      $("#gif").hide();
      $("#edit").show();
    }, 250);
  }

  return(){
    $("#edit").hide();
    $("#gif").show();
    setTimeout(()=>{  
      $("#gif").hide();
      $("#list").show();
    }, 250);
  }


  //FUNÇÕES GENERICAS DO CRUD
  db_insert(servico: Servico) {
    console.log('Servico ->' , servico);
    this.db.list('servico').push(servico)
      .then((result: any) => {
        console.log(result.key);
      });
  }

  db_update(servico: Servico, key: string) {
    this.db.list('servico').update(key, servico)
      .catch((error: any) => {
        console.error(error);
      });
  }

  db_getAll() {
    
    //this.db.list<Servico>('servico');
    this.filter = "";
    this.servicosRef = this.db.list("servico", ref => ref.orderByChild("clientKey").equalTo(this.clienteId));
    this.servicos = this.servicosRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  db_delete(key: string) {
    if(window.confirm("Deseja mesmo deletar esse registro?")){
      this.db.object(`servico/${key}`).remove();
    }
  }

}
