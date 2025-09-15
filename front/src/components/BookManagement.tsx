import { useState } from 'react';
import { Book, Branch, User } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Book as BookIcon,
  Calendar,
  FileText,
  DollarSign,
  MapPin,
  Image,
  Users,
} from 'lucide-react';

interface BookManagementProps {
  books: Book[];
  branches: Branch[];
  user: User;
  onSaveBook: (book: Omit<Book, 'id'> | Book) => void;
  onDeleteBook: (id: number) => void;
}

export const BookManagement = ({ books, branches, user, onSaveBook, onDeleteBook }: BookManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    year: new Date().getFullYear(),
    pages: 0,
    illustrations: 0,
    price: 0,
    branchId: 0,
    copiesCount: 1,
    studentsCount: 0,
    faculties: ''
  });
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      publisher: '',
      year: new Date().getFullYear(),
      pages: 0,
      illustrations: 0,
      price: 0,
      branchId: 0,
      copiesCount: 1,
      studentsCount: 0,
      faculties: ''
    });
    setEditingBook(null);
    setError('');
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      year: book.year,
      pages: book.pages,
      illustrations: book.illustrations,
      price: book.price,
      branchId: book.branchId,
      copiesCount: book.copiesCount,
      studentsCount: book.studentsCount,
      faculties: book.faculties.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (!formData.title.trim()) throw new Error('Название книги обязательно');
      if (!formData.author.trim()) throw new Error('Автор обязателен');
      if (!formData.publisher.trim()) throw new Error('Издательство обязательно');
      if (formData.year < 1900 || formData.year > new Date().getFullYear() + 5) {
        throw new Error('Некорректный год издания');
      }
      if (formData.pages < 1) throw new Error('Количество страниц должно быть больше 0');
      if (formData.price < 0) throw new Error('Стоимость не может быть отрицательной');
      if (formData.branchId === 0) throw new Error('Выберите филиал');
      if (formData.copiesCount < 1) throw new Error('Количество экземпляров должно быть больше 0');

      const bookData = {
        ...formData,
        faculties: formData.faculties
          .split(',')
          .map(f => f.trim())
          .filter(f => f.length > 0)
      };

      if (editingBook) {
        onSaveBook({ ...bookData, id: editingBook.id });
      } else {
        onSaveBook(bookData);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении');
    }
  };

  const handleDelete = (bookId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      try {
        onDeleteBook(bookId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при удалении');
      }
    }
  };

  const getBranchName = (branchId: number) => {
    return branches.find(b => b.id === branchId)?.name || 'Неизвестный филиал';
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Список книг ({books.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить книгу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBook ? 'Редактировать книгу' : 'Добавить новую книгу'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Название книги *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Автор *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisher">Издательство *</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Год издания *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">Количество страниц *</Label>
                  <Input
                    id="pages"
                    type="number"
                    min="1"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="illustrations">Количество иллюстраций</Label>
                  <Input
                    id="illustrations"
                    type="number"
                    min="0"
                    value={formData.illustrations}
                    onChange={(e) => setFormData({ ...formData, illustrations: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Стоимость (руб.) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Филиал *</Label>
                  <Select
                    value={formData.branchId > 0 ? formData.branchId.toString() : "none"}
                    onValueChange={(value) => setFormData({ ...formData, branchId: value === "none" ? 0 : parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите филиал" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copiesCount">Количество экземпляров *</Label>
                  <Input
                    id="copiesCount"
                    type="number"
                    min="1"
                    value={formData.copiesCount}
                    onChange={(e) => setFormData({ ...formData, copiesCount: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentsCount">Количество студентов</Label>
                  <Input
                    id="studentsCount"
                    type="number"
                    min="0"
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="faculties">Факультеты (через запятую)</Label>
                  <Textarea
                    id="faculties"
                    value={formData.faculties}
                    onChange={(e) => setFormData({ ...formData, faculties: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" /> Отмена
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> {editingBook ? 'Сохранить изменения' : 'Добавить книгу'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Список книг в стиле BooksCatalog */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {books.map(book => (
          <Card key={book.id} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <BookIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                <span className="line-clamp-2">{book.title}</span>
              </CardTitle>
              <p className="text-gray-600">{book.author}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2"><span className="font-medium">Издательство:</span></div>
                  <div>{book.publisher}</div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>Год:</span></div>
                  <div>{book.year}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>Филиал:</span></div>
                  <div className="text-sm">{getBranchName(book.branchId)}</div>
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>Страниц:</span></div>
                  <div>{book.pages}</div>
                  <div className="flex items-center gap-2"><Image className="h-4 w-4" /><span>Иллюстраций:</span></div>
                  <div>{book.illustrations}</div>
                  <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /><span>Цена:</span></div>
                  <div>{book.price} руб.</div>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Экземпляров: </span>
                  <Badge variant="secondary">{book.copiesCount}</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button size="sm" variant="outline" onClick={() => handleEdit(book)}>
                  <Edit className="h-3 w-3 mr-1" /> Редактировать
                </Button>
                {user.role === 'admin' && (
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(book.id)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Удалить
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <BookIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Книги не найдены</h3>
          <p className="text-gray-500">Добавьте первую книгу в каталог.</p>
        </div>
      )}
    </div>
  );
};
