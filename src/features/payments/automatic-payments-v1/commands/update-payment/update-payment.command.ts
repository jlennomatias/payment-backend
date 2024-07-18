export class UpdateAutomaticPaymentsV1Command {
  payment_id: string
  status?: string
  transaction_identification?: string
  rejection_code?: string
  rejection_detail?: string
  cancelled_reason?: string
  cancelled_from?: string
  cancelled_at?: string
  cancelled_by_identification?: string
  cancelled_by_rel?: string
}
