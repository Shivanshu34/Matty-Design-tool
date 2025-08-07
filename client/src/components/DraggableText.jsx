import React, { useRef, useEffect } from "react";
import {
  Text,
  Transformer,
} from "react-konva";

// ─── Draggable Text ────────────────────────────────────────────────────────
export const DraggableText = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const ref = useRef();
  const tr = useRef();
  useEffect(() => {
    if (isSelected) {
      tr.current.nodes([ref.current]);
      tr.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Text
        ref={ref}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onDblClick={() => {
          const newText = prompt("Edit text:", shapeProps.text);
          if (newText !== null) onChange({ text: newText });
        }}
        onDragEnd={e => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={e => {
          const node = ref.current;
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            fontSize: Math.max(10, shapeProps.fontSize * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer ref={tr} enabledAnchors={["middle-left", "middle-right"]} />
      )}
    </>
  );
};
