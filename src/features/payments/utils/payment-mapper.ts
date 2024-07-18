import { plainToClass } from 'class-transformer'
import { CreateAutomaticPaymentsV1Command } from '../automatic-payments-v1/commands/create-payment/create-payment.command'
import { UpdateAutomaticPaymentsV1Command } from '../automatic-payments-v1/commands/update-payment/update-payment.command'
import { CreatePaymentsV4Command } from 'src/payments-v4/commands/create-payment/create-payment.command'
import { converterLocalInstrumentPix, convertStatus, dataFormatEndToEnd } from 'util/library'
import { UpdatePaymentsV4Command } from 'src/payments-v4/commands/update-payment/update-payment.command'


export const createPaymentCommand = (dto: any): CreatePaymentsV4Command => {
  return plainToClass(CreatePaymentsV4Command, {
    consent_id: dto.consentId,
    proxy: dto.proxy,
    end_to_end_id: dto.endToEndId,
    ibge_town_code: dto.ibgeTownCode,
    status: convertStatus(dataFormatEndToEnd(dto.endToEndId)),
    date: dataFormatEndToEnd(dto.endToEndId),
    local_instrument: dto.localInstrument,
    cnpj_initiator: dto.cnpjInitiator,
    payment_amount: dto.payment.amount,
    payment_currency: dto.payment.currency,
    transaction_identification: dto?.transactionIdentification,
    remittance_information: dto.remittanceInformation,
    authorisation_flow: dto?.authorisationFlow,
    qr_code: dto.qrCode,
    debtor_document: dto.debtorDocument,
    debtor_ispb: dto.debtorAccount.ispb,
    debtor_issuer: dto.debtorAccount.issuer,
    debtor_number: dto.debtorAccount.number,
    debtor_account_type: dto.debtorAccount.accountType,
    creditor_ispb: dto.creditorAccount.ispb,
    creditor_issuer: dto.creditorAccount.issuer,
    creditor_number: dto.creditorAccount.number,
    creditor_account_type: dto.creditorAccount.accountType,
    creditor_document: dto.creditor.cpfCnpj,
    creditor_type: dto.creditor.personType,
    creditor_name: dto.creditor.name,
  })
}

export const createAutomaticPaymentCommand = (
  dto: any,
): CreateAutomaticPaymentsV1Command => {
  return plainToClass(CreateAutomaticPaymentsV1Command, {
    consent_id: dto.recurringConsentId,
    proxy: dto.proxy,
    end_to_end_id: dto.endToEndId,
    ibge_town_code: dto.ibgeTownCode,
    status: convertStatus(dto.date),
    date: dto.date,
    local_instrument: dto.localInstrument,
    cnpj_initiator: dto.cnpjInitiator,
    payment_amount: dto.payment.amount,
    payment_currency: dto.payment.currency,
    transaction_identification: dto?.transactionIdentification,
    remittance_information: dto.remittanceInformation,
    authorisation_flow: dto?.authorisationFlow,
    qr_code: dto.qrCode,
    debtor_document: dto.debtorDocument,
    debtor_ispb: dto.debtorAccount.ispb,
    debtor_issuer: dto.debtorAccount.issuer,
    debtor_number: dto.debtorAccount.number,
    debtor_account_type: dto.debtorAccount.accountType,
    creditor_ispb: dto.creditorAccount.ispb,
    creditor_issuer: dto.creditorAccount.issuer,
    creditor_number: dto.creditorAccount.number,
    creditor_account_type: dto.creditorAccount.accountType,
    creditor_document: dto.creditor?.cpfCnpj || dto.creditors.cpfCnpj,
    creditor_type: dto.creditor?.personType || dto.creditors.personType,
    creditor_name: dto.creditor?.name || dto.creditors.name,
    risk_manual_device_id: dto.riskSignals.manual?.deviceId,
    risk_manual_is_rooted_device: dto.riskSignals.manual?.isRootedDevice,
    risk_manual_screen_brightness: dto.riskSignals.manual?.screenBrightness,
    risk_manual_elapsed_time_since_boot:
      dto.riskSignals.manual?.elapsedTimeSinceBoot,
    risk_manual_os_version: dto.riskSignals.manual?.osVersion,
    risk_manual_user_time_zone_offset:
      dto.riskSignals.manual?.userTimeZoneOffset,
    risk_manual_language: dto.riskSignals.manual?.language,
    risk_manual_screen_dimensions_height:
      dto.riskSignals.manual?.screenDimensions.height,
    risk_manual_screen_dimensions_width:
      dto.riskSignals.manual?.screenDimensions.width,
    risk_manual_account_tenure: dto.riskSignals.manual?.accountTenure,
    risk_manual_geolocation_latitude:
      dto.riskSignals.manual?.geolocation.latitude,
    risk_manual_geolocation_longitude:
      dto.riskSignals.manual?.geolocation.longitude,
    risk_manual_geolocation_type: dto.riskSignals.manual?.geolocation.type,
    risk_manual_is_call_in_progress: dto.riskSignals.manual?.isCallInProgress,
    risk_manual_is_dev_mode_enabled: dto.riskSignals.manual?.isDevModeEnabled,
    risk_manual_is_mock_gps: dto.riskSignals.manual?.isMockGPS,
    risk_manual_is_emulated: dto.riskSignals.manual?.isEmulated,
    risk_manual_is_monkey_runner: dto.riskSignals.manual?.isMonkeyRunner,
    risk_manual_is_charging: dto.riskSignals.manual?.isCharging,
    risk_manual_is_usb_connected: dto.riskSignals.manual?.isUsbConnected,
    risk_manual_antennal_information:
      dto.riskSignals.manual?.antennaInformation,
    risk_manual_integrity_app_recognition_verdict:
      dto.riskSignals.manual?.integrity.appRecognitionVerdict,
    risk_manual_integrity_device_recognition_verdict:
      dto.riskSignals.manual?.integrity.deviceRecognitionVerdict,
    risk_automatic_last_login_date_time:
      dto.riskSignals.automatic?.lastLoginDateTime,
    risk_automatic_pix_key_registration_date_time:
      dto.riskSignals.automatic?.pixKeyRegistrationDateTime,
  })
}

export const createPixCommand = (
  dto: any,
  nameDebtor: string,
): any => {
  return {
    scheduledDatetime:
      dto.status === 'SCHD' ? `${dto.date}T15:00:00.000Z` : undefined,
    initiationType: converterLocalInstrumentPix(dto.local_instrument),
    endToEndId: dto.end_to_end_id,
    amount: parseFloat(dto.payment_amount),
    ispb: dto.creditor_ispb,
    transactionType: '',
    holderAccount: {
      mainRegistrationId: dto.debtor_document,
      bankCode: dto.debtor_ispb,
      branchCode: dto.debtor_issuer,
      accountNumber: dto.debtor_number.slice(0, -1),
      checkDigit: dto.debtor_number.slice(-1),
      accountType:
        dto.debtor_account_type,
      holderName: nameDebtor,
    },
    payeeAccount: {
      mainRegistrationId: dto.creditor_document,
      key: dto.proxy,
      bankCode: dto?.creditor_ispb,
      branchCode: dto?.creditor_issuer,
      accountNumber: dto?.creditor_number.slice(0, -1),
      checkDigit: dto?.creditor_number.slice(-1),
      payeeName: dto.creditor_name,
      accountType:
        dto.creditor_account_type,
    },
    transactionIdentification: dto.transaction_identification || undefined,
    remittanceInformation:
      dto?.remittance_nformation || dto?.remittance_information,
  }
}

export const qrCodeCommand = (dto: any): any => {
  return {
    qrCode: dto.qrCode,
    mainRegistrationId: dto.creditor.cpfCnpj,
    accountNumber: dto.creditorAccount.number.slice(0, -1),
    bankCode: dto.creditorAccount.ispb,
    branchCode: dto.creditorAccount.issuer,
    checkDigit: dto.creditorAccount.number.slice(-1),
  }
}

export const dictCommand = (dto: any): any => {
  return {
    key: dto.proxy,
    mainRegistrationId: dto.creditor?.cpfCnpj || dto.creditors?.cpfCnpj,
    accountNumber: dto.creditorAccount?.number.slice(0, -1),
    bankCode: dto.creditorAccount?.ispb,
    branchCode: dto.creditorAccount?.issuer,
    checkDigit: dto.creditorAccount?.number.slice(-1),
  }
}

export const debtorAccountCommand = (dto: any): any => {
  return {
    mainRegistrationId: dto.debtorDocument,
  }
}

export const cancelPaymentCommand = (
  id: string,
  dto: any,
): UpdatePaymentsV4Command => {
  return plainToClass(UpdatePaymentsV4Command, {
    payment_id: id,
    status: dto?.data?.status || dto.status,
    transaction_identification: dto?.transaction_identification,
    rejection_code: dto?.rejection_code,
    rejection_detail: dto?.rejection_detail,
    cancelled_reason: dto?.data?.reasonCancel,
    cancelled_from: dto?.data?.cancelledFrom || 'INICIADORA',
    cancelled_by_identification:
      dto?.data?.cancellation.cancelledBy.document.identification,
    cancelled_by_rel: dto?.data?.cancellation.cancelledBy.document.rel,
  })
}

export const updatePaymentCommand = (
  id: string,
  dto: any,
): UpdatePaymentsV4Command => {
  return plainToClass(UpdatePaymentsV4Command, {
    payment_id: id,
    status: dto?.data?.status || dto.status,
    transaction_identification: dto?.transaction_identification,
    rejection_code: dto?.rejection_code,
    rejection_detail: dto?.rejection_detail,
  })
}

export const updateAutomaticPaymentCommand = (
  id: string,
  dto: any,
): UpdateAutomaticPaymentsV1Command => {
  return plainToClass(UpdateAutomaticPaymentsV1Command, {
    payment_id: id,
    status: dto?.data?.status || dto.status,
    transaction_identification: dto?.transaction_identification,
    rejection_code: dto?.rejection_code,
    rejection_detail: dto?.rejection_detail,
  })
}
