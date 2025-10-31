export interface User {
    _id: string;
    username: string;
    email: string;
    online?: boolean;
    lastSeen?: string;
}

export interface Message {
    _id: string;
    chatId: string;
    sender: User;
    content: string;
    seenBy: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Chat {
    _id: string;
    members: User[];
    lastMessage?: Message;
    createdAt: string;
    updatedAt: string;
}