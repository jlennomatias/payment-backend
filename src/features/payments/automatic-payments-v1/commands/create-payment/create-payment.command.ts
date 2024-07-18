import { CreatePaymentsV4Command } from "@features/payments/payments-v4/commands/create-payment/create-payment.command"

export class CreateAutomaticPaymentsV1Command  extends CreatePaymentsV4Command{
  risk_manual_device_id: string
  risk_manual_is_rooted_device: boolean
  risk_manual_screen_brightness: number
  risk_manual_elapsed_time_since_boot: number
  risk_manual_os_version: string
  risk_manual_user_time_zone_offset: string
  risk_manual_language: string
  risk_manual_screen_dimensions_height: number
  risk_manual_screen_dimensions_width: number
  risk_manual_account_tenure: string
  risk_manual_geolocation_latitude: number
  risk_manual_geolocation_longitude: number
  risk_manual_geolocation_type: string
  risk_manual_is_call_in_progress: boolean
  risk_manual_is_dev_mode_enabled: boolean
  risk_manual_is_mock_gps: boolean
  risk_manual_is_emulated: boolean
  risk_manual_is_monkey_runner: boolean
  risk_manual_is_charging: boolean
  risk_manual_is_usb_connected: boolean
  risk_manual_antennal_information: string
  risk_manual_integrity_app_recognition_verdict: string
  risk_manual_integrity_device_recognition_verdict: string
  risk_automatic_last_login_date_time: string
  risk_automatic_pix_key_registration_date_time: string
}
