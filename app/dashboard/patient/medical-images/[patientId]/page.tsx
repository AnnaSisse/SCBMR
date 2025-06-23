"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Image, X, Calendar, Type, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"

interface MedicalImage {
  id: string
  patientId: string
  imageData: string
  imageType: string
  uploadDate: string
  notes: string
}

export default function MedicalImagesPage({ params }: { params: { patientId: string } }) {
  const [patient, setPatient] = useState<any>(null)
  const [images, setImages] = useState<MedicalImage[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null)
  const [newImageData, setNewImageData] = useState({
    imageData: "",
    imageType: "X-Ray",
    notes: "",
  })

  useEffect(() => {
    // In a real app, you'd fetch patient data. Here we'll use a placeholder.
    const allPatients = JSON.parse(localStorage.getItem("patients") || "[]")
    const currentPatient = allPatients.find((p: any) => p.id === params.patientId)
    setPatient(currentPatient || { id: params.patientId, name: "Unknown Patient" })

    // Load images from localStorage
    const allImages = JSON.parse(localStorage.getItem("medicalImages") || "[]") as MedicalImage[]
    setImages(allImages.filter((img) => img.patientId === params.patientId))
  }, [params.patientId])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImageData((prev) => ({ ...prev, imageData: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const saveNewImage = () => {
    if (!newImageData.imageData) {
      alert("Please select an image to upload.")
      return
    }

    const newImage: MedicalImage = {
      id: `IMG_${Date.now()}`,
      patientId: params.patientId,
      imageData: newImageData.imageData,
      imageType: newImageData.imageType,
      uploadDate: new Date().toISOString(),
      notes: newImageData.notes,
    }

    const allImages = JSON.parse(localStorage.getItem("medicalImages") || "[]")
    const updatedImages = [...allImages, newImage]
    localStorage.setItem("medicalImages", JSON.stringify(updatedImages))

    setImages((prev) => [...prev, newImage])
    setIsUploadDialogOpen(false)
    setNewImageData({ imageData: "", imageType: "X-Ray", notes: "" })
  }

  const deleteImage = (imageId: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const allImages = JSON.parse(localStorage.getItem("medicalImages") || "[]") as MedicalImage[]
      const updatedImages = allImages.filter((img) => img.id !== imageId)
      localStorage.setItem("medicalImages", JSON.stringify(updatedImages))
      setImages(images.filter((img) => img.id !== imageId))
      setIsViewDialogOpen(false)
    }
  }

  const openViewDialog = (image: MedicalImage) => {
    setSelectedImage(image)
    setIsViewDialogOpen(true)
  }

  if (!patient) return <div>Loading patient data...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Image className="h-8 w-8 text-blue-600" />
              Medical Images
            </h1>
            <p className="text-gray-600">
              Viewing images for patient: <span className="font-semibold">{patient.name}</span> (ID: {patient.id})
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/patients">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Button>
            </Link>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Medical Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="image-file">Image File</Label>
                    <Input id="image-file" type="file" accept="image/*" onChange={handleImageUpload} />
                    {newImageData.imageData && (
                      <img src={newImageData.imageData} alt="Preview" className="mt-4 rounded-lg max-h-64" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="image-type">Image Type</Label>
                    <select
                      id="image-type"
                      value={newImageData.imageType}
                      onChange={(e) => setNewImageData((prev) => ({ ...prev, imageType: e.target.value }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option>X-Ray</option>
                      <option>MRI</option>
                      <option>CT Scan</option>
                      <option>Ultrasound</option>
                      <option>Clinical Photo</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={newImageData.notes}
                      onChange={(e) => setNewImageData((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="e.g., Left knee, post-op"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={saveNewImage}>Save Image</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Image Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
            <CardDescription>{images.length} image(s) found for this patient.</CardDescription>
          </CardHeader>
          <CardContent>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image) => (
                  <Card
                    key={image.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow group relative"
                    onClick={() => openViewDialog(image)}
                  >
                    <img
                      src={image.imageData}
                      alt={image.imageType}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="p-2">
                      <p className="font-semibold text-sm truncate">{image.imageType}</p>
                      <p className="text-xs text-gray-500">{new Date(image.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">No medical images</h3>
                <p className="mt-1 text-sm">Get started by uploading an image.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Image Dialog */}
        {selectedImage && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedImage.imageType}</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-12"
                  onClick={() => deleteImage(selectedImage.id)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </DialogHeader>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <img
                    src={selectedImage.imageData}
                    alt={selectedImage.imageType}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Image Details</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedImage.imageType}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Uploaded on {new Date(selectedImage.uploadDate).toLocaleString()}</span>
                  </div>
                  {selectedImage.notes && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-500 mt-1" />
                      <p className="border-l-2 pl-4">{selectedImage.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
