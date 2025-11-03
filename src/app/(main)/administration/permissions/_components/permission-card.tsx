import { Permission } from "@/types/permission"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PermissionCardProps {
    permission: Permission
}

export const PermissionCard = ({ permission }: PermissionCardProps) => {
    const date = new Date(permission.created_at)

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <div className="font-mono text-sm text-muted-foreground">
                            {permission.code}
                        </div>
                        <h3 className="font-semibold text-lg leading-tight">
                            {permission.name}
                        </h3>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {permission.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {permission.description}
                    </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
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

