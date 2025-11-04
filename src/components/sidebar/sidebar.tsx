"use client"
import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Send, UsersRound, Home, PhoneOutgoing, FileUser, Users, House, ChevronLeft, ChevronRight, X, Globe, Building2, MapPinHouse, UserRoundSearch, MailSearch, UserPen, Store, BookUser, LaptopMinimalCheck, ReceiptText, FileDiff, ArrowRightLeft, Luggage, BaggageClaim, HandCoins, Receipt, CircleDollarSign, SearchCheck, BookOpen, CreditCard, Wallet, Briefcase, PieChart, FileText, RefreshCcw, Wifi, ClipboardList, User, Cpu, List, ShieldCheck, Shield, UserRound, UserCog, TrendingUp, Ticket, BarChart3, Settings, Package, FileCheck, Network } from "lucide-react"
import { GrUserSettings } from "react-icons/gr"
import { ImProfile } from "react-icons/im"
import Can from "../permission/can"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { SidebarMenuItem } from "./sidebar-menu-item"
import { FaCogs } from "react-icons/fa"
import { useAbility } from "@/contexts/AbilityContext"
import { MdOutlineWarehouse } from "react-icons/md";
import { AiOutlineBlock } from "react-icons/ai";
import { BsBox2, BsBoxes, BsDatabaseAdd } from "react-icons/bs";
import { BiNetworkChart } from "react-icons/bi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
  onCreateBoard?: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobile: boolean
}

export function Sidebar({
  className,
  onClose,
  onCreateBoard,
  isCollapsed,
  onToggleCollapse,
  isMobile,
}: SidebarProps) {
  const pathname = usePathname() || ''
  const { user, loading } = useAuth()
  const { layoutMode, sidebarColor, colorScheme } = useTheme()
  const isDetached = layoutMode === "detached"

  const getSidebarColorClass = () => {
    if (sidebarColor.startsWith("#")) {
      return `bg-[${sidebarColor}] text-white`
    }

    switch (sidebarColor) {
      case "light":
        return "bg-background text-purple-900 dark:bg-purple-900 dark:text-purple-100"
      case "dark":
        return "bg-[#350035] text-purple-100 dark:bg-purple-900 dark:text-purple-200"
      case "hemmy":
        return "bg-[#5E3583] text-white"
      default:
        return "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
    }
  }


  useEffect(() => {
    if (isMobile && isCollapsed) {
      onToggleCollapse()
    }
  }, [ isMobile, isCollapsed, onToggleCollapse ])

  const ability = useAbility();

  // Verificaciones de permisos
  const canViewCustomer = ability.can('read', 'Customer');
  const canViewPayment = ability.can('read', 'Payment');
  const canViewSubscription = ability.can('read', 'Subscription');
  const canViewService = ability.can('read', 'Service');
  const canViewPlan = ability.can('read', 'Plan');
  const canViewInstallation = ability.can('read', 'Installation');
  const canViewEquipment = ability.can('read', 'Equipment');
  const canViewEmployee = ability.can('read', 'Employee');
  const canViewUser = ability.can('read', 'User');
  const canViewRole = ability.can('read', 'Role');
  const canViewPermission = ability.can('read', 'Permission');
  const canViewTicket = ability.can('read', 'Ticket');
  const canViewPrediction = ability.can('read', 'Prediction');

  // Rutas para el Dashboard
  const dashboardPaths = [
    "/dashboard",
    "/"
  ];

  // Rutas para Clientes
  const clientPaths = [
    "/client",
    "/client/clients",
    "/client/subscriptions",
    "/client/payments",
    "/client/invoices"
  ];

  // Rutas para Servicios
  const servicePaths = [
    "/services",
    "/services/list",
    "/services/services",
    "/services/plans"
  ];

  // Rutas para Instalaciones
  const installationPaths = [
    "/installations",
    "/installations/list",
    "/installations/equipment",
    "/installations/employees"
  ];

  // Rutas para Empleados
  const employeePaths = [
    "/employee/employees",
    "/employee/list",
    "/employee/equipment"
  ];

  // Rutas para Administración
  const administrationPaths = [
    "/administration/users",
    "/administration/roles",
    "/administration/permissions",
    "/administration/sectors",
    "/administration/config"
  ];

  // Rutas para Soporte y Análisis
  const supportPaths = [
    "/support",
    "/support/tickets",
    "/predictions"
  ];

  // Rutas para Configuración
  const configurationPaths = [
    "/configuration",
    "/administration/configurations"
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-colors duration-300",
        isDetached && "rounded-lg",
        getSidebarColorClass(),
        className
      )}
      data-sidebar-color={sidebarColor}
    >
      <div className={cn("flex flex-col items-center", isCollapsed ? "p-2" : "px-3 py-2")}>
        <Link href="/" className={cn("flex items-center", isCollapsed ? "pb-4" : "py-2 -ml-6")}>
          {!isCollapsed && (
            <>
              {sidebarColor === "hemmy" ? (
                <img src="/logos/hemmy_icon.png" alt="Logo Hemmy" className="w-32" />
              ) : (
                <>
                  {colorScheme === "dark" ? (
                    <img src="/logos/hemmy_icon.png" alt="Logo Hemmy" className="w-32" />
                  ) : (
                    <img src="/logos/minilogo_grupo_hemmy.png" alt="Logo Hemmy" className="w-32" />
                  )}
                </>
              )}
            </>
          )}
          {isCollapsed && (
            <>
              {sidebarColor === "hemmy" ? (
                <img src="/logos/hemmy_icon.png" alt="" className="w-[2.20rem]" />
              ) : colorScheme === "dark" ? (
                <img src="/logos/hemmy_icon.png" alt="" className="w-[2.20rem]" />
              ) : (
                <img src="/logos/minilogo_grupo_hemmy.png" alt="" className="w-[2.20rem]" />
              )}
            </>
          )}
        </Link>
        {!isMobile && isCollapsed && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="w-10 h-10">
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        {!isMobile && !isCollapsed && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="absolute right-2 top-6">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-4">
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          <div className="px-3 py-2">
            {/* INICIO */}
            {!isCollapsed && (
              <h2 className="mb-2 px-2 text-xs font-bold tracking-tight uppercase">Inicio</h2>
            )}
            <div className={cn("space-y-1", isCollapsed && "flex flex-col items-center")}>
              <SidebarMenuItem
                key="dashboard"
                href="/dashboard"
                icon={Home}
                title="Dashboard"
                isCollapsed={isCollapsed}
                isActive={dashboardPaths.includes(pathname)}
              />

              {/* 1. CLIENTES */}
              {(canViewCustomer || canViewPayment || canViewSubscription) && !isCollapsed && (
                <h2 className="mb-2 mt-4 px-2 text-xs font-bold tracking-tight uppercase">Clientes</h2>
              )}

              <Can action="read" subject="Customer">
                <SidebarMenuItem
                  key="clients"
                  icon={UserRoundSearch}
                  title="Clientes"
                  isCollapsed={isCollapsed}
                  isActive={clientPaths.includes(pathname)}
                >
                  <Can action="read" subject="Customer">
                    <SidebarMenuItem
                      key="clients-list"
                      href="/client/clients"
                      icon={UsersRound}
                      title="Clientes"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/client/clients"}
                    />
                  </Can>
                  <Can action="read" subject="Subscription">
                    <SidebarMenuItem
                      key="subscriptions"
                      href="/client/subscriptions"
                      icon={BookOpen}
                      title="Suscripciones"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/client/subscriptions"}
                    />
                  </Can>
                  <Can action="read" subject="Payment">
                    <SidebarMenuItem
                      key="payments"
                      href="/client/payments"
                      icon={CreditCard}
                      title="Pagos"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/client/payments"}
                    />
                  </Can>
                  <Can action="read" subject="Payment">
                    <SidebarMenuItem
                      key="invoices"
                      href="/client/invoices"
                      icon={Receipt}
                      title="Comprobantes"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/client/invoices"}
                    />
                  </Can>
                </SidebarMenuItem>
              </Can>

              {/* 3. INSTALACIONES */}
              {(canViewInstallation || canViewEquipment) && !isCollapsed && (
                <h2 className="mb-2 mt-4 px-2 text-xs font-bold tracking-tight uppercase">Instalaciones</h2>
              )}

              <Can action="read" subject="Installation">
                <SidebarMenuItem
                  key="installations"
                  icon={House}
                  title="Instalaciones"
                  isCollapsed={isCollapsed}
                  isActive={installationPaths.includes(pathname)}
                >
                  <Can action="read" subject="Installation">
                    <SidebarMenuItem
                      key="installations-list"
                      href="/installations/list"
                      icon={MapPinHouse}
                      title="Instalaciones"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/installations/list"}
                    />
                  </Can>
                  <Can action="read" subject="Equipment">
                    <SidebarMenuItem
                      key="installation-equipment"
                      href="/installations/equipment"
                      icon={Package}
                      title="Equipos de instalación"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/installations/equipment"}
                    />
                  </Can>
                  <Can action="read" subject="Employee">
                    <SidebarMenuItem
                      key="installation-employees"
                      href="/installations/employees"
                      icon={Users}
                      title="Empleados asignados"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/installations/employees"}
                    />
                  </Can>
                </SidebarMenuItem>
              </Can>

              {/* 2. SERVICIOS */}
              {(canViewService || canViewPlan) && !isCollapsed && (
                <h2 className="mb-2 mt-4 px-2 text-xs font-bold tracking-tight uppercase">Servicios</h2>
              )}

              <Can action="read" subject="Service">
                <SidebarMenuItem
                  key="services"
                  icon={Wifi}
                  title="Servicios"
                  isCollapsed={isCollapsed}
                  isActive={servicePaths.includes(pathname)}
                >
                  <Can action="read" subject="Service">
                    <SidebarMenuItem
                      key="services-list"
                      href="/services/services"
                      icon={Network}
                      title="Servicios"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/services/services"}
                    />
                  </Can>
                  <Can action="read" subject="Plan">
                    <SidebarMenuItem
                      key="plans"
                      href="/services/plans"
                      icon={ClipboardList}
                      title="Planes"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/services/plans"}
                    />
                  </Can>
                </SidebarMenuItem>
              </Can>

              {/* 4. EMPLEADOS */}
              {canViewEmployee && !isCollapsed && (
                <h2 className="mb-2 mt-4 px-2 text-xs font-bold tracking-tight uppercase">Empleados</h2>
              )}

              <Can action="read" subject="Employee">
                <SidebarMenuItem
                  key="employees"
                  icon={Briefcase}
                  title="Empleados"
                  isCollapsed={isCollapsed}
                  isActive={employeePaths.includes(pathname)}
                >
                  <Can action="read" subject="Employee">
                    <SidebarMenuItem
                      key="employees-list"
                      href="/employee/employees"
                      icon={Users}
                      title="Empleados"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/employee/employees"}
                    />
                  </Can>
                  <Can action="read" subject="Equipment">
                    <SidebarMenuItem
                      key="employees-equipment"
                      href="/employee/equipment"
                      icon={LaptopMinimalCheck}
                      title="Equipos asignados"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/employee/equipment"}
                    />
                  </Can>
                </SidebarMenuItem>
              </Can>

              {/* 5. ADMINISTRACIÓN */}
              {(canViewUser || canViewRole || canViewPermission) && !isCollapsed && (
                <h2 className="mb-2 mt-4 px-2 text-xs font-bold tracking-tight uppercase">Administración</h2>
              )}

              <Can action="read" subject="User">
                <SidebarMenuItem
                  key="administration"
                  icon={Settings}
                  title="Administración"
                  isCollapsed={isCollapsed}
                  isActive={administrationPaths.includes(pathname)}
                >
                  <Can action="read" subject="User">
                    <SidebarMenuItem
                      key="users"
                      href="/administration/users"
                      icon={User}
                      title="Usuarios"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/administration/users"}
                    />
                  </Can>
                  <Can action="read" subject="Role">
                    <SidebarMenuItem
                      key="roles-permissions"
                      href="/administration/roles"
                      icon={UserCog}
                      title="Roles y permisos"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/administration/roles" || pathname === "/administration/permissions"}
                    >
                      <Can action="read" subject="Role">
                        <SidebarMenuItem
                          key="roles"
                          href="/administration/roles"
                          icon={UserCog}
                          title="Roles"
                          isCollapsed={isCollapsed}
                          isActive={pathname === "/administration/roles"}
                        />
                      </Can>
                      <Can action="read" subject="Permission">
                        <SidebarMenuItem
                          key="permissions"
                          href="/administration/permissions"
                          icon={Shield}
                          title="Permisos"
                          isCollapsed={isCollapsed}
                          isActive={pathname === "/administration/permissions"}
                        />
                      </Can>
                    </SidebarMenuItem>
                  </Can>
                  <Can action="read" subject="Role">
                    <SidebarMenuItem
                      key="config"
                      href="/administration/config"
                      icon={ShieldCheck}
                      title="Configuración"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/administration/config"}
                    />
                  </Can>
                  <Can action="read" subject="Sector">
                    <SidebarMenuItem
                      key="sectors"
                      href="/administration/sectors"
                      icon={Building2}
                      title="Sectores"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/administration/sectors"}
                    />
                  </Can>
                </SidebarMenuItem>
              </Can>
              <Can action="read" subject="Configuration">
                <SidebarMenuItem
                  key="configuration"
                  icon={Settings}
                  title="Configuración"
                  isCollapsed={isCollapsed}
                  isActive={configurationPaths.includes(pathname)}
                />
              </Can>

              {/* 6. SOPORTE Y ANÁLISIS */}
              {(canViewTicket || canViewPrediction) && !isCollapsed && (
                <h2 className="mb-2 mt-4 px-2 text-xs font-bold tracking-tight uppercase">Soporte y Análisis</h2>
              )}

              <Can action="read" subject="Ticket">
                <SidebarMenuItem
                  key="support"
                  icon={Ticket}
                  title="Soporte y Análisis"
                  isCollapsed={isCollapsed}
                  isActive={supportPaths.includes(pathname)}
                >
                  <Can action="read" subject="Ticket">
                    <SidebarMenuItem
                      key="tickets"
                      href="/support/tickets"
                      icon={Ticket}
                      title="Ticket de atención"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/support/tickets"}
                    />
                  </Can>
                  <Can action="read" subject="Prediction">
                    <SidebarMenuItem
                      key="predictions"
                      href="/predictions"
                      icon={TrendingUp}
                      title="Predicción con IA"
                      isCollapsed={isCollapsed}
                      isActive={pathname === "/predictions"}
                    />
                  </Can>
                </SidebarMenuItem>
              </Can>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Sidebar;
