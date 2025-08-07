import React, { useRef, useEffect } from "react";
import {
  Rect,
  Transformer,
  Circle,
  Ellipse,
} from "react-konva";

// ─── Draggable Rectangle ─────────────────────────────────────────────────
export const DraggableRect = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
      <Rect
        ref={ref}
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
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={tr}
          rotateEnabled
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

// ─── Draggable Circle ────────────────────────────────────────────────────
export const DraggableCircle = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
      <Circle
        ref={ref}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onDragEnd={e => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={e => {
          const node = ref.current;
          const scale = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            radius: Math.max(5, shapeProps.radius * scale),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={tr}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          ignoreStroke
        />
      )}
    </>
  );
};

// ─── Draggable Ellipse ───────────────────────────────────────────────────
export const DraggableEllipse = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
      <Ellipse
        ref={ref}
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
            radiusX: Math.max(5, shapeProps.radiusX * scaleX),
            radiusY: Math.max(5, shapeProps.radiusY * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={tr}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          ignoreStroke
        />
      )}
    </>
  );
};
