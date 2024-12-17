import { Message } from "@/model/User.model";

export interface ApiResponse {
  success: Boolean;
  message: string;
  isAcceptingMessages?: Boolean;
  messages?: Array<Message>;
}
