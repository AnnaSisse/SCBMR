"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Boxes,
  PlusCircle,
  AlertTriangle,
  Search,
  ArrowLeft,
  Truck,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"

// Define the structure of an inventory item
interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  supplier: string
  lowStockThreshold: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
  lastUpdated: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const [formState, setFormState] = useState({
    id: "",
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    supplier: "",
    lowStockThreshold: 10,
  })

  useEffect(() => {
    // Load inventory data from localStorage or generate sample data
    const savedInventory = localStorage.getItem("labInventory")
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      generateSampleInventory()
    }
  }, [])

  useEffect(() => {
    // Update statuses whenever inventory changes
    const updatedInventory = inventory.map((item) => ({
      ...item,
      status: getStockStatus(item.quantity, item.lowStockThreshold),
    }))

    // Filter inventory based on search term
    const results = updatedInventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredInventory(results)
  }, [inventory, searchTerm])

  const generateSampleInventory = () => {
    const sampleData: InventoryItem[] = [
      {
        id: "INV001",
        name: "Reagent A",
        category: "Reagents",
        quantity: 50,
        unit: "bottles",
        supplier: "BioCorp",
        lowStockThreshold: 10,
        status: "In Stock",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "INV002",
        name: "Test Kits - COVID-19",
        category: "Test Kits",
        quantity: 8,
        unit: "kits",
        supplier: "HealthPro",
        lowStockThreshold: 20,
        status: "Low Stock",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "INV003",
        name: "Microscope Slides",
        category: "Consumables",
        quantity: 200,
        unit: "boxes",
        supplier: "LabEssentials",
        lowStockThreshold: 50,
        status: "In Stock",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "INV004",
        name: "Pipette Tips",
        category: "Consumables",
        quantity: 0,
        unit: "racks",
        supplier: "LabEssentials",
        lowStockThreshold: 20,
        status: "Out of Stock",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "INV005",
        name: "Control Solution - Level 1",
        category: "Reagents",
        quantity: 15,
        unit: "vials",
        supplier: "BioCorp",
        lowStockThreshold: 5,
        status: "In Stock",
        lastUpdated: new Date().toISOString(),
      },
    ]
    setInventory(sampleData)
    localStorage.setItem("labInventory", JSON.stringify(sampleData))
  }

  const getStockStatus = (quantity: number, threshold: number): "In Stock" | "Low Stock" | "Out of Stock" => {
    if (quantity === 0) return "Out of Stock"
    if (quantity <= threshold) return "Low Stock"
    return "In Stock"
  }

  const getStatusColor = (status: "In Stock" | "Low Stock" | "Out of Stock") => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "number" ? parseInt(value, 10) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    let updatedInventory
    if (editingItem) {
      // Update existing item
      updatedInventory = inventory.map((item) =>
        item.id === editingItem.id ? { ...item, ...formState, id: item.id, lastUpdated: new Date().toISOString() } : item,
      )
    } else {
      // Add new item
      const newItem: InventoryItem = {
        ...formState,
        id: `INV${Date.now()}`,
        status: getStockStatus(formState.quantity, formState.lowStockThreshold),
        lastUpdated: new Date().toISOString(),
      }
      updatedInventory = [...inventory, newItem]
    }
    setInventory(updatedInventory)
    localStorage.setItem("labInventory", JSON.stringify(updatedInventory))
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item)
    setFormState({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      supplier: item.supplier,
      lowStockThreshold: item.lowStockThreshold,
    })
    setIsDialogOpen(true)
  }

  const openNewDialog = () => {
    setEditingItem(null)
    setFormState({
      id: "",
      name: "",
      category: "",
      quantity: 0,
      unit: "",
      supplier: "",
      lowStockThreshold: 10,
    })
    setIsDialogOpen(true)
  }

  const deleteItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updatedInventory = inventory.filter((item) => item.id !== itemId)
      setInventory(updatedInventory)
      localStorage.setItem("labInventory", JSON.stringify(updatedInventory))
    }
  }

  const lowStockCount = filteredInventory.filter((item) => item.status === "Low Stock").length
  const outOfStockCount = filteredInventory.filter((item) => item.status === "Out of Stock").length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Boxes className="h-8 w-8 text-blue-600" />
              Inventory Management
            </h1>
            <p className="text-gray-600">Track and manage laboratory supplies and reagents.</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Boxes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredInventory.length}</div>
              <p className="text-xs text-muted-foreground">different types of items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">items need reordering soon</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockCount}</div>
              <p className="text-xs text-muted-foreground">items are unavailable</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reorder Suggestions</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full">
                Generate Reorder List
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Inventory List</CardTitle>
                <CardDescription>All current lab supplies.</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, category..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openNewDialog}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Edit Item" : "Add New Inventory Item"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" name="name" value={formState.name} onChange={handleFormChange} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Input
                          id="category"
                          name="category"
                          value={formState.category}
                          onChange={handleFormChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                          Quantity
                        </Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={formState.quantity}
                          onChange={handleFormChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="unit" className="text-right">
                          Unit
                        </Label>
                        <Input id="unit" name="unit" value={formState.unit} onChange={handleFormChange} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="supplier" className="text-right">
                          Supplier
                        </Label>
                        <Input
                          id="supplier"
                          name="supplier"
                          value={formState.supplier}
                          onChange={handleFormChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lowStockThreshold" className="text-right">
                          Low Stock At
                        </Label>
                        <Input
                          id="lowStockThreshold"
                          name="lowStockThreshold"
                          type="number"
                          value={formState.lowStockThreshold}
                          onChange={handleFormChange}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" onClick={handleSubmit}>
                        {editingItem ? "Save Changes" : "Add Item"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
