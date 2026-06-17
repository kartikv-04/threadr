import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../AuthStore';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      accessToken: null,
      isAuthenticated: false,
      userId: null,
      _hasHydrated: false,
    });
    localStorage.clear();
  });

  it('should have correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.userId).toBeNull();
  });

  it('should login and set tokens correctly', () => {
    useAuthStore.getState().login('test-token', 'user-123');
    
    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('test-token');
    expect(state.userId).toBe('user-123');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should logout and clear state', () => {
    useAuthStore.getState().login('test-token', 'user-123');
    useAuthStore.getState().logout();
    
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.userId).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
  
  it('should update hydration state', () => {
    useAuthStore.getState().setHasHydrated(true);
    expect(useAuthStore.getState()._hasHydrated).toBe(true);
  });
});
