import { defineStore } from 'pinia';
import { nanoid } from 'nanoid';
import { seedBooks } from '../data/seedBooks';

const STORAGE_KEY = 'yd-book-editor-books';

const defaultFilters = () => ({
  keyword: '',
  status: 'all',
  tag: 'all',
  library: 'all',
});

const libraries = [
  { id: 'all', label: '全部图书', emoji: '📚' },
  { id: 'favorites', label: '重点书籍', emoji: '⭐' },
  { id: 'draft', label: '草稿区', emoji: '📝' },
  { id: 'archive', label: '归档', emoji: '🗂️' },
];

const readFromStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('读取本地数据失败', error);
    return null;
  }
};

const writeToStorage = (books) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

const initBooks = () => {
  const cached = readFromStorage();
  return Array.isArray(cached) && cached.length ? cached : seedBooks;
};

export const useBookStore = defineStore('bookStore', {
  state: () => {
    const books = initBooks();
    return {
      books,
      filters: defaultFilters(),
      selectedBookId: books[0]?.id ?? null,
      libraries,
    };
  },
  getters: {
    selectedBook(state) {
      return state.books.find((book) => book.id === state.selectedBookId) ?? null;
    },
    filteredBooks(state) {
      const keyword = state.filters.keyword.trim().toLowerCase();
      return [...state.books]
        .filter((book) => {
          const keywordMatch = keyword
            ? [book.title, book.summary, book.author, book.tags.join(' ')].some((field) =>
                field.toLowerCase().includes(keyword),
              )
            : true;

          const statusMatch = state.filters.status === 'all' ? true : book.status === state.filters.status;
          const tagMatch = state.filters.tag === 'all' ? true : book.tags.includes(state.filters.tag);
          const libraryMatch = (() => {
            if (state.filters.library === 'favorites') return book.favorite;
            if (state.filters.library === 'draft') return book.status === '草稿';
            if (state.filters.library === 'archive') return book.status === '已归档';
            return true;
          })();

          return keywordMatch && statusMatch && tagMatch && libraryMatch;
        })
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },
    availableTags(state) {
      const tags = new Set();
      state.books.forEach((book) => book.tags.forEach((tag) => tags.add(tag)));
      return Array.from(tags);
    },
    statusOptions: () => ['草稿', '在写', '已成稿', '已归档'],
  },
  actions: {
    persist() {
      writeToStorage(this.books);
    },
    setFilter(key, value) {
      this.filters[key] = value;
    },
    resetFilters() {
      this.filters = defaultFilters();
    },
    selectBook(bookId) {
      this.selectedBookId = bookId;
    },
    createBook(preset = {}) {
      const now = new Date().toISOString();
      const newBook = {
        id: nanoid(10),
        title: preset.title ?? '未命名图书',
        author: preset.author ?? '未知作者',
        category: preset.category ?? '未分类',
        status: preset.status ?? '草稿',
        summary: preset.summary ?? '快速记录灵感、搭建章节结构。',
        tags: preset.tags ?? ['未分类'],
        favorite: false,
        content: preset.content ?? '# 新的章节\n\n开始书写你的灵感...',
        updatedAt: now,
      };
      this.books.unshift(newBook);
      this.selectedBookId = newBook.id;
      this.persist();
    },
    updateBook(bookId, payload) {
      const index = this.books.findIndex((book) => book.id === bookId);
      if (index === -1) return;
      const updated = {
        ...this.books[index],
        ...payload,
        updatedAt: payload.updatedAt ?? new Date().toISOString(),
      };
      this.books.splice(index, 1, updated);
      this.persist();
    },
    deleteBook(bookId) {
      const nextBooks = this.books.filter((book) => book.id !== bookId);
      this.books = nextBooks;
      if (!nextBooks.length) {
        this.selectedBookId = null;
      } else if (this.selectedBookId === bookId) {
        this.selectedBookId = nextBooks[0].id;
      }
      this.persist();
    },
    duplicateBook(bookId) {
      const target = this.books.find((book) => book.id === bookId);
      if (!target) return;
      const safeClone =
        typeof structuredClone === 'function'
          ? structuredClone(target)
          : JSON.parse(JSON.stringify(target));
      const duplicate = {
        ...safeClone,
        id: nanoid(10),
        title: `${target.title} - 副本`,
        status: '草稿',
        updatedAt: new Date().toISOString(),
      };
      this.books.unshift(duplicate);
      this.selectedBookId = duplicate.id;
      this.persist();
    },
    toggleFavorite(bookId) {
      const target = this.books.find((book) => book.id === bookId);
      if (!target) return;
      target.favorite = !target.favorite;
      target.updatedAt = new Date().toISOString();
      this.persist();
    },
  },
});
