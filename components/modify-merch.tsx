"use client"

import React, { useRef, useState } from 'react'
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card'
import { 
  Select, 
  SelectValue, 
  SelectTrigger, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FetchedMerch } from '@/constants/type'
import { Category } from '@/constants/type'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'

interface MerchFormProps {
  merch?: FetchedMerch;
  categories: Category[];
  onSubmit: (formData: Partial<FetchedMerch>) => void;
}

const ModifyMerch: React.FC<MerchFormProps> = ({ merch, categories, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<FetchedMerch>>({
    name: merch?.name || '',
    description: merch?.description || '',
    receiving_information: merch?.receiving_information || '',
    variant_name: merch?.variant_name || '',
    online_payment: merch?.online_payment || false,
    physical_payment: merch?.physical_payment || false,
    cancellable: merch?.cancellable || false,
    merchandise_pictures: merch?.merchandise_pictures || [],
    variants: merch?.variants || [],
    merchandise_categories: merch?.merchandise_categories || []
  });

  const [newVariant, setNewVariant] = useState({
    picture_url: '',
    name: '',
    original_price: 0,
    membership_price: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field: keyof FetchedMerch) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      
      setPreviewImages(prev => [...prev, ...newPreviews]);
      
      const newPictureObjects = fileArray.map(file => ({ 
        picture_url: '' // This will be replaced with actual upload logic
      }));

      setFormData(prev => ({
        ...prev,
        merchandise_pictures: [
          ...(prev.merchandise_pictures || []),
          ...newPictureObjects
        ]
      }));
    }
  };

  const handleAddVariant = () => {
    if (newVariant.name && newVariant.original_price > 0) {
      setFormData(prev => ({
        ...prev,
        variants: [...(prev.variants || []), newVariant]
      }));
      setNewVariant({
        picture_url: '',
        name: '',
        original_price: 0,
        membership_price: 0
      });
    }
  };

  const handleRemovePicture = (index: number) => {
    setFormData(prev => ({
      ...prev,
      merchandise_pictures: prev.merchandise_pictures?.filter((_, i) => i !== index)
    }));
    
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    // Revoke object URL to free up memory
    URL.revokeObjectURL(previewImages[index]);
  };
  
  const handleRemoveExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      merchandise_pictures: prev.merchandise_pictures?.filter((_, i) => i !== index)
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      merchandise_categories: [{ cat_id: categoryId }]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{merch ? 'Modify Merchandise' : 'Create New Merchandise'}</CardTitle>
          <CardDescription>
            {merch ? 'Update the details of existing merchandise' : 'Add a new merchandise item'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Merchandise Name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Variant Name</Label>
              <Input
                name="variant_name"
                value={formData.variant_name}
                onChange={handleInputChange}
                placeholder="Variant Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Merchandise Description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Receiving Information</Label>
            <Textarea
              name="receiving_information"
              value={formData.receiving_information}
              onChange={handleInputChange}
              placeholder="How and where to receive the merchandise"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={formData.merchandise_categories?.[0]?.cat_id?.toString()}
              onValueChange={(value) => handleCategoryChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem 
                    key={category.id} 
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment and Cancellation Options */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="online_payment"
                checked={formData.online_payment}
                onCheckedChange={() => handleCheckboxChange('online_payment')}
              />
              <Label htmlFor="online_payment">Online Payment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="physical_payment"
                checked={formData.physical_payment}
                onCheckedChange={() => handleCheckboxChange('physical_payment')}
              />
              <Label htmlFor="physical_payment">Physical Payment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cancellable"
                checked={formData.cancellable}
                onCheckedChange={() => handleCheckboxChange('cancellable')}
              />
              <Label htmlFor="cancellable">Cancellable</Label>
            </div>
          </div>

          {/* Merchandise Pictures */}
          <div className="space-y-2">
          <Label>Merchandise Pictures</Label>
          
          {/* Existing Images */}
          {formData.merchandise_pictures && formData.merchandise_pictures.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {formData.merchandise_pictures.map((pic, index) => (
                <div key={`existing-${index}`} className="relative">
                  <img 
                    src={pic.picture_url} 
                    alt={`Existing merchandise pic ${index + 1}`} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 w-6 h-6 rounded-full p-1"
                    onClick={() => handleRemoveExistingImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Preview Images from New Uploads */}
          {previewImages.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {previewImages.map((preview, index) => (
                <div key={`preview-${index}`} className="relative">
                  <img 
                    src={preview} 
                    alt={`Merchandise pic ${index + 1}`} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 w-6 h-6 rounded-full p-1"
                    onClick={() => handleRemovePicture(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-center">
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Pictures
            </Button>
          </div>
        </div>

          {/* Variants Section */}
          <div className="space-y-2">
            <Label>Variants</Label>
            {formData.variants && formData.variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-center">
                <Input 
                  value={variant.name} 
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  placeholder="Variant Name" 
                />
                <Input 
                  type="number" 
                  value={variant.original_price} 
                  onChange={(e) => handleVariantChange(index, 'original_price', Number(e.target.value))}
                  placeholder="Original Price" 
                />
                <Input 
                  type="number" 
                  value={variant.membership_price} 
                  onChange={(e) => handleVariantChange(index, 'membership_price', Number(e.target.value))}
                  placeholder="Membership Price" 
                />
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    variants: prev.variants?.filter((_, i) => i !== index)
                  }))}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-4 gap-2 items-center">
              <Input
                value={newVariant.name}
                onChange={(e) => setNewVariant(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="New Variant Name"
              />
              <Input
                type="number"
                value={newVariant.original_price}
                onChange={(e) => setNewVariant(prev => ({
                  ...prev,
                  original_price: Number(e.target.value)
                }))}
                placeholder="Original Price"
              />
              <Input
                type="number"
                value={newVariant.membership_price}
                onChange={(e) => setNewVariant(prev => ({
                  ...prev,
                  membership_price: Number(e.target.value)
                }))}
                placeholder="Membership Price"
              />
              <Button type="button" onClick={handleAddVariant}>
                Add Variant
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {merch ? 'Update Merchandise' : 'Create Merchandise'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ModifyMerch