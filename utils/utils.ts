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
