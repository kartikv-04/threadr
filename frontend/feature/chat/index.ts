// Chat Feature Exports
export { default as ChatArea } from "./component/ChatArea";
export { useGetMessages, useSendMessage } from "./hook";
export { sendMessage, getMessages } from "./api";
export type {
    Message,
    SendMessageRequest,
    SendMessageResponse,
    GetMessagesRequest,
    GetMessagesResponse
} from "./type";
