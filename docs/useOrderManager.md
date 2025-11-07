# `useOrderManager` Hook

This custom React hook encapsulates all business logic and state management for orders and bots in the McDonald's Order Controller prototype. It uses `useReducer` for predictable state transitions and `useEffect` to simulate bot processing.

## State Management

The hook manages the following state:

-   `orders`: An array of `McDonaldOrder` objects, representing all orders in the system.
-   `bots`: An array of `McDonaldBot` objects, representing all active cooking bots.
-   `nextOrderId`: A number that provides unique, increasing IDs for new orders.
-   `nextBotId`: A number that provides unique, increasing IDs for new bots.

## Actions

The `orderManagerReducer` handles the following actions:

-   `ADD_ORDER`: Adds a new order (Normal or VIP) to the `pendingOrders` list. VIP orders are prioritized.
-   `ADD_BOT`: Creates a new cooking bot.
-   `REMOVE_BOT`: Destroys the newest bot. If the bot was processing an order, the order returns to `PENDING` status.
-   `START_PROCESSING`: Marks an order and a bot as `PROCESSING`.
-   `COMPLETE_ORDER`: Marks an order as `COMPLETE` and the associated bot as `IDLE`.
-   `BOT_IDLE`: Sets a bot's status to `IDLE`.
-   `RETURN_ORDER_TO_PENDING`: Returns a `PROCESSING` order to `PENDING` status.

## Exposed Values and Functions

The `useOrderManager` hook returns an object with the following properties:

-   `pendingOrders`: An array of `McDonaldOrder` objects that are currently `PENDING` or `PROCESSING`.
-   `completedOrders`: An array of `McDonaldOrder` objects that have been `COMPLETE`d.
-   `bots`: An array of `McDonaldBot` objects, representing all active bots.
-   `addNormalOrder()`: A function to add a new normal order.
-   `addVipOrder()`: A function to add a new VIP order.
-   `addBot()`: A function to add a new bot.
-   `removeBot()`: A function to remove the newest bot.

## Bot Processing Logic

The `useEffect` hook within `useOrderManager` simulates the bot processing:

-   When an `IDLE` bot is available and there are `PENDING` orders, the highest priority `PENDING` order is assigned to the bot.
-   The order and bot status are updated to `PROCESSING`.
-   A 10-second timer is set. After the timer, the order is marked `COMPLETE` and the bot becomes `IDLE`.
-   If a bot is removed while `PROCESSING` an order, the order is returned to `PENDING` status.

## Usage

```typescript
import { useOrderManager } from './hooks/useOrderManager';

function MyComponent() {
  const {
    pendingOrders,
    completedOrders,
    bots,
    addNormalOrder,
    addVipOrder,
    addBot,
    removeBot,
  } = useOrderManager();

  // ... render UI using these values and functions
}
```