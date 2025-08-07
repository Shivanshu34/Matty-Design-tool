import { useEffect, useState } from "react";
import { getDesigns, deleteDesign, getDesignById } from "../api/designs";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { deleteImageCloud } from "../api/uploads";

import dashboardBg from "../assets/dashboard.png";
import defaultThumb from "../assets/default_thumb.png";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const { data } = await getDesigns(token);
        setDesigns(data);
      } catch (err) {
        setError("Failed to load your designs.");
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      // 1) fetch full design to see its image public_ids
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

      // 2) delete each image found
      for (const el of loaded) {
        if (el.type === 'image' && el.public_id) {
          await deleteImageCloud(el.public_id, token); 
        }
      }

      // 3) now delete the design record
      await deleteDesign(id, token);

      // 4) update UI
      setDesigns((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete design.");
    }
  };


  if (loading) {
    return <div className="text-center text-white py-20">Loading your designs...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 py-20">{error}</div>;
  }

  return (
    <div
      className="pt-20 min-h-screen bg-cover bg-center bg-no-repeat px-6 py-10"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      <h1 className="text-3xl font-bold text-white mb-8">Welcome, {user?.name}</h1>

      {designs.length === 0 ? (
        <div className="text-white text-center text-lg">
          You haven’t created any designs yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div
              key={design._id}
              className="bg-white/10 backdrop-blur rounded-xl p-4 shadow-lg border border-white/20"
            >
              <img
                src={design.thumbnailUrl || defaultThumb}
                alt={design.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold text-white truncate">
                {design.title}
              </h2>
              <div className="mt-3 flex justify-between items-center">
                <button
                  onClick={() => navigate(`/editor/${design._id}`)}
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(design._id)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
