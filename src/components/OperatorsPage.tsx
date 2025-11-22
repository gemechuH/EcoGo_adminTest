"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  UserPlus,
  Users,
  Edit,
  Trash2,
  Calendar,
  Activity,
  CircleOff,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import { User } from "@/types";
import { toast } from "sonner";
import Logo from "./Logo";

const mockOperators: User[] = [
  {
    id: "1",
    uid: "2",
    name: "Heyru Jemal",
    email: "operator@ecogo.ca",
    role: "operator",
    status: "active",
    createdAt: "2024-03-10",
    lastLogin: "2025-11-15T08:15:00",
  },
  {
    id: "2",
    uid: "2",
    name: "Alex Thompson",
    email: "alex.thompson@ecogo.ca",
    role: "operator",
    status: "active",
    createdAt: "2024-03-10",
    lastLogin: "2025-11-15T08:15:00",
  },
  {
    id: "3",
    uid: "3",
    name: "Jessica Martinez",
    email: "jessica.m@ecogo.ca",
    role: "operator",
    status: "inactive",
    createdAt: "2024-03-15",
    lastLogin: "2025-11-15T07:30:00",
  },
  {
    id: "4",
    uid: "4",
    name: "David Lee",
    email: "david.lee@ecogo.ca",
    role: "operator",
    status: "active",
    createdAt: "2024-04-01",
    lastLogin: "2025-11-14T18:45:00",
  },
  {
    id: "5",
    uid: "5",
    name: "Rachel Green",
    email: "rachel.g@ecogo.ca",
    role: "operator",
    status: "inactive",
    createdAt: "2024-04-20",
    lastLogin: "2025-11-15T06:20:00",
  },
];

export function OperatorsPage() {
  const [operators, setOperators] = useState<User[]>(mockOperators);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredOperators = operators.filter(
    (operator) =>
      operator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOperator = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOperator: User = {
      id: `${operators.length + 1}`,
      uid: `${operators.length + 1}`,

      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: "operator",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setOperators([...operators, newOperator]);
    setIsAddDialogOpen(false);
    toast.success("Operator added successfully!");
  };

  const handleDeleteOperator = (id: string) => {
    setOperators(operators.filter((operator) => operator.id !== id));
    toast.success("Operator deleted successfully!");
  };

  const stats = [
    {
      label: "Total Operators",
      value: operators.length,
      icon: Users,
      color: "text-black",
    },
    {
      label: "Active",
      value: operators.filter((o) => o.status === "active").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Inactive",
      value: operators.filter((o) => o.status === "inactive").length,

      icon: CircleOff,
      color: "text-black",
    },
  ];

  return (
    <div className="bg-white min-h-screen border-none shadow-md rounded-lg p-4">
      <div className="flex lg:hidden justify-center">
        <Logo />
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Reduced initial padding for smaller screens */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full">
            <h1 className="font-bold text-1xl sm:text-3xl bg-[var(--charcoal-dark)] text-white p-1 rounded-md w-full">
              Operator Dashboard
            </h1>
            <p style={{ color: "#2D2D2D" }} className="pl-3">
              Manage operators with access to bookings and dispatch
            </p>
          </div>
        </div>
        <div className="flex justify-end ">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: "#2DB85B", color: "white" }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Operator
              </Button>
            </DialogTrigger>
            <DialogContent
              className="
        max-w-md p-6 rounded-lg shadow-xl
        text-[#1E1E1E] bg-white
        !bg-[white]
        border border-[#ffffff]
      "
              style={{
                backgroundColor: "#1E1E1E",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
              }}
            >
              <DialogHeader>
                <DialogTitle>Add New Operator</DialogTitle>
                <DialogDescription className="text-[#2D2D2D]">
                  Create a new operator account with limited system access
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddOperator} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Gem hund"
                    required
                    className="bg-[#ffffff] text-[#1E1E1E] border border-[#444]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="gem@ecogo.ca"
                    required
                    className="bg-[#ffffff] text-[#1E1E1E] border border-[#444]"
                  />
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "#E0F2FE" }}
                >
                  <p className="text-sm" style={{ color: "#075985" }}>
                    <strong>Operator Access:</strong> This user will have access
                    to bookings, dispatch management, and basic reports. They
                    cannot access user management, settings, or audit logs.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#2DB85B", color: "white" }}
                  >
                    Create Operator
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 w-full h-auto gap-4 md:gap-8 lg:gap-32">
          {" "}
          {/* Changed gap and made it 2 columns on small/medium screens, 3 on large */}
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="bg-white border-none shadow-lg w-full" /* w-70 changed to w-full to be responsive */
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      {/* <Icon className="w-5 h-5" style={{ color: "#2DB85B" }} /> */}
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <h3 style={{ color: "#2D2D2D" }}>{stat.value}</h3>
                  </div>
                  <p className="mt-6" style={{ color: "#2D2D2D" }}>
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Card className=" border-none shadow-lg rounded-lg h-16 my-5">
          <div className="relative bg-white border-none rounded-lg">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800"
              style={{ color: "#2D2D2D" }}
            />
            <Input
              placeholder="Search operators by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-none rounded-lg focus:outline-none h-16 text-lg focus:ring-0 shadow-none "
              style={{
                boxShadow: "none", // removes internal shadow
                outline: "none", // removes browser outline
              }}
            />
          </div>
        </Card>
        <Card className="bg-white border-none shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="bg-[var(--charcoal-dark)] text-white p-1 rounded-md w-full">
              All Operators
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {" "}
            {/* Remove padding here to allow table overflow to use all CardContent space */}
            <div className="overflow-x-auto">
              {" "}
              {/* Added overflow-x-auto to make the table horizontally scrollable on small screens */}
              <table className="min-w-full divide-y divide-gray-200">
                {" "}
                {/* Added min-w-full to ensure it can scroll */}
                <thead>
                  <tr
                    style={{ borderBottomWidth: "1px", borderColor: "#E6E6E6" }}
                  >
                    <th className="text-left p-4 whitespace-nowrap">Name</th>{" "}
                    {/* Added whitespace-nowrap to prevent column headers from wrapping */}
                    <th className="text-left p-4 whitespace-nowrap">Email</th>
                    <th className="text-left p-4 whitespace-nowrap">Status</th>
                    <th className="text-left p-4 whitespace-nowrap">Created</th>
                    <th className="text-left p-4 whitespace-nowrap">
                      Last Login
                    </th>
                    <th className="text-right p-4 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOperators.map((operator) => (
                    <tr
                      key={operator.id}
                      style={{
                        borderBottomWidth: "1px",
                        borderColor: "#E6E6E6",
                      }}
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users
                            className="w-4 h-4"
                            style={{ color: "#2DB85B" }}
                          />
                          <span>{operator.name}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {operator.email}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge
                          style={
                            operator.status === "active"
                              ? { backgroundColor: "#D0F5DC", color: "#1B6635" }
                              : { backgroundColor: "#E6E6E6", color: "#2D2D2D" }
                          }
                        >
                          {operator.status}
                        </Badge>
                      </td>
                      <td
                        className="p-4 text-sm whitespace-nowrap"
                        style={{ color: "#2D2D2D" }}
                      >
                        {new Date(operator.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        className="p-4 text-sm whitespace-nowrap"
                        style={{ color: "#2D2D2D" }}
                      >
                        {operator.lastLogin
                          ? new Date(operator.lastLogin).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteOperator(operator.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
