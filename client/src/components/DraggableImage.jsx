import React, { useRef, useEffect } from "react";
import {
  Transformer,
  Image,
} from "react-konva";
import useImage from "use-image";

// ─── Draggable Image ───────────────────────────────────────────────────────
export const DraggableImage = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const ref = useRef();
  const tr = useRef();
  const [img] = useImage(shapeProps.url, "anonymous");
  useEffect(() => {
    if (isSelected) {
      tr.current.nodes([ref.current]);
      tr.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Image
        ref={ref}
        image={img}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onDragEnd={e => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={e => {
          const node = ref.current;
          const scaleX = node.scaleX(),
                scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, shapeProps.width * scaleX),
            height: Math.max(5, shapeProps.height * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={tr}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      )}
    </>
  );
};
