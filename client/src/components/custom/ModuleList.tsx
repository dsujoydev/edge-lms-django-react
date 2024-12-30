import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";

interface Module {
  id: string;
  title: string;
  description: string;
}

interface ModuleListProps {
  courseId: string;
  isDrawer?: boolean;
  onClose?: () => void;
}

export function ModuleList({ courseId, isDrawer = false, onClose }: ModuleListProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      const response = await api.get(`/api/modules/?course_id=${courseId}`);
      setModules(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch modules.");
      toast({
        title: "Error",
        description: "Failed to fetch modules.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/modules/", { ...newModule, course_id: parseInt(courseId) });
      setNewModule({ title: "", description: "" });
      fetchModules();
      toast({
        title: "Success",
        description: "Module added successfully.",
      });
      if (onClose) onClose();
    } catch (err) {
      console.log(err);
      setError("Failed to add new module.");
      toast({
        title: "Error",
        description: "Failed to add new module.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading modules...</div>;
  if (error) return <div>Error: {error}</div>;

  const moduleForm = (
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
      <Button type="submit">Add Module</Button>
    </form>
  );

  const moduleList = (
    <Accordion type="single" collapsible className="w-full">
      {modules.map((module) => (
        <AccordionItem key={module.id} value={module.id}>
          <AccordionTrigger>{module.title}</AccordionTrigger>
          <AccordionContent>{module.description}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  if (isDrawer) {
    return moduleForm;
  }

  return (
    <div className="space-y-4">{modules.length === 0 ? <p>No modules found for this course.</p> : moduleList}</div>
  );
}
