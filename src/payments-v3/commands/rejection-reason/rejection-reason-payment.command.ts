export class RejectionReasonPaymentsV3Command {
  paymentId: string;
  status: string;
  rejectionReason: {
    code: string;
    datail: string;
  };
}
