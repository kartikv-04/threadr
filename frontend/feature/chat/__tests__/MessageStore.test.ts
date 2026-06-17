import { describe, it, expect, beforeEach } from 'vitest';
import { useMessageStore } from '../MessageStore';
import { Message } from '../chat.type';

const createMockMessage = (id: string, text: string): Message => ({
  messageId: id,
  content: text,
  roomId: 'room-1',
  userId: 'user-1',
  username: 'testuser',
  isEdited: false,
  createdAt: new Date().toISOString(),
  serverId: 'server-1',
});

describe('MessageStore', () => {
  beforeEach(() => {
    useMessageStore.setState({ messages: [] });
  });

  it('should add a new message', () => {
    const msg = createMockMessage('msg-1', 'Hello');
    useMessageStore.getState().addMessage(msg);
    
    expect(useMessageStore.getState().messages).toHaveLength(1);
    expect(useMessageStore.getState().messages[0].content).toBe('Hello');
  });

  it('should prevent duplicate messages by messageId', () => {
    const msg1 = createMockMessage('msg-1', 'Hello');
    const msg2 = createMockMessage('msg-1', 'Duplicate Hello');
    
    useMessageStore.getState().addMessage(msg1);
    useMessageStore.getState().addMessage(msg2);
    
    expect(useMessageStore.getState().messages).toHaveLength(1);
    expect(useMessageStore.getState().messages[0].content).toBe('Hello');
  });

  it('should update an existing message', () => {
    const msg = createMockMessage('msg-1', 'Hello');
    useMessageStore.getState().addMessage(msg);
    
    useMessageStore.getState().updateMessage({ ...msg, content: 'Updated Hello', isEdited: true });
    
    expect(useMessageStore.getState().messages[0].content).toBe('Updated Hello');
    expect(useMessageStore.getState().messages[0].isEdited).toBe(true);
  });

  it('should remove a message', () => {
    const msg = createMockMessage('msg-1', 'Hello');
    useMessageStore.getState().addMessage(msg);
    
    useMessageStore.getState().removeMessage('msg-1');
    
    expect(useMessageStore.getState().messages).toHaveLength(0);
  });

  it('should clear all messages', () => {
    const msg1 = createMockMessage('msg-1', 'Hello');
    const msg2 = createMockMessage('msg-2', 'World');
    
    useMessageStore.getState().addMessage(msg1);
    useMessageStore.getState().addMessage(msg2);
    useMessageStore.getState().clearMessages();
    
    expect(useMessageStore.getState().messages).toHaveLength(0);
  });
});
