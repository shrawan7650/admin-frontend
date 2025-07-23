// Final fully responsive User Management Page with mobile + desktop views + pagination

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  User,
  Calendar,
} from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllUsers, setLoading } from "@/redux/slices/authSlice";
import { Spinner } from "@/components/ui/spinner";

export default function UsersPage() {
  const { allUsers, isLoading, user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
console.log("h0DajErHfngYJzEUtIu9g355eyA3",allUsers)
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(getAllUsers());
    dispatch(setLoading(false));
  }, [dispatch]);

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && user.status === true;
    if (filter === "inactive") return matchesSearch && user.status === false;
    if (filter === "admin") return matchesSearch && user.role === "admin";
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const formatDate = (date: string | null | undefined) =>
  date ? new Date(date).toLocaleDateString() : "-";


  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                User Management
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage users and their permissions
              </p>
            </div>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" /> Add User
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm sm:text-base"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  {["all", "active", "inactive", "admin"].map((filterType) => (
                    <Button
                      key={filterType}
                      variant={filter === filterType ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(filterType)}
                      className="capitalize whitespace-nowrap text-xs sm:text-sm"
                    >
                      {filterType}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-60">
                  <Spinner />
                </div>
              ) : (
                <>
                  {/* Mobile View */}
                  <div className="block sm:hidden space-y-4">
                    {paginatedUsers.map((user) => (
                      <Card key={user.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-muted-foreground text-xs">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Link href={`/admin/users/${user.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              {currentUser?.id === user.id && (
  <Link href={`/admin/users/${user.id}/edit`}>
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  </Link>
)}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Posts</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                  />
                                  <AvatarFallback>
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                <Shield className="h-3 w-3 mr-1" />
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={user.status ? "default" : "secondary"}
                              >
                                {user.status ? "active" : "inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                            
                              {user.totalPosts || 0}
                            </TableCell>
                            <TableCell>
                             
                              {formatDate(user.createdAt)}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(user.lastLogin)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/admin/users/${user.id}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                {currentUser?.id === user.id && (
  <Link href={`/admin/users/${user.id}/edit`}>
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  </Link>
)}

                                {/* <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button> */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              {/* Pagination Controls */}
              {filteredUsers.length > usersPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium">No users found</h3>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
      
        </div>

      </main>
    </div>
  );
}
