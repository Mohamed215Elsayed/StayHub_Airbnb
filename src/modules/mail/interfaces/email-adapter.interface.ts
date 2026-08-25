import { SendEmailDto } from "../dto/send-email.dto";
// contract
export interface EmailAdapterInterface {
  sendEmail(dto: SendEmailDto): Promise<void>;
}
