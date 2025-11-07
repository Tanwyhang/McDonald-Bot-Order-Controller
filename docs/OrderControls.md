# `OrderControls` Component

This component provides buttons for adding new "Normal" and "VIP" orders to the system.

## Props

-   `addNormalOrder`: A function to call when the "New Normal Order" button is clicked. This function should add a new normal order to the system.
-   `addVipOrder`: A function to call when the "New VIP Order" button is clicked. This function should add a new VIP order to the system.

## Usage

```typescript
import { OrderControls } from './components/OrderControls';
import { useOrderManager } from './hooks/useOrderManager';

function MyPage() {
  const { addNormalOrder, addVipOrder } = useOrderManager();

  return (
    <OrderControls
      addNormalOrder={addNormalOrder}
      addVipOrder={addVipOrder}
    />
  );
}
```