import { useState } from 'react';
import { Book, Branch } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Search, Calculator, TrendingUp, BookOpen, Building2, Users } from 'lucide-react';

interface StatisticsPanelProps {
  books: Book[];
  branches: Branch[];
  onCountCopies: (bookId: number, branchId: number) => number;
  onGetFaculties: (bookId: number, branchId: number) => { count: number; faculties: string[] };
}

export const StatisticsPanel = ({ books, branches, onCountCopies, onGetFaculties }: StatisticsPanelProps) => {
  const [selectedBookId, setSelectedBookId] = useState<number>(0);
  const [selectedBranchId, setSelectedBranchId] = useState<number>(0);
  const [searchResult, setSearchResult] = useState<{
    copies: number;
    faculties: { count: number; faculties: string[] };
  } | null>(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    
    if (selectedBookId === 0 || selectedBranchId === 0) {
      setError('Выберите книгу и филиал для поиска');
      return;
    }

    try {
      const copies = onCountCopies(selectedBookId, selectedBranchId);
      const faculties = onGetFaculties(selectedBookId, selectedBranchId);
      
      setSearchResult({ copies, faculties });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при выполнении поиска');
      setSearchResult(null);
    }
  };

  // Статистика по филиалам
  const branchStats = branches.map(branch => {
    const branchBooks = books.filter(book => book.branchId === branch.id);
    const totalCopies = branchBooks.reduce((sum, book) => sum + book.copiesCount, 0);
    const totalStudents = branchBooks.reduce((sum, book) => sum + book.studentsCount, 0);
    
    return {
      name: branch.name,
      books: branchBooks.length,
      copies: totalCopies,
      students: totalStudents
    };
  });

  // Статистика по годам издания
  const yearStats = books.reduce((acc, book) => {
    const year = book.year.toString();
    if (!acc[year]) {
      acc[year] = { year, count: 0, copies: 0 };
    }
    acc[year].count += 1;
    acc[year].copies += book.copiesCount;
    return acc;
  }, {} as Record<string, { year: string; count: number; copies: number }>);

  const yearStatsArray = Object.values(yearStats)
    .sort((a, b) => parseInt(a.year) - parseInt(b.year))
    .slice(-10); // Последние 10 лет

  // Статистика по ценовым диапазонам
  const priceRanges = [
    { name: 'До 1000', min: 0, max: 1000 },
    { name: '1000-2000', min: 1000, max: 2000 },
    { name: '2000-3000', min: 2000, max: 3000 },
    { name: 'Свыше 3000', min: 3000, max: Infinity }
  ];

  const priceStats = priceRanges.map(range => ({
    name: range.name,
    count: books.filter(book => book.price >= range.min && book.price < range.max).length,
    value: books.filter(book => book.price >= range.min && book.price < range.max).length
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const getBookName = (bookId: number) => {
    return books.find(b => b.id === bookId)?.title || 'Неизвестная книга';
  };

  const getBranchName = (branchId: number) => {
    return branches.find(b => b.id === branchId)?.name || 'Неизвестный филиал';
  };

  // Топ книги по количеству экземпляров
  const topBooksByCopies = books
    .sort((a, b) => b.copiesCount - a.copiesCount)
    .slice(0, 5);

  // Топ книги по количеству студентов
  const topBooksByStudents = books
    .sort((a, b) => b.studentsCount - a.studentsCount)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Функции поиска */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Функции подсчета
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Книга</Label>
              <Select value={selectedBookId > 0 ? selectedBookId.toString() : "none"} onValueChange={(value) => 
                setSelectedBookId(value === "none" ? 0 : parseInt(value))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите книгу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Выберите книгу</SelectItem>
                  {books.map(book => (
                    <SelectItem key={book.id} value={book.id.toString()}>
                      {book.title} - {book.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Филиал</Label>
              <Select value={selectedBranchId > 0 ? selectedBranchId.toString() : "none"} onValueChange={(value) => 
                setSelectedBranchId(value === "none" ? 0 : parseInt(value))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите филиал" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Выберите филиал</SelectItem>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full flex items-center gap-2">
                <Search className="h-4 w-4" />
                Найти статистику
              </Button>
            </div>
          </div>

          {searchResult && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-blue-900">
                Результат поиска для "{getBookName(selectedBookId)}" в "{getBranchName(selectedBranchId)}"
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Количество экземпляров</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{searchResult.copies}</div>
                </div>

                <div className="bg-white p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Количество факультетов</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{searchResult.faculties.count}</div>
                </div>
              </div>

              {searchResult.faculties.faculties.length > 0 && (
                <div className="bg-white p-3 rounded">
                  <p className="font-medium mb-2">Факультеты:</p>
                  <div className="flex flex-wrap gap-1">
                    {searchResult.faculties.faculties.map((faculty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {faculty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{books.length}</div>
              <div className="text-sm text-gray-600">Всего книг</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Building2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{branches.length}</div>
              <div className="text-sm text-gray-600">Филиалов</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {books.reduce((sum, book) => sum + book.copiesCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Экземпляров</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {books.reduce((sum, book) => sum + book.studentsCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Выдач студентам</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Статистика по филиалам */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Статистика по филиалам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="books" fill="#8884d8" name="Книги" />
                  <Bar dataKey="copies" fill="#82ca9d" name="Экземпляры" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение по ценам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priceStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Статистика по годам */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика по годам издания</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearStatsArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Количество книг" />
                <Bar dataKey="copies" fill="#82ca9d" name="Экземпляры" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Топ книги */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Топ-5 книг по количеству экземпляров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topBooksByCopies.map((book, index) => (
                <div key={book.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0">
                    <Badge variant="secondary">{index + 1}</Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <Badge variant="outline">{book.copiesCount} экз.</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Топ-5 книг по выдачам студентам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topBooksByStudents.map((book, index) => (
                <div key={book.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0">
                    <Badge variant="secondary">{index + 1}</Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <Badge variant="outline">{book.studentsCount} студ.</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};