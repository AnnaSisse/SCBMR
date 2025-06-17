"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Database, Download, Upload, RefreshCw, Settings } from "lucide-react"

export default function DataManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
              <p className="text-gray-600">Manage and maintain system data</p>
            </div>
          </div>
        </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Database Backup
              </CardTitle>
              <CardDescription>Create and manage database backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Restore Backup
                </Button>
              </div>
              </CardContent>
            </Card>

          <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-green-600" />
                Data Synchronization
                </CardTitle>
              <CardDescription>Sync data across different systems</CardDescription>
              </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start Sync
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Sync Settings
                </Button>
                </div>
              </CardContent>
            </Card>

          <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Data Settings
                </CardTitle>
              <CardDescription>Configure data management settings</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Data Settings
                </Button>
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Database Settings
                </Button>
                </div>
              </CardContent>
            </Card>
          </div>
      </div>
    </div>
  )
}
