## McDonald's Order Controller - Frontend Prototype

This document outlines the implementation of a frontend prototype for a McDonald's order controller, focusing on managing order flow and bot interactions. This prototype is designed to fulfill the requirements of the take-home assignment, emphasizing a frontend-only solution with no backend integration or data persistence. All operations are performed in-memory.

### Core Features Implemented:

-   **Order Management:**
    -   "New Normal Order" button to add a new normal order to the "PENDING" area.
    -   "New VIP Order" button to add a new VIP order to the "PENDING" area, prioritized ahead of normal orders but behind existing VIP orders.
    -   Orders have unique, increasing numbers.
    -   Orders transition from "PENDING" to "COMPLETE" status.

-   **Cooking Bot Simulation:**
    -   "+ Bot" button to create a new cooking bot.
    -   Bots process one order at a time, taking 5 seconds per order.
    -   Processed orders move to the "COMPLETE" area.
    -   Bots become IDLE if no pending orders are available.
    -   "- Bot" button to destroy the newest bot.
    -   If a bot is destroyed while processing an order, the order returns to "PENDING" status.

### UI/UX Considerations:

-   A clear user interface demonstrating the "PENDING" and "COMPLETE" order areas.
-   Visual indicators for bot status (e.g., processing, idle).
-   Buttons for adding new normal/VIP orders and managing bots.

### Refined Technical Specification:

To ensure a clean, maintainable, and scalable codebase following best practices, the implementation will adhere to the following structure:

1.  **Modular Component Structure:**
    *   **`OrderControls`**: Component for "New Normal Order" and "New VIP Order" buttons.
    *   **`BotControls`**: Component for "+ Bot" and "- Bot" buttons.
    *   **`BotStatusList`**: Component to display the status of all active bots.
    *   **`OrderList`**: Reusable component to display lists of orders (for both "PENDING" and "COMPLETE" sections).

2.  **Centralized State Management with a Custom Hook (`useOrderManager`):**
    *   All business logic and state management for orders and bots will be encapsulated within a custom React hook, `useOrderManager`.
    *   This hook will manage the state using `useReducer` for predictable state transitions.
    *   It will handle: adding orders (normal/VIP priority), adding/removing bots, assigning orders to bots, simulating processing time, and re-queuing orders if a bot is removed mid-process.
    *   The hook will expose the current state (e.g., `pendingOrders`, `completedOrders`, `bots`) and action functions (e.g., `addOrder`, `addBot`, `removeBot`).

3.  **Clear Type Definitions:**
    *   TypeScript interfaces for `Order` and `Bot` will be defined in `src/lib/types.ts` to ensure type safety and consistency.

4.  **Dedicated File and Folder Structure:**
    *   All new application files will reside in `src/app/mcdonalds-order-controller/` to maintain separation from existing project code.
    *   **`src/app/mcdonalds-order-controller/page.tsx`**: The main entry point, composing the UI from sub-components and utilizing `useOrderManager`.
    *   **`src/app/mcdonalds-order-controller/components/`**: Directory for UI components.
    *   **`src/app/mcdonalds-order-controller/hooks/`**: Directory for the `useOrderManager.ts` custom hook.

### How to Run:

1.  Ensure Node.js and pnpm are installed.
2.  Navigate to the project root.
3.  Install dependencies: `pnpm install`
4.  Start the development server: `pnpm run dev`
5.  Access the application in your browser at `http://localhost:3000` (or the specified port).

### Future Enhancements (Out of Scope for Prototype):

-   Backend integration for persistent storage.
-   More sophisticated UI/UX for order tracking.