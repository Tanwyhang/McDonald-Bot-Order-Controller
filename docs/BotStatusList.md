# `BotStatusList` Component

This component displays the status of all active cooking bots.

## Props

-   `bots`: An array of `McDonaldBot` objects, each representing an active bot.

## Usage

```typescript
import { BotStatusList } from './components/BotStatusList';
import { useOrderManager } from './hooks/useOrderManager';

function MyPage() {
  const { bots } = useOrderManager();

  return (
    <BotStatusList bots={bots} />
  );
}
```
