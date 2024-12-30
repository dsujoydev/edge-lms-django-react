import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  footer: ReactNode;
  width?: string;
}

export function CardComponent({ title, description, children, footer, width = "[350px]" }: CardProps) {
  return (
    <Card className={`w-${width}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col">{footer}</CardFooter>
    </Card>
  );
}
