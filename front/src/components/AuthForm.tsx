
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { User } from '../types';
import api from '../api';

interface AuthFormProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

export const AuthForm = ({ onLogin, onCancel }: AuthFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(username, password);
      // res contains token and user info
      const user = res.user || { username };
      // store token in localStorage
      if (res.token) localStorage.setItem('token', res.token);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Ошибка при авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
          <CardDescription>Введите логин и пароль</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <Alert><AlertDescription>{error}</AlertDescription></Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Логин</Label>
              <Input value={username} onChange={(e:any) => setUsername(e.target.value)} />
            </div>
            <div>
              <Label>Пароль</Label>
              <Input type="password" value={password} onChange={(e:any) => setPassword(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? 'Вход...' : 'Войти'}</Button>
              <Button type="button" variant="ghost" onClick={onCancel}>Отмена</Button>
            </div>
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <p className="font-medium mb-1">Тестовые учетные данные:</p>
              <p>admin / password</p>
              <p>librarian / password</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
