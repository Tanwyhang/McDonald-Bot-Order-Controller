# Type Definitions

This document outlines the key type definitions used in the McDonald's Order Controller prototype.

## `McDonaldOrder`

Represents a single order in the McDonald's system.

```typescript
interface McDonaldOrder {
  id: number;
  type: 'Normal' | 'VIP';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETE';
  botId: number | null;
}
```

### Properties

-   `id`: `number` - A unique identifier for the order.
-   `type`: `'Normal' | 'VIP'` - The type of the order, determining its priority.
-   `status`: `'PENDING' | 'PROCESSING' | 'COMPLETE'` - The current status of the order.
-   `botId`: `number | null` - The ID of the bot currently processing the order, or `null` if not being processed.

## `McDonaldBot`

Represents a single cooking bot in the McDonald's system.

```typescript
interface McDonaldBot {
  id: number;
  status: 'IDLE' | 'PROCESSING';
  currentOrderId: number | null;
  timerId: NodeJS.Timeout | null;
}
```

### Properties

-   `id`: `number` - A unique identifier for the bot.
-   `status`: `'IDLE' | 'PROCESSING'` - The current status of the bot.
-   `currentOrderId`: `number | null` - The ID of the order currently being processed by the bot, or `null` if `IDLE`.
-   `timerId`: `NodeJS.Timeout | null` - The ID of the timer associated with the bot's current processing task.
