import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSignIn, useLogout } from '../auth.hook';
import { QueryWrapper } from '@/lib/__tests__/test-utils';
import { useAuthStore } from '../AuthStore';
import { useServerStore } from '@/feature/server/ServerStore';
import { useRoomStore } from '@/feature/room/RoomStore';
import * as authApi from '../auth.api';

// Mock the API layer
vi.mock('../auth.api', () => ({
  getSignin: vi.fn(),
  logout: vi.fn(),
}));

// Mock next/navigation
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('auth.hook.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ accessToken: null, userId: null, isAuthenticated: false });
    useServerStore.setState({ activeServerId: 'some-id' });
    useRoomStore.setState({ activeRoomId: 'some-room' }); 
  });

  describe('useSignIn', () => {
    it('should login and reset other stores on successful sign in', async () => {
      const mockResponse = {
        data: {
          user: { accessToken: 'fake-token', id: 'user-id-123' },
          message: 'Success'
        }
      };
      
      // Setup the API mock to resolve successfully
      (authApi.getSignin as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSignIn(), { wrapper: QueryWrapper });

      // Trigger mutation
      result.current.mutate({ email: 'test@test.com', password: 'password123' });

      // Wait for mutation to finish
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify AuthStore updated
      const authState = useAuthStore.getState();
      expect(authState.accessToken).toBe('fake-token');
      expect(authState.userId).toBe('user-id-123');
      expect(authState.isAuthenticated).toBe(true);

      // Verify other stores reset
      const serverState = useServerStore.getState();
      expect(serverState.activeServerId).toBeNull();
      
      const roomState = useRoomStore.getState();
      expect(roomState.activeRoomId).toBeNull();
    });
  });

  describe('useLogout', () => {
    it('should logout, clear stores, and redirect', async () => {
      // Mock active user session
      useAuthStore.setState({ accessToken: 'fake-token', userId: 'user-123', isAuthenticated: true });
      
      // Setup the API mock to resolve successfully
      (authApi.logout as any).mockResolvedValue({ message: 'Logged out' });

      const { result } = renderHook(() => useLogout(), { wrapper: QueryWrapper });

      // Trigger mutation
      result.current.mutate();

      // Wait for mutation to finish
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify AuthStore cleared
      const authState = useAuthStore.getState();
      expect(authState.accessToken).toBeNull();
      expect(authState.isAuthenticated).toBe(false);

      // Verify other stores reset
      const serverState = useServerStore.getState();
      expect(serverState.activeServerId).toBeNull();

      // Verify redirect
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });
});
