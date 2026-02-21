import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: any, imageFile?: File) => Promise<void>;
    initialData?: any;
    categories: any[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
    isOpen, onClose, onSave, initialData, categories
}) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        part_number: '',
        price: '',
        original_price: '',
        category_id: '',
        description: '',
        in_stock: true,
        image: '' // Existing image URL if any
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                brand: initialData.brand || '',
                part_number: initialData.part_number || '',
                price: initialData.price || '',
                original_price: initialData.original_price || '',
                category_id: initialData.category_id || '',
                description: initialData.description || '',
                in_stock: initialData.in_stock === 1 || initialData.in_stock === true,
                image: initialData.image || ''
            });
            setImagePreview(initialData.image || null);
        } else {
            setFormData({
                name: '', brand: '', part_number: '', price: '', original_price: '',
                category_id: '', description: '', in_stock: true, image: ''
            });
            setImagePreview(null);
        }
        setImageFile(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                original_price: formData.original_price ? parseFloat(formData.original_price) : null,
                in_stock: formData.in_stock ? 1 : 0
            };
            await onSave(submitData, imageFile || undefined);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Flatten categories for dropdown to show hierarchy
    const flattenCategories = (cats: any[], parentId: string | null = null, level: number = 0): any[] => {
        let result: any[] = [];
        const currentLevel = cats.filter(c => c.parent_id === parentId);
        for (const c of currentLevel) {
            result.push({ ...c, level });
            result = result.concat(flattenCategories(cats, c.id, level + 1));
        }
        return result;
    };
    const flatCategories = flattenCategories(categories);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-100 my-8">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-900 font-display">
                        {initialData ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-accent-red hover:bg-red-50 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                                <input
                                    type="text" required value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent-red focus:border-transparent transition-all"
                                    placeholder="e.g. Premium Brake Pads"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Brand</label>
                                    <input
                                        type="text" required value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent-red focus:border-transparent transition-all"
                                        placeholder="e.g. Brembo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">SKU / Part No.</label>
                                    <input
                                        type="text" required value={formData.part_number}
                                        onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent-red focus:border-transparent transition-all font-mono text-sm"
                                        placeholder="e.g. BR-1234"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price (€)</label>
                                    <input
                                        type="number" step="0.01" required value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent-red focus:border-transparent transition-all font-mono"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Original Price (€)</label>
                                    <input
                                        type="number" step="0.01" value={formData.original_price}
                                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent-red focus:border-transparent transition-all font-mono"
                                        placeholder="(Optional)"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                                <select
                                    required value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent-red focus:border-transparent transition-all"
                                >
                                    <option value="">Select Category...</option>
                                    {flatCategories.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {'\u00A0\u00A0'.repeat(c.level)}{c.level > 0 ? '└ ' : ''}{c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.in_stock}
                                        onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                                        className="w-5 h-5 rounded text-accent-red focus:ring-accent-red border-slate-300"
                                    />
                                    <span className="font-semibold text-slate-700">Product is In Stock</span>
                                </label>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Product Description</label>
                                <textarea
                                    rows={5} required value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent-red focus:border-transparent transition-all resize-none"
                                    placeholder="Detailed description of the part, specifications, and compatibility..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-accent-red transition-colors bg-slate-50 relative group cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {imagePreview ? (
                                        <div className="aspect-video w-full relative rounded-lg overflow-hidden bg-white">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white font-semibold flex items-center gap-2">
                                                    <Upload className="w-5 h-5" /> Change Image
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8 flex flex-col items-center justify-center text-slate-500">
                                            <Upload className="w-10 h-10 mb-3 text-slate-400 group-hover:text-accent-red transition-colors" />
                                            <span className="font-semibold mb-1">Click or drag image here</span>
                                            <span className="text-xs text-slate-400">JPG, PNG, WEBP up to 5MB</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-8">
                        <button
                            type="button" onClick={onClose}
                            className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit" disabled={loading}
                            className="px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-xl shadow-md hover:bg-accent-red transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
