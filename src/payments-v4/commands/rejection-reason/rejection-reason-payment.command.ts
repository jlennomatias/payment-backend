export class RejectionReasonPaymentsV4Command {
  paymentId: string;
  status: string;
  rejectionReason: {
    code: string;
    detail: string;
  };
}
