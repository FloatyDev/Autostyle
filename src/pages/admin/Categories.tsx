import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Folders, Plus, Trash2, Edit2 } from 'lucide-react';
import { CategoryModal } from '../../components/admin/CategoryModal';

export const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const { token } = useAuth();

    const fetchCategories = () => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.data || []));
    };

    const mainCategories = categories.filter(c => !c.parent_id);
    const getSubcategories = (parentId: string) => categories.filter(c => c.parent_id === parentId);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setCategories(categories.filter(c => c.id !== id));
            } else {
                const data = await response.json();
                alert(data.error || data.details || 'Failed to delete category');
            }
        } catch (error) {
            alert('An unexpected error occurred while deleting the category');
        }
    };

    const handleSave = async (categoryData: any) => {
        const isEditing = !!editingCategory;
        const url = isEditing ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save category');
        }

        fetchCategories(); // Refresh list
    };

    const openAddModal = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category: any) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const renderCategory = (category: any, level: number = 0) => {
        const subs = getSubcategories(category.id);
        const hasSubs = subs.length > 0;

        return (
            <div key={category.id} className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${level === 0 ? 'mb-6' : ''}`}>
                <div className={`p-4 flex justify-between items-center ${level === 0 ? 'bg-slate-50 border-b border-slate-100' : 'hover:bg-slate-50 transition-colors'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center text-slate-700 bg-white rounded-xl shadow-sm border border-slate-100 ${level === 0 ? 'w-12 h-12' : 'w-10 h-10'}`}>
                            <Folders className={level === 0 ? "w-6 h-6" : "w-5 h-5"} />
                        </div>
                        <div>
                            <h3 className={`${level === 0 ? 'text-xl font-bold' : 'text-md font-semibold'} text-gray-900`}>{category.name}</h3>
                            {category.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{category.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => openEditModal(category)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 text-slate-400 hover:text-accent-red hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {hasSubs && (
                    <div className={`${level === 0 ? 'p-6' : 'p-4 pt-0'} bg-white`}>
                        {level === 0 && <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Subcategories</h4>}
                        <div className="pl-6 border-l-2 border-slate-100 ml-4 space-y-4 mb-2">
                            {subs.map(sub => (
                                <div key={sub.id} className="relative mt-4">
                                    <div className="absolute top-8 -left-6 w-6 border-t-2 border-slate-100"></div>
                                    {renderCategory(sub, level + 1)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Categories Management</h1>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-red transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <div className="space-y-8">
                {mainCategories.map((category) => renderCategory(category, 0))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
                    No categories found
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingCategory}
                categories={categories}
            />
        </div>
    );
};
