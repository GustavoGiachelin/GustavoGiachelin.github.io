export class Servico {
    nomeCliente: string = "";
    telefoneCliente: string = "";
    tipoServico: string = ""; //foi
    clientKey: string = ""; //foi
    dataRealizacao: Date; // foi
    dataRealizacaoCaixa: Date; // foi
    dataRealizacaoDedetizacao: Date; // foi
    quantidadeReservatorios: number = 0; //foi
    material: string = ''; //foi
    descricaoServico: string = 'Reservatório ... de .. litros'; //foi
    sisternas: string = ""; //foi
    valorCaixa: number = 0; //foi
    obsCaixa : string = ''; //foi
    paraQue : string = ''; //foi
    local : string = ''; //foi
    valorDedetizacao : number = 0;
    obsDedetizacao : string = ''; //foi
    valorTotal : number = 0; //foi
    isLast:boolean=true; //foi
    isConcreto:boolean=false;
    isFerro:boolean=false;
    isInox:boolean=false;
    isPolipropileno:boolean=false;
    isFibra:boolean=false;
    isAmianto:boolean=false;
    parcelas:string="1";
    desconto:number=0;
    vctoSeisMeses:boolean;
    vctoUmAno:boolean;
}
