import React, { useState, useEffect } from "react";
import { CardComponent } from "./CardComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/utils/api";

interface Module {
  id: string;
  title: string;
  description: string;
  order: string;
}

interface ModuleListProps {
  courseId: string;
}

export function ModuleList({ courseId }: ModuleListProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [newModule, setNewModule] = useState({ title: "", description: "", order: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = React.useCallback(async () => {
    try {
      const response = await api.get(`/api/courses/${courseId}/modules/`);
      setModules(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch modules.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchModules();
  }, [courseId, fetchModules]);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/courses/${courseId}/modules/`, newModule);
      setNewModule({ title: "", description: "", order: "" });
      fetchModules();
    } catch (err) {
      console.log(err);
      setError("Failed to add new module.");
    }
  };

  if (loading) return <div>Loading modules...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <CardComponent
      title="Course Modules"
      description="View and add modules for this course."
      footer={
        <form onSubmit={handleAddModule} className="space-y-4">
          <div>
            <Label htmlFor="moduleTitle">Module Title</Label>
            <Input
              id="moduleTitle"
              value={newModule.title}
              onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="moduleDescription">Module Description</Label>
            <Input
              id="moduleDescription"
              value={newModule.description}
              onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="moduleOrder">Module Order</Label>
            <Input
              id="moduleOrder"
              value={newModule.order}
              onChange={(e) => setNewModule({ ...newModule, order: e.target.value })}
              required
            />
          </div>
          <Button type="submit">Add Module</Button>
        </form>
      }
    >
      {modules.length === 0 ? (
        <p>No modules found for this course.</p>
      ) : (
        <ul className="space-y-2">
          {modules.map((module) => (
            <li key={module.id} className="border p-2 rounded">
              <h3 className="font-bold">{module.title}</h3>
              <p>{module.description}</p>
            </li>
          ))}
        </ul>
      )}
    </CardComponent>
  );
}
