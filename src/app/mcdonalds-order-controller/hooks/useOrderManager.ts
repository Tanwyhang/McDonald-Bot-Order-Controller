import { useReducer, useEffect, useRef } from 'react';
import { McDonaldOrder, McDonaldBot } from '@/lib/types';

// --- State and Reducer ---
interface OrderManagerState {
  orders: McDonaldOrder[];
  bots: McDonaldBot[];
  nextOrderId: number;
  nextBotId: number;
}

type OrderManagerAction =
  | { type: 'ADD_ORDER'; payload: { type: 'Normal' | 'VIP' } }
  | { type: 'ADD_BOT' }
  | { type: 'REMOVE_BOT' }
  | { type: 'START_PROCESSING'; payload: { botId: number; orderId: number } }
  | { type: 'COMPLETE_ORDER'; payload: { botId: number; orderId: number } }
  | { type: 'BOT_IDLE'; payload: { botId: number } }
  | { type: 'RETURN_ORDER_TO_PENDING'; payload: { orderId: number } }
  | { type: 'SET_BOT_TIMER'; payload: { botId: number; timerId: NodeJS.Timeout | null } };

const orderManagerReducer = (state: OrderManagerState, action: OrderManagerAction): OrderManagerState => {
  switch (action.type) {
    case 'ADD_ORDER': {
      let updatedOrders: McDonaldOrder[];
      if (action.payload.type === 'VIP') {
        const lastVipIndex = state.orders.findLastIndex(
          (order) => order.type === 'VIP' && order.status === 'PENDING'
        );
        if (lastVipIndex !== -1) {
          updatedOrders = [
            ...state.orders.slice(0, lastVipIndex + 1),
            {
              id: state.nextOrderId,
              type: action.payload.type,
              status: 'PENDING',
              botId: null,
              startTime: Date.now(),
            },
            ...state.orders.slice(lastVipIndex + 1),
          ];
        } else {
          const firstNormalIndex = state.orders.findIndex(
            (order) => order.type === 'Normal' && order.status === 'PENDING'
          );
          if (firstNormalIndex !== -1) {
            updatedOrders = [
              ...state.orders.slice(0, firstNormalIndex),
              {
                id: state.nextOrderId,
                type: action.payload.type,
                status: 'PENDING',
                botId: null,
                startTime: Date.now(),
              },
              ...state.orders.slice(firstNormalIndex),
            ];
          } else {
            updatedOrders = [...state.orders, {
              id: state.nextOrderId,
              type: action.payload.type,
              status: 'PENDING',
              botId: null,
              startTime: Date.now(),
            }];
          }
        }
      } else {
        updatedOrders = [...state.orders, {
          id: state.nextOrderId,
          type: action.payload.type,
          status: 'PENDING',
          botId: null,
          startTime: Date.now(),
        }];
      }
      return { ...state, orders: updatedOrders, nextOrderId: state.nextOrderId + 1 };
    }

    case 'ADD_BOT': {
      const newBot: McDonaldBot = {
        id: state.nextBotId,
        status: 'IDLE',
        currentOrderId: null,
        timerId: null,
      };
      return { ...state, bots: [...state.bots, newBot], nextBotId: state.nextBotId + 1 };
    }

    case 'REMOVE_BOT': {
      const newBots = [...state.bots];
      const botToRemove = newBots.pop(); // Remove the newest bot

      if (botToRemove) {
        if (botToRemove.timerId) {
          clearTimeout(botToRemove.timerId);
        }

        if (botToRemove.currentOrderId !== null) {
          const updatedOrders = state.orders.map((order): McDonaldOrder => {
            if (order.id === botToRemove.currentOrderId) {
              return {
                id: order.id,
                type: order.type,
                status: 'PENDING',
                botId: null,
                startTime: null,
              };
            }
            return order;
          });
          return { ...state, bots: newBots, orders: updatedOrders };
        }
      }
      return { ...state, bots: newBots };
    }

    case 'START_PROCESSING': {
      const { botId, orderId } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order): McDonaldOrder => {
            if (order.id === orderId) {
                return { ...order, status: 'PROCESSING', botId, startTime: Date.now() };
            }
            return order;
        }),
        bots: state.bots.map((bot): McDonaldBot => {
            if (bot.id === botId) {
                return { ...bot, status: 'PROCESSING', currentOrderId: orderId };
            }
            return bot;
        }),
      };
    }

    case 'COMPLETE_ORDER': {
      const { botId, orderId } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order): McDonaldOrder => {
            if (order.id === orderId) {
                return { ...order, status: 'COMPLETE', botId: null, startTime: null };
            }
            return order;
        }),
        bots: state.bots.map((bot): McDonaldBot => {
            if (bot.id === botId) {
                return { ...bot, status: 'IDLE', currentOrderId: null, timerId: null };
            }
            return bot;
        }),
      };
    }

    case 'BOT_IDLE': {
      const { botId } = action.payload;
      return {
        ...state,
        bots: state.bots.map((bot): McDonaldBot => {
            if (bot.id === botId) {
                return { ...bot, status: 'IDLE', currentOrderId: null, timerId: null };
            }
            return bot;
        }),
      };
    }

    case 'RETURN_ORDER_TO_PENDING': {
      const { orderId } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order): McDonaldOrder => {
          if (order.id === orderId) {
            return { ...order, status: 'PENDING', botId: null, startTime: null };
          }
          return order;
        }),
      };
    }

    case 'SET_BOT_TIMER': {
      const { botId, timerId } = action.payload;
      return {
        ...state,
        bots: state.bots.map((bot): McDonaldBot => {
          if (bot.id === botId) {
            return { ...bot, timerId };
          }
          return bot;
        }),
      };
    }

    default:
      return state;
  }
};

const initialState: OrderManagerState = {
  orders: [],
  bots: [],
  nextOrderId: 1,
  nextBotId: 1,
};

// --- Custom Hook ---
export const useOrderManager = () => {
  const [state, dispatch] = useReducer(orderManagerReducer, initialState);

  const botsRef = useRef<McDonaldBot[]>(state.bots);

  useEffect(() => {
    botsRef.current = state.bots;
  }, [state.bots]);

  useEffect(() => {
    return () => {
      botsRef.current.forEach((bot) => {
        if (bot.timerId) {
          clearTimeout(bot.timerId);
        }
      });
    };
  }, []);

  // Effect for bot processing logic
  useEffect(() => {
    const idleBots = state.bots.filter((bot) => bot.status === 'IDLE');
    const availablePendingOrders = state.orders
      .filter((order) => order.status === 'PENDING' && order.botId === null)
      .sort((a, b) => {
        if (a.type === 'VIP' && b.type === 'Normal') return -1;
        if (a.type === 'Normal' && b.type === 'VIP') return 1;
        return a.id - b.id;
      });

    // Assign orders to idle bots
    idleBots.forEach((bot) => {
      if (availablePendingOrders.length > 0) {
        const orderToProcess = availablePendingOrders.shift(); // Take the highest priority pending order and remove it

        if (orderToProcess) {
          dispatch({ type: 'START_PROCESSING', payload: { botId: bot.id, orderId: orderToProcess.id } });
        }
      }
    });

    // Manage processing timers for bots
    state.bots.forEach((bot) => {
      if (bot.status === 'PROCESSING' && bot.currentOrderId !== null && bot.timerId === null) {
        // Set a timer for completion if not already set
        const timer = setTimeout(() => {
          dispatch({ type: 'COMPLETE_ORDER', payload: { botId: bot.id, orderId: bot.currentOrderId! } });
        }, 5000); // 5 seconds
        dispatch({ type: 'SET_BOT_TIMER', payload: { botId: bot.id, timerId: timer } });
      }
    });
  }, [state.orders, state.bots]); // Re-run effect when orders or bots change

  const addNormalOrder = () => dispatch({ type: 'ADD_ORDER', payload: { type: 'Normal' } });
  const addVipOrder = () => dispatch({ type: 'ADD_ORDER', payload: { type: 'VIP' } });
  const addBot = () => dispatch({ type: 'ADD_BOT' });
  const removeBot = () => dispatch({ type: 'REMOVE_BOT' });

  const pendingOrders = state.orders.filter((order) => order.status !== 'COMPLETE');
  const completedOrders = state.orders.filter((order) => order.status === 'COMPLETE');

  return {
    pendingOrders,
    completedOrders,
    bots: state.bots,
    addNormalOrder,
    addVipOrder,
    addBot,
    removeBot,
  };
};
