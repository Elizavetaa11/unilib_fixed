import { useState, useEffect } from "react";
import { Book, Branch, User } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { BookManagement } from "./BookManagement";
import { BranchManagement } from "./BranchManagement";
import { StatisticsPanel } from "./StatisticsPanel";
import { BooksCatalog } from "./BooksCatalog";
import { BookSearchFilters } from "../types";
import {
  Book as BookIcon,
  Building2,
  BarChart3,
  Search,
  LogOut,
  User as UserIcon,
  KeyRound,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import api from "../api";

interface AdminPanelProps {
  user: User;
  books: Book[];
  branches: Branch[];
  onLogout: () => void;
  onSaveBook: (book: Omit<Book, "id"> | Book) => void;
  onDeleteBook: (id: number) => void;
  onSaveBranch: (branch: Omit<Branch, "id"> | Branch) => void;
  onDeleteBranch: (id: number) => void;
  onSearchBooks: (filters: BookSearchFilters) => Book[];
  onCountCopies: (bookId: number, branchId: number) => number;
  onGetFaculties: (
    bookId: number,
    branchId: number
  ) => { count: number; faculties: string[] };
}

export const AdminPanel = ({
  user,
  books,
  branches,
  onLogout,
  onSaveBook,
  onDeleteBook,
  onSaveBranch,
  onDeleteBranch,
  onSearchBooks,
  onCountCopies,
  onGetFaculties,
}: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem("activeTab") || "catalog";
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("activeTab", value);
  };

  const handleLogout = () => {
    localStorage.removeItem("activeTab");
    onLogout();
  };

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    password_hash: "",
    role: "librarian",
    full_name: "",
    email: "",
    is_active: true,
  });

  const [passwordData, setPasswordData] = useState({
    username: user.username,
    password: "",
  });

  // === СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ ===
  const handleCreateUser = async () => {
    try {
      if (!newUser.username.trim()) {
        alert("❌ Логин не может быть пустым");
        return;
      }

      const users = await api.getUsers();
      if (users.find((u: any) => u.username === newUser.username)) {
        alert("❌ Пользователь с таким логином уже существует");
        return;
      }

      await api.createUser(newUser);
      alert("✅ Пользователь создан");
      setShowCreateUser(false);
      setNewUser({
        username: "",
        password_hash: "",
        role: "librarian",
        full_name: "",
        email: "",
        is_active: true,
      });
    } catch (e) {
      alert("❌ Ошибка при создании пользователя");
    }
  };

  // === СМЕНА ПАРОЛЯ ===
  const handleChangePassword = async () => {
    try {
      if (!passwordData.username.trim()) {
        alert("❌ Укажите логин пользователя");
        return;
      }
      if (!passwordData.password.trim()) {
        alert("❌ Пароль не может быть пустым");
        return;
      }

      await api.changePassword(passwordData.username, passwordData.password);
      alert("✅ Пароль изменён");
      setShowChangePassword(false);
      setPasswordData({ username: user.username, password: "" });
    } catch (e) {
      alert("❌ Ошибка при смене пароля");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl">📚 UniLib</h1>
              <Badge variant="secondary" className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                {user.username} ({user.role})
              </Badge>
            </div>
            <div className="flex gap-3">
              {user.role === "admin" && (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => setShowCreateUser(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Новый пользователь
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <KeyRound className="h-4 w-4" />
                    Сменить пароль
                  </Button>
                </>
              )}
              {user.role === "librarian" && (
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => setShowChangePassword(true)}
                >
                  <KeyRound className="h-4 w-4" />
                  Сменить пароль
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Каталог книг
            </TabsTrigger>
            <TabsTrigger value="books" className="flex items-center gap-2">
              <BookIcon className="h-4 w-4" />
              Управление книгами
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Управление филиалами
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog">
            <BooksCatalog
              books={books}
              branches={branches}
              isAuthenticated={true}
              onSearchBooks={onSearchBooks}
            />
          </TabsContent>

          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookIcon className="h-5 w-5" />
                  Управление книгами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BookManagement
                  books={books}
                  branches={branches}
                  user={user}
                  onSaveBook={onSaveBook}
                  onDeleteBook={onDeleteBook}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Управление филиалами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BranchManagement
                  branches={branches}
                  books={books}
                  user={user}
                  onSaveBranch={onSaveBranch}
                  onDeleteBranch={onDeleteBranch}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Статистика и отчеты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatisticsPanel
                  books={books}
                  branches={branches}
                  onCountCopies={onCountCopies}
                  onGetFaculties={onGetFaculties}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Модалка создания пользователя */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать нового пользователя</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Логин</Label>
              <Input
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Пароль</Label>
              <Input
                type="password"
                value={newUser.password_hash}
                onChange={(e) =>
                  setNewUser({ ...newUser, password_hash: e.target.value })
                }
              />
            </div>
            <div>
              <Label>ФИО</Label>
              <Input
                value={newUser.full_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, full_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Роль</Label>
              <select
                className="border rounded p-2 w-full"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="librarian">Библиотекарь</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.is_active}
                onChange={(e) =>
                  setNewUser({ ...newUser, is_active: e.target.checked })
                }
              />
              <Label>Активен</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateUser}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модалка смены пароля */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сменить пароль</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {user.role === "admin" && (
              <div>
                <Label>Логин пользователя</Label>
                <Input
                  value={passwordData.username}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, username: e.target.value })
                  }
                />
              </div>
            )}
            {user.role === "librarian" && (
              <div>
                <Label>Логин</Label>
                <Input value={user.username} disabled />
              </div>
            )}
            <div>
              <Label>Новый пароль</Label>
              <Input
                type="password"
                value={passwordData.password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleChangePassword}>Изменить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
