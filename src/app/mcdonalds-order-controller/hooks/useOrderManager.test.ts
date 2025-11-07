import { renderHook, act, waitFor } from '@testing-library/react';
import { useOrderManager } from './useOrderManager';

jest.useFakeTimers();

describe('useOrderManager', () => {
  it('should add a normal order', () => {
    const { result } = renderHook(() => useOrderManager());

    act(() => {
      result.current.addNormalOrder();
    });

    expect(result.current.pendingOrders).toHaveLength(1);
    expect(result.current.pendingOrders[0].type).toBe('Normal');
    expect(result.current.pendingOrders[0].id).toBe(1);
  });

  it('should add a VIP order', () => {
    const { result } = renderHook(() => useOrderManager());

    act(() => {
      result.current.addVipOrder();
    });

    expect(result.current.pendingOrders).toHaveLength(1);
    expect(result.current.pendingOrders[0].type).toBe('VIP');
    expect(result.current.pendingOrders[0].id).toBe(1);
  });

  it('should add a VIP order with priority', () => {
    const { result } = renderHook(() => useOrderManager());

    act(() => {
      result.current.addNormalOrder();
    });

    act(() => {
      result.current.addVipOrder();
    });

    expect(result.current.pendingOrders).toHaveLength(2);
    expect(result.current.pendingOrders[0].type).toBe('VIP');
    expect(result.current.pendingOrders[1].type).toBe('Normal');
  });

    it('should add a VIP order after existing VIP orders', () => {
        const { result } = renderHook(() => useOrderManager());

        act(() => {
            result.current.addVipOrder(); // id: 1
        });

        act(() => {
            result.current.addNormalOrder(); // id: 2
        });

        act(() => {
            result.current.addVipOrder(); // id: 3
        });

        expect(result.current.pendingOrders).toHaveLength(3);
        expect(result.current.pendingOrders.map(o => o.id)).toEqual([1, 3, 2]);
        expect(result.current.pendingOrders.map(o => o.type)).toEqual(['VIP', 'VIP', 'Normal']);
    });


  it('should add a bot', () => {
    const { result } = renderHook(() => useOrderManager());

    act(() => {
      result.current.addBot();
    });

    expect(result.current.bots).toHaveLength(1);
    expect(result.current.bots[0].id).toBe(1);
    expect(result.current.bots[0].status).toBe('IDLE');
  });

  it('should remove a bot', () => {
    const { result } = renderHook(() => useOrderManager());

    act(() => {
      result.current.addBot();
    });

    act(() => {
      result.current.removeBot();
    });

    expect(result.current.bots).toHaveLength(0);
  });

  it('should process an order', async () => {
    const { result } = renderHook(() => useOrderManager());

    act(() => {
      result.current.addNormalOrder();
    });

    act(() => {
      result.current.addBot();
    });

    await waitFor(() => {
      expect(result.current.bots[0].status).toBe('PROCESSING');
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(result.current.completedOrders).toHaveLength(1);
    });

    expect(result.current.pendingOrders).toHaveLength(0);
    expect(result.current.bots[0].status).toBe('IDLE');
  });

  it('should return order to pending when bot is removed', () => {
    const { result } = renderHook(() => useOrderManager());

    act(() => {
      result.current.addNormalOrder();
    });

    act(() => {
      result.current.addBot();
    });

    expect(result.current.pendingOrders[0].status).toBe('PROCESSING');

    act(() => {
      result.current.removeBot();
    });

    expect(result.current.pendingOrders).toHaveLength(1);
    expect(result.current.pendingOrders[0].status).toBe('PENDING');
    expect(result.current.bots).toHaveLength(0);
  });
});
