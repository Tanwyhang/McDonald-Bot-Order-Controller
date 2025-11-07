# `BotControls` Component

This component provides buttons for adding and removing cooking bots from the system.

## Props

-   `addBot`: A function to call when the "+ Bot" button is clicked. This function should add a new bot to the system.
-   `removeBot`: A function to call when the "- Bot" button is clicked. This function should remove the newest bot from the system.
-   `hasBots`: A boolean indicating whether there are any active bots. The "- Bot" button will be disabled if `hasBots` is `false`.

## Usage

```typescript
import { BotControls } from './components/BotControls';
import { useOrderManager } from './hooks/useOrderManager';

function MyPage() {
  const { bots, addBot, removeBot } = useOrderManager();

  return (
    <BotControls
      addBot={addBot}
      removeBot={removeBot}
      hasBots={bots.length > 0}
    />
  );
}
```