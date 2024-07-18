import { IsString, IsDateString, ValidateNested, IsNumberString, IsBoolean, IsInt, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PaymentDto {
    @IsString()
    @ApiProperty({ description: 'Valor da transação com 2 casas decimais.' })
    amount: string;

    @IsString()
    @ApiProperty({ description: 'Código da moeda nacional segundo modelo ISO-4217' })
    currency: string;
}

class CreditorDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Titular, pessoa natural ou juridica a quem se referem os dados de recebedor (creditor).' })
    personType: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Identificação da pessoa envolvida na transação.' })
    cpfCnpj: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Em caso de pessoa natural deve ser informado o nome completo do titular da conta do recebedor.' })
    name: string
}

class CreditorAccountDto {
    @IsString()
    @ApiProperty({ description: 'Deve ser preenchido com o ISPB (Identificador do Sistema de Pagamentos Brasileiros) do participante do SPI (Sistema de pagamentos instantâneos) somente com números.' })
    ispb: string;

    @IsString()
    @ApiProperty({ description: 'Código da Agência emissora da conta sem dígito.' })
    issuer: string;

    @IsString()
    @ApiProperty({ description: 'Deve ser preenchido com o número da conta transacional do usuário recebedor com digito' })
    number: string;

    @IsString()
    @ApiProperty({ description: 'Tipos de contas usadas para pagamento via Pix.' })
    accountType: string;
}

class DebtorAccountDto {
    @IsString()
    @ApiProperty({ description: 'Deve ser preenchido com o ISPB (Identificador do Sistema de Pagamentos Brasileiros) do participante do SPI (Sistema de pagamentos instantâneos) somente com números.' })
    ispb: string;

    @IsString()
    @ApiProperty({ description: 'Código da Agência emissora da conta sem dígito.' })
    issuer: string;

    @IsString()
    @ApiProperty({ description: 'Deve ser preenchido com o número da conta transacional do usuário recebedor com digito' })
    number: string;

    @IsString()
    @ApiProperty({ description: 'Tipos de contas usadas para pagamento via Pix.' })
    accountType: string;
}

class ScreenDimensionsDto {
    @IsInt()
    @ApiProperty({ description: 'Altura da tela, em pixels.' })
    height: number;

    @IsInt()
    @ApiProperty({ description: 'Largura da tela, em pixels.' })
    width: number;
}

class GeolocationDto {
    @IsNumber()
    @ApiProperty({ description: 'Coordenada latitudial do cliente enquanto logado na iniciadora' })
    latitude: string;

    @IsNumber()
    @ApiProperty({ description: 'Coordenada longitudinal do cliente enquanto logado na iniciadora' })
    longitude: string;

    @IsString()
    @ApiProperty({ description: 'Tipo de mecanismo utilizado na geração da geolocalização' })
    type: string;
}

class IntegrityDto {
    @IsString()
    @ApiProperty({ description: 'Informa a integridade do app' })
    appRecognitionVerdict: string;

    @IsString()
    @ApiProperty({ description: 'Informa a integridade do dispositivo' })
    deviceRecognitionVerdict: string;
}

class ManualRiskSignalsDto {
    @IsString()
    @ApiProperty({ description: 'ID único do dispositivo gerado pela plataforma.' })
    deviceId: string;

    @IsBoolean()
    @ApiProperty({ description: 'Indica se o dispositivo atualmente está com permissão de “root”.' })
    isRootedDevice: boolean;

    @IsInt()
    @ApiProperty({ description: 'Indica o nível de brilho da tela do dispositivo.' })
    screenBrightness: number;

    @IsInt()
    @ApiProperty({ description: 'Indica por quanto tempo (em milissegundos) o dispositivo está ligado.' })
    elapsedTimeSinceBoot: number;

    @IsString()
    @ApiProperty({ description: 'Versão do sistema operacional.' })
    osVersion: string;

    @IsString()
    @ApiProperty({ description: 'Indica a configuração de fuso horário do dispositivo do usuário, com o formato UTC offset: ±hh[:mm]' })
    userTimeZoneOffset: string;

    @IsString()
    @ApiProperty({ description: 'Indica o idioma do dispositivo no formato ISO 639-1.' })
    language: string;

    @ValidateNested()
    @Type(() => ScreenDimensionsDto)
    @ApiProperty({ description: 'Dimensões da tela do dispositivo' })
    screenDimensions: ScreenDimensionsDto;

    @IsDateString()
    @ApiProperty({ description: 'Data de cadastro do cliente na iniciadora.' })
    accountTenure: string;

    @ValidateNested()
    @Type(() => GeolocationDto)
    @ApiProperty({ description: 'Dados de geolocalização do cliente enquanto logado na iniciadora' })
    geolocation: GeolocationDto;

    @IsBoolean()
    @ApiProperty({ description: 'Indica chamada ativa no momento do vínculo.' })
    isCallInProgress: boolean;

    @IsBoolean()
    @ApiProperty({ description: 'Indica se o dispositivo está em modo de desenvolvedor.' })
    isDevModeEnabled: boolean;

    @IsBoolean()
    @ApiProperty({ description: 'Indica se o dispositivo está usando um GPS falso.' })
    isMockGPS: boolean;

    @IsBoolean()
    @ApiProperty({ description: 'Indica se o dispositivo é emulado ou real.' })
    isEmulated: boolean;

    @IsBoolean()
    @ApiProperty({ description: 'Indica o uso do MonkeyRunner.' })
    isMonkeyRunner: boolean;

    @IsBoolean()
    @ApiProperty({ description: 'Indica se a bateria do dispositivo está sendo carregada.' })
    isCharging: boolean;

    @IsString()
    @ApiProperty({ description: 'Indica em qual antena o dispositivo está conectado.' })
    antennaInformation: string;

    @IsBoolean()
    @ApiProperty({ description: 'Indica se o dispositivo está conectado a outro dispositivo via USB.' })
    isUsbConnected: boolean;

    @ValidateNested()
    @Type(() => IntegrityDto)
    @ApiProperty({ description: 'Informa a integridade do dispositivo e app.' })
    integrity: IntegrityDto;
}

class AutomaticRiskSignalsDto {
    @IsDateString()
    @ApiProperty({ description: 'Data e hora do último login do cliente na iniciadora' })
    lastLoginDateTime: string;

    @IsDateString()
    @ApiProperty({ description: 'Data e hora de cadastro da chave Pix do recebedor na iniciadora' })
    pixKeyRegistrationDateTime: string;
}

class RiskSignalsDto {
    @ValidateNested()
    @Type(() => ManualRiskSignalsDto)
    @ApiProperty({ description: 'Representa a coleta de sinais de risco com a presença do usuário' })
    manual: ManualRiskSignalsDto;

    @ValidateNested()
    @Type(() => AutomaticRiskSignalsDto)
    @ApiProperty({ description: 'Representa a coleta de sinais de risco sem a presença do usuário' })
    automatic: AutomaticRiskSignalsDto;
}

export class CreateTransactionDto {
    @IsString()
    @ApiProperty({ description: 'Identificador único do consentimento' })
    recurringConsentId: string;

    @IsString()
    @ApiProperty({
        description: `Admite-se que o EndToEndId seja gerado pelo participante direto, pelo participante indireto ou pelo iniciador de pagamento.

Ele deve ser único, não podendo ser repetido em qualquer outra operação enviada ao SPI.` })
    endToEndId: string;

    @IsDateString()
    @ApiProperty({ description: 'Data em que o pagamento será realizado.' })
    date: string;

    @ValidateNested()
    @Type(() => PaymentDto)
    @ApiProperty({ description: 'Objeto contendo as informações do pagamento.' })
    payment: PaymentDto;

    @ValidateNested()
    @Type(() => CreditorDto)
    @ApiProperty({ description: 'Objeto contendo os dados do recebedor (creditor).' })
    creditor: CreditorDto

    @ValidateNested()
    @Type(() => CreditorAccountDto)
    @IsOptional()
    @ApiPropertyOptional({ description: 'Objeto que contém a identificação da conta de destino do beneficiário/recebedor.' })
    creditorAccount: CreditorAccountDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DebtorAccountDto)
    @ApiPropertyOptional({ description: 'Objeto que contém a identificação da conta de saida do pagador.' })
    debtorAccount: DebtorAccountDto

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Número do documento de identificação oficial do titular pessoa natural ou jurídica.' })
    debtorDocument: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Deve ser preenchido sempre que o usuário pagador inserir alguma informação adicional em um pagamento, a ser enviada ao recebedor.' })
    remittanceInformation: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'QR code information' })
    qrCode?: string

    @IsString()
    @ApiProperty({ description: 'CNPJ do Iniciador de Pagamento devidamente habilitado para a prestação de Serviço de Iniciação no Pix.' })
    cnpjInitiator: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'O campo ibgeTownCode no arranjo Pix tem o mesmo comportamento que o campo codMun descrito no item 1.6.6 do manual do Pix' })
    ibgeTownCode: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Campo condicional utilizado para identificar o fluxo de autorização em que o pagamento foi solicitado.' })
    authorisationFlow: string;

    @ValidateNested()
    @Type(() => RiskSignalsDto)
    @IsOptional()
    @ApiPropertyOptional({
        description: `Sinais de risco para iniciação de pagamentos automáticos

[Restrição] Deve ser enviado quando o consentimento for para o produto Sweeping Accounts` })
    riskSignals: RiskSignalsDto;

    @IsString()
    @ApiProperty({ description: 'Especifica a forma de iniciação do pagamento' })
    localInstrument: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Chave cadastrada no DICT pertencente ao recebedor.' })
    proxy: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Trata-se de um identificador de transação que deve ser retransmitido intacto pelo PSP do pagador ao gerar a ordem de pagamento.' })
    transactionIdentification: string;

}

export class CreateAutomaticPaymentsV1Dto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTransactionDto)
    @ApiProperty({
        type: CreateTransactionDto,
        description: 'Objeto contendo dados do pagamento e do recebedor (creditor).',
    })
    data: CreateTransactionDto
}
