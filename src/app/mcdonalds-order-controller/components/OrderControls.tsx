import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderControlsProps {
  addNormalOrder: () => void;
  addVipOrder: () => void;
}

export const OrderControls: React.FC<OrderControlsProps> = ({ addNormalOrder, addVipOrder }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Order Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={addNormalOrder} className="w-full">
          New Normal Order
        </Button>
        <Button onClick={addVipOrder} className="w-full" variant="secondary">
          New VIP Order
        </Button>
      </CardContent>
    </Card>
  );
};
