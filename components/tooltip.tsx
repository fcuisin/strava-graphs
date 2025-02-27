import { InteractionData } from "@/components/heatmap";
import { ReactNode } from "react";

type TooltipProps = {
  interactionData: InteractionData | null;
  children: ReactNode;
};

export const Tooltip = ({ interactionData, children }: TooltipProps) => {
  if (!interactionData || interactionData.value === 0) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 pointer-events-none">
      <div
        className="absolute bg-gray-800 text-white px-2 py-1 rounded-md shadow-lg text-sm whitespace-nowrap"
        style={{ left: interactionData.xPos, top: interactionData.yPos + 36 }}
      >
        {children}
      </div>
    </div>
  );
};
