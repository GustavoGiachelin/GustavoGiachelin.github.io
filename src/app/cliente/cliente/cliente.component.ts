import { Component, OnInit, Input, Query  } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Cliente } from '../cliente';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Servico } from 'src/app/servico/servico';
import { query } from '@angular/animations';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss','../../app.component.scss']
})
export class ClienteComponent implements OnInit {

  constructor(private db: AngularFireDatabase) { }

  clientesRef: AngularFireList<any>;
  clientes: Observable<any>;
  vencimentosRef: AngularFireList<any>;
  vencimentos: Observable<any>;
  cliente: Cliente;
  vctos: Array<Servico> = [];
  key: string = '';
  filter: string = '';
  title: string = '';
  qtdVencidos:number=0;

  servicosRef: AngularFireList<any>;
  servicos: Observable<any>;
  relatorios: Array<Servico> = [];
  mes:string;
  ano:string;

  valorTotal:number = 0;
  valorTotalDescontos:number = 0;
  valorCaixa:number = 0;
  valorDedetizacao:number = 0;
  qtdServicos:number = 0;


  ngOnInit(): void {
    this.cliente = new Cliente();
    this.db_getAll();
    this.db_getVencidos();

    var pipe = new DatePipe('en-US'); // Use your own locale
    var oneYear = new Date();
    oneYear.setMonth(oneYear.getFullYear() - 1).toLocaleString();
    var dateVcto = pipe.transform(oneYear,"yyyy-MM-dd")
    
    this.vencimentos.forEach(vcto =>{
      vcto.forEach(vc => {
        if(vc.dataRealizacao < dateVcto && vc.vctoUmAno){
          this.vctos.push(vc);
          this.qtdVencidos +=1;
        }
      });
    })
    
    var sixMonths = new Date();
    sixMonths.setMonth(sixMonths.getMonth() - 6).toLocaleString();
    var dateVcto = pipe.transform(sixMonths,"yyyy-MM-dd")
    this.vencimentos.forEach(vcto =>{
      vcto.forEach(vc => {
        if(vc.dataRealizacao < dateVcto && vc.vctoSeisMeses){
          this.vctos.push(vc);
          this.qtdVencidos +=1;
        }
      });
    });
  }

  onSubmit() {
    if (this.key) {
      this.db_update(this.cliente, this.key);
    } else {
      this.db_insert(this.cliente);
    }
    this.key = "";
    this.cliente = new Cliente();
    this.db_getAll();
  }

  delete(key: string) {
    this.db_delete(key);
  }

  edit(isEdit:boolean,cliente?: Cliente, key?: string) {
    //this.changeCliente(cliente, key);
    if(isEdit){
      this.title = "Editando " + cliente.nome;
      this.cliente = cliente;
      this.key = key;
    }
    else{
      this.title = "Inserindo novo Cliente"
    }
    $("#list").hide();
    $("#gif").show();
    setTimeout(()=>{  
      $("#gif").hide();
      $("#edit").show();
    }, 250);
  }

  return(){
    $("#edit").hide();
    $("#vencidos").hide();
    $("#relatorio").hide();
    $("#gif").show();
    setTimeout(()=>{  
      $("#gif").hide();
      $("#list").show();
    }, 250);
    this.cliente = new Cliente;
    this.key = "";
  }
  
  showVencimentos(){
    $("#list").hide();
    $("#gif").show();
    setTimeout(()=>{  
      $("#gif").hide();
      $("#vencidos").show();
    }, 250);
  }
  showRelatorio(){
    $("#list").hide();
    $("#gif").show();
    setTimeout(()=>{  
      $("#gif").hide();
      $("#relatorio").show();
    }, 250);
  }


  //FUNÇÕES GENERICAS DO CRUD
  db_insert(cliente: Cliente) {
    console.log('Cliente ->' , cliente);
    this.db.list('cliente').push(cliente)
      .then((result: any) => {
        console.log(result.key);
      });
      
  }

  db_update(cliente: Cliente, key: string) {
    this.db.list('cliente').update(key, cliente)
      .catch((error: any) => {
        console.error(error);
      });
      this.return();
  }

  db_getAll() {
    this.filter = "";
    this.clientesRef = this.db.list('cliente');
    this.clientes = this.clientesRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    //this.db.list<Cliente>('cliente');
  }

  db_getVencidos() {
    
    this.filter = "";
    // this.vencimentosRef = this.db.list("servico", ref => ref.orderByChild("isLast").equalTo(true));
    this.vencimentosRef = this.db.list("servico",ref=>ref.orderByChild("dataRealizacao"));
    this.vencimentos = this.vencimentosRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
        );

        
    }

  db_delete(key: string) {
    if(window.confirm("Deseja mesmo deletar esse registro?")){
      this.db.object(`cliente/${key}`).remove();

    this.servicosRef = this.db.list("servico", ref => ref.orderByChild("clientKey").equalTo(key));
    this.servicos = this.servicosRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    this.servicos.forEach(servico=>{
      servico.forEach(s => {
        this.db.object(`servico/${s.key}`).remove();
      });
    });
    }
  }

  filter_client(){
      // Declare variables
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("filtro");
      filter = input.value.toUpperCase();
      table = document.getElementById("listClients");
      tr = table.getElementsByTagName("tr");

      // Loop through all table rows, and hide those who don't match the search query
      for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[0];
          if (td) {
              txtValue = td.textContent || td.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
              } else {
                  tr[i].style.display = "none";
              }
          }
      }
  }

  db_getServicos() {
    this.relatorios = [];
    this.valorTotal = 0;
    this.valorCaixa = 0;
    this.valorDedetizacao = 0;
    this.valorTotalDescontos = 0;

    var pipe = new DatePipe('en-US'); // Use your own locale
    var mes = this.parseMes()
    var start = new Date(parseInt(this.ano),mes,1);
    var end = new Date(parseInt(this.ano),mes+1,1);

    var startDate = pipe.transform(start,"yyyy-MM-dd")
    var finalDate = pipe.transform(end,"yyyy-MM-dd")
    
    //this.db.list<Servico>('servico');
    this.servicosRef = this.db.list("servico");
    this.servicos = this.servicosRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    this.servicos.forEach(serv =>{
      serv.forEach(vc => {
        if(vc.dataRealizacao >= startDate && vc.dataRealizacao < finalDate){
          this.relatorios.push(vc);
          this.qtdServicos +=1;
          this.valorTotal +=vc.valorTotal;
          this.valorCaixa += vc.valorCaixa;
          this.valorDedetizacao += vc.valorDedetizacao;
          this.valorTotalDescontos += vc.desconto;
        }
      });
    })
  }
  parseMes(){
    switch(this.mes){

      case "Janeiro": return 0; break;
      case "Fevereiro": return 1; break;
      case "Março": return 2; break;
      case "Abril": return 3; break;
      case "Maio": return 4; break;
      case "Junho": return 5; break;
      case "Julho": return 6; break;
      case "Agosto": return 7; break;
      case "Setembro": return 8; break;
      case "Outubro": return 9; break;
      case "Novembro": return 10; break;
      case "Dezembro": return 11; break;
    }
  }
}
