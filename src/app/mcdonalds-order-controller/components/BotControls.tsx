import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BotControlsProps {
  addBot: () => void;
  removeBot: () => void;
  hasBots: boolean;
}

export const BotControls: React.FC<BotControlsProps> = ({ addBot, removeBot, hasBots }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Bot Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={addBot} className="w-full">
          + Bot
        </Button>
        <Button onClick={removeBot} className="w-full" variant="destructive" disabled={!hasBots}>
          - Bot
        </Button>
      </CardContent>
    </Card>
  );
};
