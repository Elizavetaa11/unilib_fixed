import { useEffect, useState } from 'react';
import { User } from './types';
import { useLibraryData } from './hooks/useLibraryData';
import { AuthForm } from './components/AuthForm';
import { BooksCatalog } from './components/BooksCatalog';
import { AdminPanel } from './components/AdminPanel';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Alert, AlertDescription } from './components/ui/alert';
import { Book, Users, Settings, Info, ArrowRight } from 'lucide-react';

type AppMode = 'select' | 'catalog' | 'admin' | 'auth';

const LS_KEYS = {
  appMode: 'appMode',
  currentUser: 'currentUser',
};

export default function App() {
  const [mode, setMode] = useState<AppMode>(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.appMode);
      if (saved === 'select' || saved === 'catalog' || saved === 'admin' || saved === 'auth') {
        return saved as AppMode;
      }
    } catch {}
    return 'select';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(LS_KEYS.currentUser);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  const [error, setError] = useState('');

  const {
    books,
    branches,
    error: dataError,
    setError: setDataError,
    countBookCopiesInBranch,
    getBookFacultiesInBranch,
    saveBook,
    saveBranch,
    deleteBook,
    deleteBranch,
    searchBooks,
    getBookStatistics,
  } = useLibraryData();

  // Синхронизация режима в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.appMode, mode);
    } catch {}
  }, [mode]);

  // Синхронизация пользователя в localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(LS_KEYS.currentUser, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(LS_KEYS.currentUser);
      }
    } catch {}
  }, [currentUser]);

  // Если режим admin, но пользователя нет — переводим на auth
  useEffect(() => {
    if (mode === 'admin' && !currentUser) {
      setMode('auth');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setMode('admin');
    setError('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMode('select');
    setError('');
    try {
      localStorage.removeItem('activeTab');
    } catch {}
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setDataError(errorMessage);
  };

  if (mode === 'auth') {
    return <AuthForm onLogin={handleLogin} onCancel={() => setMode('select')} />;
  }

  if (mode === 'admin' && currentUser) {
    return (
      <AdminPanel
        user={currentUser}
        books={books}
        branches={branches}
        onLogout={handleLogout}
        onSaveBook={saveBook}
        onDeleteBook={deleteBook}
        onSaveBranch={saveBranch}
        onDeleteBranch={deleteBranch}
        onSearchBooks={searchBooks}
        onCountCopies={countBookCopiesInBranch}
        onGetFaculties={getBookFacultiesInBranch}
      />
    );
  }

  if (mode === 'catalog') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl">📚 UniLib - Каталог библиотеки</h1>
              <Button variant="outline" onClick={() => setMode('select')}>
                Назад к выбору режима
              </Button>
            </div>
          </div>
        </header>

        <BooksCatalog
          books={books}
          branches={branches}
          isAuthenticated={false}
          onSearchBooks={searchBooks}
        />
      </div>
    );
  }

  // Экран выбора режима
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Book className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">📚 UniLib</h1>
          <p className="text-xl text-gray-600 mb-2">
            Информационная система обслуживания библиотеки
          </p>
          <p className="text-lg text-gray-500">Выберите режим работы с системой</p>
        </div>

        {(error || dataError) && (
          <div className="max-w-2xl mx-auto mb-8">
            <Alert variant="destructive">
              <AlertDescription>{error || dataError}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Ознакомление с книгами */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Ознакомление с книгами</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Просмотр каталога библиотеки без авторизации. Доступна информация о
                названиях книг, авторах, издательствах, годах издания, филиалах библиотеки и тд.
              </p>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>Поиск по каталогу</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>Информация о книгах</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>Данные о филиалах</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>Управление данными</span>
                  <span className="text-red-600">✗</span>
                </div>
              </div>
              <button
                onClick={() => setMode('catalog')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors duration-300 bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700 text-white font-medium shadow-sm"
              >
                <Book className="mr-2 h-4 w-4" />
                Перейти к каталогу
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>


            </CardContent>
          </Card>

          {/* Работа с данными */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Работа с данными</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Полный административный доступ к системе. Управление книгами,
                филиалами, статистика и расширенные функции для администраторов библиотеки.
              </p>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>Все функции каталога</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>Управление книгами</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>Управление филиалами</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>Статистика и отчеты</span>
                  <span className="text-green-600">✓</span>
                </div>
              </div>
              <button
                onClick={() => setMode('auth')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors duration-300 bg-green-600 hover:bg-green-700 group-hover:bg-green-700 text-white font-medium shadow-sm"
              >
                <Users className="mr-2 h-4 w-4" />
                Войти в систему
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </div>


        <Card className="max-w-4xl mx-auto mt-12 bg-white/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Info className="h-5 w-5" />
              О системе UniLib
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">
                  Функциональные возможности:
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Подсчет экземпляров книг в филиалах</li>
                  <li>• Анализ использования по факультетам</li>
                  <li>• Управление информацией о книгах</li>
                  <li>• Управление данными филиалов</li>
                  <li>• Статистические отчеты</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">
                  Информация о книгах:
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Названия и авторы книг</li>
                  <li>• Издательства и годы издания</li>
                  <li>• Количество страниц и иллюстраций</li>
                  <li>• Стоимость и местонахождение</li>
                  <li>• Статистика использования</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-center text-blue-800">
                <strong>Текущая база данных:</strong> {books.length} книг в{' '}
                {branches.length} филиалах
              </p>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            UniLib - Система управления библиотекой университета
          </p>
        </footer>
      </div>
    </div>
  );
}
