export class CreatePixDto {
  valor: number;
  tipo: string;
  idReqSistemaCliente: string;
  tpIniciacao: string;
  prioridadePagamento: number;
  tpPrioridadePagamento: number;
  finalidade: string;
  pagador_ou_recebedor: boolean;
  ispb_destino: string;
  pagador: {
    // ispb: string;
    tpPessoa: string;
    cpfCnpj: string;
    nome: string;
    nrAgencia: string;
    tpConta: string;
    nrConta: string;
  };
  recebedor: {
    // ispb: string;
    tpPessoa: string;
    cpfCnpj: string;
    nome: string;
    nrAgencia: string;
    tpConta: string;
    nrConta: string;
  };
}
