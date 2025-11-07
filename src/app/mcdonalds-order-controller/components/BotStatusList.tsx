import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { McDonaldBot } from '@/lib/types';

interface BotStatusListProps {
  bots: McDonaldBot[];
}

export const BotStatusList: React.FC<BotStatusListProps> = ({ bots }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Bots ({bots.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {bots.length === 0 ? (
          <p className="text-gray-500">No bots available.</p>
        ) : (
          bots.map((bot) => (
            <div key={bot.id} className="flex justify-between items-center p-2 border rounded-md">
              <span>Bot {bot.id}:</span>
              <span
                className={`font-medium ${
                  bot.status === 'IDLE' ? 'text-green-600' : 'text-blue-600'
                }`}
              >
                {bot.status} {bot.currentOrderId ? `(Order ${bot.currentOrderId})` : ''}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
