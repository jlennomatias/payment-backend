export class CancelPaymentsV4Command {
  paymentId: string;
  status: string;
  cancellation: {
    reason: string;
    cancelledFrom: string;
    cancelledByIdentification: string;
    cancelledByRel: string;
  };
}
