import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { McDonaldOrder } from '@/lib/types';

interface OrderListProps {
  title: string;
  orders: McDonaldOrder[];
  emptyMessage: string;
}

export const OrderList: React.FC<OrderListProps> = ({ title, orders, emptyMessage }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {orders.length === 0 ? (
          <p className="text-gray-500">{emptyMessage}</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className={`p-3 border rounded-md flex justify-between items-center ${
                order.type === 'VIP' ? 'bg-yellow-100 border-yellow-400' : 'bg-white'
              } ${order.status === 'COMPLETE' ? 'bg-green-50' : ''}`}
            >
              <span>
                Order {order.id} ({order.type})
              </span>
              <span
                className={`font-medium ${
                  order.status === 'PROCESSING' ? 'text-blue-600' :
                  order.status === 'COMPLETE' ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                {order.status} {order.botId ? `(Bot ${order.botId})` : ''}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
