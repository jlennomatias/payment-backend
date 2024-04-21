export class GetDictDto {
  key: string;
  keyType: string;
  account: {
    branch: number;
    accountNumber: string;
    accountType: string;
    participant: string;
    openingDate: string;
  };
  owner: {
    type: string;
    taxIdNumber: string;
    name: string;
  };
  endtoendid: string;
  creationDate: string;
  keyOwnershipDate: string;
}
