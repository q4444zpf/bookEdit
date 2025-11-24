<template>
  <aside class="panel sidebar">
    <header class="sidebar__header">
      <p class="sidebar__caption">有道云图书</p>
      <h2>写作工作台</h2>
      <p class="sidebar__subtitle">管理知识资产、同步编辑效率</p>
      <button class="primary" @click="handleCreate">
        <span>＋ 新建图书</span>
      </button>
    </header>

    <section class="sidebar__section">
      <p class="section-title">空间视图</p>
      <div class="menu">
        <button
          v-for="library in store.libraries"
          :key="library.id"
          class="menu-item"
          :class="{ active: store.filters.library === library.id }"
          @click="selectLibrary(library.id)"
        >
          <span class="icon">{{ library.emoji }}</span>
          <span>{{ library.label }}</span>
          <span class="count">{{ getLibraryCount(library.id) }}</span>
        </button>
      </div>
    </section>

    <section class="sidebar__section">
      <p class="section-title">活跃统计</p>
      <div class="stats">
        <article>
          <p class="hint">本周编辑</p>
          <strong>{{ weeklyEdits }}</strong>
        </article>
        <article>
          <p class="hint">收藏书籍</p>
          <strong>{{ favoriteCount }}</strong>
        </article>
      </div>
    </section>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useBookStore } from '../stores/bookStore';

const store = useBookStore();

const weeklyEdits = computed(() => {
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return store.books.filter((book) => now - new Date(book.updatedAt).getTime() < sevenDays).length;
});

const favoriteCount = computed(() => store.books.filter((book) => book.favorite).length);

const handleCreate = () => {
  store.createBook();
};

const selectLibrary = (libraryId) => {
  store.setFilter('library', libraryId);
};

const getLibraryCount = (libraryId) => {
  switch (libraryId) {
    case 'favorites':
      return store.books.filter((book) => book.favorite).length;
    case 'draft':
      return store.books.filter((book) => book.status === '草稿').length;
    case 'archive':
      return store.books.filter((book) => book.status === '已归档').length;
    default:
      return store.books.length;
  }
};
</script>

<style scoped>
.sidebar {
  gap: 24px;
}

.sidebar__caption {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.sidebar__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar__header h2 {
  margin: 0;
  font-size: 1.6rem;
}

.sidebar__subtitle {
  margin: 0 0 12px;
  color: #6b7280;
}

.primary {
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(120deg, #3b82f6, #6366f1);
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 20px rgba(79, 70, 229, 0.25);
}

.sidebar__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-weight: 600;
  color: #7c869c;
  text-transform: uppercase;
  font-size: 0.78rem;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  border: none;
  border-radius: 14px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: #f5f7fb;
  color: #111320;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
}

.menu-item.active {
  background: #111320;
  color: #fff;
}

.menu-item .icon {
  margin-right: 8px;
}

.menu-item .count {
  font-size: 0.85rem;
  color: inherit;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stats article {
  border-radius: 14px;
  padding: 12px;
  background: #f8f9fc;
}

.stats .hint {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.stats strong {
  font-size: 1.4rem;
  color: #111320;
}
</style>
