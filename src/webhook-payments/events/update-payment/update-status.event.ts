export class StatusUpdadeEvent {
  constructor(
    public paymentId: string,
    public status: string,
  ) {}
}
