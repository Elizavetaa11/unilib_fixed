import { useState, useCallback, useEffect } from 'react';
import api from '../api';
import { Book, Branch, BookSearchFilters, BookStatistics } from '../types';

export const useLibraryData = () => {
  // === Загружаем из localStorage при старте ===
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const raw = localStorage.getItem("books");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    try {
      const raw = localStorage.getItem("branches");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // === Сохраняем в localStorage при изменениях ===
  useEffect(() => {
    try {
      localStorage.setItem("books", JSON.stringify(books));
    } catch {}
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem("branches", JSON.stringify(branches));
    } catch {}
  }, [branches]);

  // === Загружаем из API при монтировании ===
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([api.getBooks(), api.getBranches()])
      .then(([bks, brs]) => {
        if (!mounted) return;

        const normalized = (bks || []).map((bk: any) => ({
          id: bk.id,
          title: bk.title,
          author: bk.author,
          publisher: bk.publisher,
          year: bk.year,
          pages: bk.pages,
          illustrations: bk.illustrations,
          price: bk.price,
          branchId: bk.branchId,
          copiesCount: bk.copiesCount || 0,
          studentsCount: bk.studentsCount || 0,
          faculties: Array.isArray(bk.faculties)
            ? bk.faculties
            : (bk.faculties
                ? String(bk.faculties).split(",").map((s: string) => s.trim()).filter(Boolean)
                : [])
        }));

        setBooks(normalized);
        setBranches(brs || []);
      })
      .catch(err => {
        console.error("Ошибка загрузки данных из API:", err);
        setError(err.message || String(err));
      })
      .finally(() => setLoading(false));

    return () => { mounted = false; };
  }, []);

  // === Методы ===
  const countBookCopiesInBranch = useCallback((bookId: number, branchId: number): number => {
    const b = books.find(x => x.id === bookId && x.branchId === branchId);
    return b ? (b.copiesCount || 0) : 0;
  }, [books]);

  const getBookFacultiesInBranch = useCallback((bookId: number, branchId: number) => {
    const b = books.find(x => x.id === bookId && x.branchId === branchId);
    return {
      count: b ? (b.faculties?.length || 0) : 0,
      faculties: b ? (b.faculties || []) : []
    };
  }, [books]);

  const saveBook = useCallback(async (book: any) => {
    try {
      if (book.id) {
        await api.updateBook(book.id, {
          ...book,
          faculties: Array.isArray(book.faculties) ? book.faculties : String(book.faculties || "")
        });
        setBooks(prev => prev.map(p => p.id === book.id ? { ...p, ...book } : p));
      } else {
        const res = await api.createBook({
          ...book,
          faculties: Array.isArray(book.faculties) ? book.faculties : String(book.faculties || "")
        });
        if (res && res.id) {
          setBooks(prev => [...prev, { ...book, id: res.id }]);
        } else {
          const bks = await api.getBooks();
          setBooks(bks || []);
        }
      }
    } catch (err: any) {
      setError(err.message || String(err));
      throw err;
    }
  }, []);

  const deleteBook = useCallback(async (id: number) => {
    try {
      await api.deleteBook(id);
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.message || String(err));
      throw err;
    }
  }, []);

  const saveBranch = useCallback(async (branch: any) => {
    try {
      if (branch.id) {
        await api.updateBranch(branch.id, branch);
        setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, ...branch } : b));
      } else {
        const res = await api.createBranch(branch);
        if (res && res.id) {
          setBranches(prev => [...prev, { ...branch, id: res.id }]);
        }
      }
    } catch (err: any) {
      setError(err.message || String(err));
      throw err;
    }
  }, []);

  const deleteBranch = useCallback(async (id: number) => {
    try {
      await api.deleteBranch(id);
      setBranches(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.message || String(err));
      throw err;
    }
  }, []);

  const searchBooks = useCallback((filters: BookSearchFilters): Book[] => {
    return books.filter(book => {
      if (filters.title && !book.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
      if (filters.author && !String(book.author || '').toLowerCase().includes(filters.author.toLowerCase())) return false;
      if (filters.year && book.year !== filters.year) return false;
      if (filters.branchId && book.branchId !== filters.branchId) return false;
      return true;
    });
  }, [books]);

  const getBookStatistics = useCallback((bookId: number): BookStatistics | null => {
    const book = books.find(b => b.id === bookId);
    if (!book) return null;
    return {
      branchId: book.branchId,
      branchName: branches.find(b => b.id === book.branchId)?.name || '',
      copiesCount: book.copiesCount,
      facultiesCount: book.faculties?.length || 0,
      faculties: book.faculties || []
    };
  }, [books, branches]);

  return {
    books,
    branches,
    error,
    setError,
    countBookCopiesInBranch,
    getBookFacultiesInBranch,
    saveBook,
    saveBranch,
    deleteBook,
    deleteBranch,
    searchBooks,
    getBookStatistics,
    loading
  };
};
