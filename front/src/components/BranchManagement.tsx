import { useState } from 'react';
import { Branch, Book, User } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, Edit, Trash2, Save, X, Building2, Phone, MapPin } from 'lucide-react';

interface BranchManagementProps {
  branches: Branch[];
  books: Book[];
  user: User;
  onSaveBranch: (branch: Omit<Branch, 'id'> | Branch) => void;
  onDeleteBranch: (id: number) => void;
}

export const BranchManagement = ({ branches, books, user, onSaveBranch, onDeleteBranch }: BranchManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [error, setError] = useState('');

  const role = user.role;

  const resetForm = () => {
    setFormData({ name: '', address: '', phone: '' });
    setEditingBranch(null);
    setError('');
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({ name: branch.name, address: branch.address, phone: branch.phone || '' });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (!formData.name.trim()) throw new Error('Название филиала обязательно');
      if (!formData.address.trim()) throw new Error('Адрес обязателен');

      const existingBranch = branches.find(b =>
        b.name.toLowerCase() === formData.name.toLowerCase() &&
        (!editingBranch || b.id !== editingBranch.id)
      );
      if (existingBranch) throw new Error('Филиал с таким названием уже существует');

      const branchData = { name: formData.name.trim(), address: formData.address.trim(), phone: formData.phone.trim() || undefined };
      if (editingBranch) onSaveBranch({ ...branchData, id: editingBranch.id });
      else onSaveBranch(branchData);

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении');
    }
  };

  const handleDelete = (branchId: number) => {
    const booksInBranch = getBooksInBranch(branchId);
    if (booksInBranch.length > 0) {
      setError(`Нельзя удалить филиал, в котором есть ${booksInBranch.length} книг.`);
      return;
    }
    if (window.confirm('Вы уверены, что хотите удалить этот филиал?')) {
      try {
        onDeleteBranch(branchId);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при удалении');
      }
    }
  };

  const getBooksInBranch = (branchId: number) => books.filter(book => book.branchId === branchId);
  const getTotalCopiesInBranch = (branchId: number) => getBooksInBranch(branchId).reduce((s, b) => s + b.copiesCount, 0);

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Филиалы библиотеки ({branches.length})</h2>
        {(role === "admin" || role === "librarian") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Добавить филиал
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingBranch ? 'Редактировать филиал' : 'Добавить новый филиал'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Название филиала *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес *</Label>
                  <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" /> Отмена
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" /> {editingBranch ? 'Сохранить изменения' : 'Добавить филиал'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => {
          const booksInBranch = getBooksInBranch(branch.id);
          const totalCopies = getTotalCopiesInBranch(branch.id);

          return (
            <Card key={branch.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" /> <span>{branch.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" /> <span>{branch.address}</span>
                  </div>
                  {branch.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" /> <span>{branch.phone}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between"><span>Наименований книг:</span><Badge>{booksInBranch.length}</Badge></div>
                    <div className="flex justify-between"><span>Всего экземпляров:</span><Badge>{totalCopies}</Badge></div>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t">
                    {(role === "admin" || role === "librarian") && (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(branch)}>
                        <Edit className="h-3 w-3 mr-1" /> Редактировать
                      </Button>
                    )}
                    {role === "admin" && (
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(branch.id)} disabled={booksInBranch.length > 0}>
                        <Trash2 className="h-3 w-3 mr-1" /> Удалить
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
