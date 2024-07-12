export function findDifferencesBetweenAccounts(acc1: any, acc2: any) {
  const differences: any = {};

  if (Number(acc1.ispb) != Number(acc2.ispb))
    differences.ispb = { expected: acc1.ispb, actual: acc2.ispb };
  if (Number(acc1.issuer) != Number(acc2.issuer))
    differences.issuer = {
      expected: acc1.issuer,
      actual: acc2.issuer,
    };
  if (Number(acc1.number) != Number(acc2.number))
    differences.number = {
      expected: acc1.number,
      actual: acc2.number,
    };
  if (acc1.accountType !== acc2.accountType)
    differences.accountType = {
      expected: acc1.accountType,
      actual: acc2.accountType,
    };

  console.log(differences);

  if (Object.keys(differences).length === 0) {
    return [];
  } else {
    throw differences;
  }
}

export function transformValueEnumAccountType(numberAccountType: string) {
  switch (Number(numberAccountType)) {
    case 0:
      return 'CACC';
    case 2:
      return 'SVGS';
    default:
      return null;
  }
}

export function dataFormatEndToEnd(params: string) {
  return params.substring(9, 17).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
}

function formatDateBRtoISO(dateStr: string) {
  const [day, month, year] = dateStr.substring(0, 10).split('/');
  return `${year}-${month}-${day}`;
}

export function convertStatus(dataPayment: any) {
  const currentDate = new Date().toLocaleString('pt-BR');
  const dataAtual = formatDateBRtoISO(currentDate);
  console.log(
    `current: ${currentDate}, dataAtual: ${dataAtual}, dataPagamento: ${dataPayment}`,
  );
}

export function dataFormat(params: any) {
  return params.split('.')[0] + 'Z';
}

export function convertStatusClient(data: string): string {
  const statusMap: { [key: string]: string } = {
    '0': 'ACSC',
    '1': 'RJCT',
    '2': 'RJCT',
    '3': 'RJCT',
    '5': 'PDNG',
    '8': 'ACPD',
    '9': 'RCVD',
  };
  return statusMap[data] || data;
}
