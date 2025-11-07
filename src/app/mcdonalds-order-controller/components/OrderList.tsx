import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { McDonaldOrder } from '@/lib/types';
import { Star } from 'lucide-react'; // Import Star icon
import ProgressBar from '@ramonak/react-progress-bar'; // Import external ProgressBar

interface OrderListProps {
  title: string;
  orders: McDonaldOrder[];
  emptyMessage: string;
}

const PROCESSING_TIME = 5000; // 5 seconds

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
              className={`p-3 border rounded-md flex flex-col ${
                order.type === 'VIP' ? 'bg-yellow-100 border-yellow-400' : 'bg-white'
              } ${order.status === 'COMPLETE' ? 'bg-green-50' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  Order {order.id}
                  {order.type === 'VIP' && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1" /> VIP
                    </span>
                  )}
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
              {order.status === 'PROCESSING' && order.startTime !== null && (
                <ProcessingOrderProgressBar startTime={order.startTime} />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

interface ProcessingOrderProgressBarProps {
  startTime: number;
}

const ProcessingOrderProgressBar: React.FC<ProcessingOrderProgressBarProps> = ({ startTime }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const calculatedProgress = Math.min((elapsedTime / PROCESSING_TIME) * 100, 100);
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(interval);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="mt-2">
      <ProgressBar
        completed={progress}
        bgColor="#3B82F6" // Tailwind blue-500
        height="10px"
        isLabelVisible={false}
        animateOnRender={false}
        transitionDuration="100ms"
      />
    </div>
  );
};
