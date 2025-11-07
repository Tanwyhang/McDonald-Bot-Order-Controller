# `OrderList` Component

This component displays a list of McDonald's orders, categorized by their status (e.g., "Pending Orders", "Completed Orders").

## Props

-   `title`: A string representing the title of the order list (e.g., "Pending Orders").
-   `orders`: An array of `McDonaldOrder` objects to be displayed in the list.
-   `emptyMessage`: A string to display when the `orders` array is empty.

## Usage

```typescript
import { OrderList } from './components/OrderList';
import { useOrderManager } from './hooks/useOrderManager';

function MyPage() {
  const { pendingOrders, completedOrders } = useOrderManager();

  return (
    <>
      <OrderList
        title="Pending Orders"
        orders={pendingOrders}
        emptyMessage="No pending orders."
      />
      <OrderList
        title="Completed Orders"
        orders={completedOrders}
        emptyMessage="No completed orders yet."
      />
    </>
  );
}
```
