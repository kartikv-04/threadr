import { describe, it, expect, beforeEach } from 'vitest';
import { useServerStore } from '../ServerStore';

describe('ServerStore', () => {
  beforeEach(() => {
    useServerStore.setState({
      activeServerId: null,
      activeServerName: null,
      activeRole: null,
    });
    localStorage.clear();
  });

  it('should have correct initial state', () => {
    const state = useServerStore.getState();
    expect(state.activeServerId).toBeNull();
    expect(state.activeServerName).toBeNull();
    expect(state.activeRole).toBeNull();
  });

  it('should set active server id, name, and role', () => {
    useServerStore.getState().setActiveServerId('server-1', 'My Server', ['admin']);
    
    const state = useServerStore.getState();
    expect(state.activeServerId).toBe('server-1');
    expect(state.activeServerName).toBe('My Server');
    expect(state.activeRole).toEqual(['admin']);
  });

  it('should handle optional params when setting server id', () => {
    useServerStore.getState().setActiveServerId('server-1');
    
    const state = useServerStore.getState();
    expect(state.activeServerId).toBe('server-1');
    expect(state.activeServerName).toBeNull();
    expect(state.activeRole).toBeNull();
  });

  it('should reset state completely', () => {
    useServerStore.getState().setActiveServerId('server-1', 'My Server', ['admin']);
    useServerStore.getState().reset();
    
    const state = useServerStore.getState();
    expect(state.activeServerId).toBeNull();
    expect(state.activeServerName).toBeNull();
    expect(state.activeRole).toBeNull();
  });
});
