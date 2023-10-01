import { MessageType, WHO } from "./enums";

export interface Message {
  id: string;
  who: WHO;
  content: any;
  type: MessageType;
}
