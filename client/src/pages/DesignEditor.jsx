// src/pages/DesignEditor.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
} from "react-konva";
import { nanoid } from "nanoid";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import {
  getDesignById,
  createDesign,
  updateDesign,
} from "../api/designs";
import { Button } from "../components/ui/button";
import { DraggableCircle, DraggableRect, DraggableEllipse  } from "../components/DraggableShapes";
import { DraggableText } from "../components/DraggableText";
import { DraggableImage } from "../components/DraggableImage";
import { deleteImageCloud } from '../api/uploads.js';

export default function DesignEditor() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { token } = useAuth();
  const stageRef = useRef();

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // undo/redo history
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(-1);

  const [saving, setSaving] = useState(false);

  // chosen shape type
  const [newShape, setNewShape] = useState("rect");

  // Load existing design
  useEffect(() => {
  if (!id) return;
  (async () => {
    try {
      const { data } = await getDesignById(id, token);
      const stageJson = data.jsonData; 

      // Find the Layer node
      const layerNode = (stageJson.children || []).find(
        (n) => n.className === "Layer"
      ) || { children: [] };

      // Map each Konva node into a shapeProps object:
      const loaded = layerNode.children.map((node) => ({
        // use the id you originally set on each shape
        id: node.attrs.id,
        // className e.g. "Rect", "Text", "Image", "Circle", "Ellipse"
        type: node.className.toLowerCase(),
        // all other props (x,y,width,height,text,fontSize,fill,…)
        ...node.attrs,
      }));

      setElements(loaded);
      pushHistory(loaded);
    } catch (err) {
      console.error(err);
      alert("Failed to load design.");
    }
  })();
}, [id, token]);

  // History helpers
  const pushHistory = (newEls = elements) => {
    const h = history.slice(0, step + 1);
    h.push(newEls);
    setHistory(h);
    setStep(h.length - 1);
  };
  const undo = () => {
    if (step <= 0) return;
    setStep(step - 1);
    setElements(history[step - 1]);
    setSelectedId(null);
  };
  const redo = () => {
    if (step >= history.length - 1) return;
    setStep(step + 1);
    setElements(history[step + 1]);
    setSelectedId(null);
  };

  // Update / delete
  const updateElement = (eid, attrs) => {
    const next = elements.map(el => (el.id === eid ? { ...el, ...attrs } : el));
    setElements(next);
    pushHistory(next);
  };

const deleteSelected = async () => {
    if (!selectedId) return;

    // Find the element to delete
    const el = elements.find((e) => e.id === selectedId);

    // If it's an image, delete from Cloudinary first
    if (el?.type === 'image' && el.public_id) {
      try {
        await deleteImageCloud(el.public_id, token);
      } catch (err) {
        console.error('Cloudinary delete failed', err);
        // proceed anyway
      }
    }

    // Now remove it from the canvas state
    const next = elements.filter((e) => e.id !== selectedId);
    setElements(next);
    pushHistory(next);
    setSelectedId(null);
  };


  // Add shape factory
  const addShape = () => {
    let shape;
    const id_ = nanoid();
    switch (newShape) {
      case "rect":
        shape = { id: id_, type: "rect", x: 50, y: 50, width: 100, height: 60, fill: "#00D2FF", rotation: 0 };
        break;
      case "circle":
        shape = { id: id_, type: "circle", x: 100, y: 100, radius: 50, fill: "#FF7F50" };
        break;
      case "ellipse":
        shape = { id: id_, type: "ellipse", x: 150, y: 150, radiusX: 70, radiusY: 40, fill: "#8A2BE2" };
        break;
      default:
        return;
    }
    const next = [...elements, shape];
    setElements(next);
    pushHistory(next);
  };

  const addText = () => {
    const txt = { id: nanoid(), type: "text", x: 50, y: 50, text: "New Text", fontSize: 20, fill: "#333", rotation: 0 };
    const next = [...elements, txt];
    setElements(next);
    pushHistory(next);
  };

  // Upload image
   const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('designImage', file);

    try {
      // This returns { url, public_id }
      const { data } = await axios.post(
        `https://matty-design-tool.onrender.com//api/uploads/image`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Store both url and public_id on the element
      const imgEl = {
        id: nanoid(),
        type: 'image',
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        url: data.url,
        public_id: data.public_id,   // ← capture this for later deletion
        rotation: 0,
      };

      const next = [...elements, imgEl];
      setElements(next);
      pushHistory(next);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Image upload failed.');
    } finally {
      e.target.value = null;
    }
  };

  // Save design
  const saveDesign = async () => {
    setSaving(true);
    try {
      const json = JSON.parse(stageRef.current.toJSON());
      const thumb = stageRef.current.toDataURL({ pixelRatio: 0.5 });
      const payload = { title: `Design ${Date.now()}`, jsonData: json, thumbnailUrl: thumb };
      if (id) {
        await updateDesign(id, payload, token);
        alert("Design updated!");
      } else {
        const { data } = await createDesign(payload, token);
        navigate(`/editor/${data._id}`);
      }
    } catch {
      alert("Error saving design.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-16 flex h-[calc(100vh-64px)]">
      {/* ─── Toolbar ─────────────────────────────────────────── */}
      <aside className="w-64 bg-gray-800 p-4 space-y-4">
        {/* Choose & Add Shape */}
        <select
          value={newShape}
          onChange={e => setNewShape(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-700 text-gray-200"
        >
          <option value="rect">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="ellipse">Ellipse</option>
        </select>
        <Button onClick={addShape} variant="outline" className="w-full">
          Add Shape
        </Button>

        {/* Add Text */}
        <Button onClick={addText} variant="outline" className="w-full">
          Add Text
        </Button>

        {/* Add Image */}
        <div>
          <input
            type="file"
            accept="image/*"
            id="upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="upload"
            className="w-full block px-4 py-2 border rounded-md text-center text-gray-200 hover:bg-gray-700 cursor-pointer"
          >
            Add Image
          </label>
        </div>

        {/* Undo/Redo */}
        <div className="flex space-x-2">
          <Button onClick={undo} disabled={step <= 0} className="flex-1">
            Undo
          </Button>
          <Button onClick={redo} disabled={step >= history.length - 1} className="flex-1">
            Redo
          </Button>
        </div>

        {/* Delete Selected */}
        {selectedId && (
          <Button
            onClick={deleteSelected}
            variant="outline"
            className="w-full text-red-400 border-red-400 hover:bg-red-500 hover:text-white"
          >
            Delete Selected
          </Button>
        )}

        {/* Save & Back */}
        <Button onClick={saveDesign} disabled={saving} className="w-full">
          {saving ? "Saving…" : id ? "Update Design" : "Save Design"}
        </Button>
        <Button
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          className="w-full text-gray-400" 
        >
          Back to Dashboard
        </Button>

        {/* Text Properties Panel */}
        {selectedId && elements.find(el => el.id === selectedId)?.type === "text" && (
          <div className="bg-gray-700 p-3 rounded-md space-y-2">
            <h3 className="text-white font-semibold">Text Properties</h3>
            <input
              type="text"
              className="w-full px-2 py-1 rounded"
              value={elements.find(el => el.id === selectedId).text}
              onChange={e =>
                updateElement(selectedId, { text: e.target.value })
              }
            />
            <div className="flex items-center space-x-2">
              <label className="text-gray-200">Size</label>
              <input
                type="range"
                min="10"
                max="72"
                value={elements.find(el => el.id === selectedId).fontSize}
                onChange={e =>
                  updateElement(selectedId, {
                    fontSize: +e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-200">Color</label>
              <input
                type="color"
                value={elements.find(el => el.id === selectedId).fill}
                onChange={e =>
                  updateElement(selectedId, { fill: e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-200">Rotate</label>
              <input
                type="range"
                min="0"
                max="360"
                value={elements.find(el => el.id === selectedId).rotation}
                onChange={e =>
                  updateElement(selectedId, {
                    rotation: +e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </aside>

      {/* ─── Canvas ──────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-gray-100 relative">
        <Stage
          ref={stageRef}
          width={window.innerWidth - 256}
          height={window.innerHeight - 64}
          onMouseDown={e => {
            if (e.target === stageRef.current) {
              setSelectedId(null);
            }
          }}
        >
          <Layer>
            {elements.map(el => {
              switch (el.type) {
                case "rect":
                  return (
                    <DraggableRect
                      key={el.id}
                      shapeProps={el}
                      isSelected={el.id === selectedId}
                      onSelect={() => setSelectedId(el.id)}
                      onChange={attrs => updateElement(el.id, attrs)}
                    />
                  );
                case "circle":
                  return (
                    <DraggableCircle
                      key={el.id}
                      shapeProps={el}
                      isSelected={el.id === selectedId}
                      onSelect={() => setSelectedId(el.id)}
                      onChange={attrs => updateElement(el.id, attrs)}
                    />
                  );
                case "ellipse":
                  return (
                    <DraggableEllipse
                      key={el.id}
                      shapeProps={el}
                      isSelected={el.id === selectedId}
                      onSelect={() => setSelectedId(el.id)}
                      onChange={attrs => updateElement(el.id, attrs)}
                    />
                  );
                case "text":
                  return (
                    <DraggableText
                      key={el.id}
                      shapeProps={el}
                      isSelected={el.id === selectedId}
                      onSelect={() => setSelectedId(el.id)}
                      onChange={attrs => updateElement(el.id, attrs)}
                    />
                  );
                case "image":
                  return (
                    <DraggableImage
                      key={el.id}
                      shapeProps={el}
                      isSelected={el.id === selectedId}
                      onSelect={() => setSelectedId(el.id)}
                      onChange={attrs => updateElement(el.id, attrs)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
