import { useState } from 'react';
import { Book, Branch, BookSearchFilters } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Search, Book as BookIcon, MapPin, Calendar, FileText, Image, DollarSign, Users } from 'lucide-react';

interface BooksCatalogProps {
  books: Book[];
  branches: Branch[];
  isAuthenticated: boolean;
  onSearchBooks: (filters: BookSearchFilters) => Book[];
}

export const BooksCatalog = ({ books, branches, isAuthenticated, onSearchBooks }: BooksCatalogProps) => {
  const [searchFilters, setSearchFilters] = useState<BookSearchFilters>({});
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  const handleSearch = () => {
    const results = onSearchBooks(searchFilters);
    setFilteredBooks(results);
  };

  const handleReset = () => {
    setSearchFilters({});
    setFilteredBooks(books);
  };

  const getBranchName = (branchId: number) => {
    return branches.find(b => b.id === branchId)?.name || 'Неизвестный филиал';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-4 text-center">📚 Каталог библиотеки UniLib</h1>
        <p className="text-gray-600 text-center mb-6">
          {isAuthenticated 
            ? 'Полный доступ к информации о книгах' 
            : 'Ознакомление с книгами (ограниченный доступ)'}
        </p>

        {/* Фильтры поиска */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Поиск книг
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="title-search">Название книги</Label>
                <Input
                  id="title-search"
                  placeholder="Введите название..."
                  value={searchFilters.title || ''}
                  onChange={(e) => setSearchFilters({ ...searchFilters, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-search">Автор</Label>
                <Input
                  id="author-search"
                  placeholder="Введите автора..."
                  value={searchFilters.author || ''}
                  onChange={(e) => setSearchFilters({ ...searchFilters, author: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Филиал</Label>
                <Select value={searchFilters.branchId?.toString() || "all"} onValueChange={(value) => 
                  setSearchFilters({ ...searchFilters, branchId: value === "all" ? undefined : parseInt(value) })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите филиал" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все филиалы</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year-search">Год издания</Label>
                <Input
                  id="year-search"
                  type="number"
                  placeholder="2020"
                  value={searchFilters.year || ''}
                  onChange={(e) => setSearchFilters({ 
                    ...searchFilters, 
                    year: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Найти
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Сбросить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список книг */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <Card key={book.id} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <BookIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                <span className="line-clamp-2">{book.title}</span>
              </CardTitle>
              <p className="text-gray-600">{book.author}</p>
            </CardHeader>
            
            <CardContent className="flex-1">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Издательство:</span>
                  </div>
                  <div>{book.publisher}</div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Год издания:</span>
                  </div>
                  <div>{book.year}</div>

                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Страниц:</span>
                  </div>
                  <div>{book.pages}</div>

                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span>Иллюстраций:</span>
                  </div>
                  <div>{book.illustrations}</div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Стоимость:</span>
                  </div>
                  <div>{book.price} руб.</div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Филиал:</span>
                  </div>
                  <div className="text-sm">{getBranchName(book.branchId)}</div>

                  <div className="col-span-2">
                    <span className="font-medium">Экземпляров: </span>
                    <Badge variant="secondary">{book.copiesCount}</Badge>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Студентов с книгой: </span>
                      <Badge variant="outline">{book.studentsCount}</Badge>
                    </div>
                    
                    <div>
                      <p className="font-medium text-sm mb-2">Факультеты:</p>
                      <div className="flex flex-wrap gap-1">
                        {book.faculties.map((faculty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {faculty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Книги не найдены</h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        Найдено книг: {filteredBooks.length} из {books.length}
      </div>
    </div>
  );
};