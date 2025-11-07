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
  | { type: 'RETURN_ORDER_TO_PENDING'; payload: { orderId: number } };

const orderManagerReducer = (state: OrderManagerState, action: OrderManagerAction): OrderManagerState => {
  switch (action.type) {
    case 'ADD_ORDER': {
      const newOrder: McDonaldOrder = {
        id: state.nextOrderId,
        type: action.payload.type,
        status: 'PENDING',
        botId: null,
      };

      let updatedOrders: McDonaldOrder[];
      if (action.payload.type === 'VIP') {
        const lastVipIndex = state.orders.findLastIndex(
          (order) => order.type === 'VIP' && order.status === 'PENDING'
        );
        if (lastVipIndex !== -1) {
          updatedOrders = [
            ...state.orders.slice(0, lastVipIndex + 1),
            newOrder,
            ...state.orders.slice(lastVipIndex + 1),
          ];
        } else {
          const firstNormalIndex = state.orders.findIndex(
            (order) => order.type === 'Normal' && order.status === 'PENDING'
          );
          if (firstNormalIndex !== -1) {
            updatedOrders = [
              ...state.orders.slice(0, firstNormalIndex),
              newOrder,
              ...state.orders.slice(firstNormalIndex),
            ];
          } else {
            updatedOrders = [...state.orders, newOrder];
          }
        }
      } else {
        updatedOrders = [...state.orders, newOrder];
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
                return { ...order, status: 'PROCESSING', botId };
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
                return { ...order, status: 'COMPLETE', botId: null };
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
            return { ...order, status: 'PENDING', botId: null };
          }
          return order;
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
  const processingTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Effect for bot processing logic
  useEffect(() => {
    state.bots.forEach((bot) => {
      if (bot.status === 'IDLE') {
        const pendingOrders = state.orders
          .filter((order) => order.status === 'PENDING' && order.botId === null) // Only truly pending and unassigned orders
          .sort((a, b) => {
            if (a.type === 'VIP' && b.type === 'Normal') return -1;
            if (a.type === 'Normal' && b.type === 'VIP') return 1;
            return a.id - b.id;
          });

        if (pendingOrders.length > 0) {
          const orderToProcess = pendingOrders[0]; // Take the highest priority pending order

          // Dispatch action to mark order and bot as processing
          dispatch({ type: 'START_PROCESSING', payload: { botId: bot.id, orderId: orderToProcess.id } });
        }
      }

      // Manage processing timers for bots
      if (bot.status === 'PROCESSING' && bot.currentOrderId !== null) {
        // Set a timer for completion if not already set
        if (!processingTimers.current.has(bot.id)) {
          const timer = setTimeout(() => {
            dispatch({ type: 'COMPLETE_ORDER', payload: { botId: bot.id, orderId: bot.currentOrderId! } });
          }, 5000); // 5 seconds
          processingTimers.current.set(bot.id, timer);
        }
      } else if (bot.status === 'IDLE' && processingTimers.current.has(bot.id)) {
        // Clear timer if bot becomes idle unexpectedly (e.g., order returned to pending)
        clearTimeout(processingTimers.current.get(bot.id)!);
        processingTimers.current.delete(bot.id);
      }
    });

    // Cleanup function for timers when component unmounts or state changes
    return () => {
      processingTimers.current.forEach((timer) => clearTimeout(timer));
      processingTimers.current.clear();
    };
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
