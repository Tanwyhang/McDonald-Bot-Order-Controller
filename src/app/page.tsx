"use client";

import React from 'react';
import { useOrderManager } from './mcdonalds-order-controller/hooks/useOrderManager';
import { OrderControls } from './mcdonalds-order-controller/components/OrderControls';
import { BotControls } from './mcdonalds-order-controller/components/BotControls';
import { BotStatusList } from './mcdonalds-order-controller/components/BotStatusList';
import { OrderList } from './mcdonalds-order-controller/components/OrderList';

const McDonaldsOrderControllerPage = () => {
  const {
    pendingOrders,
    completedOrders,
    bots,
    addNormalOrder,
    addVipOrder,
    addBot,
    removeBot,
  } = useOrderManager();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">McDonald's Order Controller</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Column 1: Controls */}
        <div className="col-span-1 space-y-6">
          <OrderControls addNormalOrder={addNormalOrder} addVipOrder={addVipOrder} />
          <BotControls addBot={addBot} removeBot={removeBot} hasBots={bots.length > 0} />
          <BotStatusList bots={bots} />
        </div>

        {/* Column 2 & 3: Pending Orders */}
        <div className="md:col-span-2">
          <OrderList title="Pending Orders" orders={pendingOrders} emptyMessage="No pending orders." />
        </div>

        {/* Column 4: Completed Orders */}
        <div className="md:col-span-1">
          <OrderList title="Completed Orders" orders={completedOrders} emptyMessage="No completed orders yet." />
        </div>
      </div>
    </div>
  );
};

export default McDonaldsOrderControllerPage;