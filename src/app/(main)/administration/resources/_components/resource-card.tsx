import { Resource } from "@/types/resource"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResourceCardProps {
    resource: Resource
}

export const ResourceCard = ({ resource }: ResourceCardProps) => {
    const date = new Date(resource.created_at)

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <div className="font-mono text-sm text-muted-foreground">
                            {resource.routeCode}
                        </div>
                        <h3 className="font-semibold text-lg leading-tight">
                            {resource.name}
                        </h3>
                    </div>
                    <Badge variant={resource.isActive ? "default" : "secondary"}>
                        {resource.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {resource.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {resource.description}
                    </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant="outline" className="text-xs">
                        Orden: {resource.orderIndex}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {date.toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
