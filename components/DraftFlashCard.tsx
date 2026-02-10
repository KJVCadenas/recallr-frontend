"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { sanitizeText } from "@/lib/frontend/validation";

interface CardData {
  front: string;
  back: string;
}

interface DraftFlashCardProps {
  card: CardData;
  index: number;
  onUpdate: (index: number, field: keyof CardData, value: string) => void;
  onRemove: (index: number) => void;
  showRemoveButton: boolean;
}

export function DraftFlashCard({
  card,
  index,
  onUpdate,
  onRemove,
  showRemoveButton,
}: DraftFlashCardProps) {
  return (
    <Card className="pr-4 pl-11 pt-2 pb-4 relative">
      <Badge
        variant="default"
        className="absolute top-2 left-2 text-xs font-medium rounded-md"
      >
        {index + 1}
      </Badge>
      <div className="flex items-start gap-4">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor={`front-${index}`}
              className="text-sm font-medium mb-1 block"
            >
              Front
            </Label>
            <Textarea
              id={`front-${index}`}
              value={card.front}
              onChange={(e) => onUpdate(index, "front", sanitizeText(e.target.value))}
              placeholder="Question or term"
              rows={3}
              className="resize-none"
              required
            />
          </div>
          <div>
            <Label
              htmlFor={`back-${index}`}
              className="text-sm font-medium mb-1 block"
            >
              Back
            </Label>
            <Textarea
              id={`back-${index}`}
              value={card.back}
              onChange={(e) => onUpdate(index, "back", sanitizeText(e.target.value))}
              placeholder="Answer or definition"
              rows={3}
              className="resize-none"
              required
            />
          </div>
        </div>
        {showRemoveButton && (
          <Button
            onClick={() => onRemove(index)}
            variant="destructive"
            size="sm"
            className="shrink-0 mt-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
