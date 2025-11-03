import { Role } from "@/types/role"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RoleCardProps {
    role: Role
}

export const RoleCard = ({ role }: RoleCardProps) => {
    const date = new Date(role.created_at)

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <div className="font-mono text-sm text-muted-foreground">
                            {role.code}
                        </div>
                        <h3 className="font-semibold text-lg leading-tight">
                            {role.name}
                        </h3>
                    </div>
                    <Badge variant={role.isSystem ? "default" : "outline"}>
                        {role.isSystem ? "Sistema" : "Personalizado"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {role.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {role.description}
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

