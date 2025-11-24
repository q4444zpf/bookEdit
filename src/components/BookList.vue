<template>
  <section class="panel booklist">
    <header class="booklist__header">
      <div>
        <p class="caption">图书库</p>
        <h3>共 {{ store.filteredBooks.length }} 本</h3>
      </div>
      <button class="ghost" @click="store.resetFilters">重置筛选</button>
    </header>

    <div class="filters">
      <label class="input">
        <span>🔍</span>
        <input v-model="keyword" type="search" placeholder="搜索标题、作者、标签..." />
      </label>
      <select v-model="status">
        <option value="all">全部状态</option>
        <option v-for="statusOption in store.statusOptions" :key="statusOption" :value="statusOption">
          {{ statusOption }}
        </option>
      </select>
      <select v-model="tag">
        <option value="all">全部标签</option>
        <option v-for="tagOption in store.availableTags" :key="tagOption" :value="tagOption">
          {{ tagOption }}
        </option>
      </select>
    </div>

    <div class="list scrollable">
      <article
        v-for="book in store.filteredBooks"
        :key="book.id"
        class="book-card"
        :class="{ active: store.selectedBookId === book.id }"
        @click="store.selectBook(book.id)"
      >
        <div class="book-card__title">
          <h4>{{ book.title }}</h4>
          <span class="status" :data-status="book.status">{{ book.status }}</span>
        </div>
        <p class="summary">{{ book.summary }}</p>
        <div class="meta">
          <span>{{ book.author }}</span>
          <span>{{ book.category }}</span>
          <span>{{ formatRelativeTime(book.updatedAt) }}</span>
        </div>
        <div class="tags">
          <span v-for="tagItem in book.tags" :key="tagItem" class="tag">#{{ tagItem }}</span>
        </div>
        <div class="actions">
          <button class="icon" @click.stop="store.toggleFavorite(book.id)" :title="book.favorite ? '取消收藏' : '加入收藏'">
            {{ book.favorite ? '★' : '☆' }}
          </button>
          <button class="icon" @click.stop="store.duplicateBook(book.id)" title="复制一份">
            ⧉
          </button>
          <button class="icon danger" @click.stop="tryDelete(book.id)" title="删除">
            🗑️
          </button>
        </div>
      </article>
      <p v-if="!store.filteredBooks.length" class="empty">没有符合条件的图书</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useBookStore } from '../stores/bookStore';
import { formatRelativeTime } from '../utils/time';

const store = useBookStore();

const keyword = computed({
  get: () => store.filters.keyword,
  set: (value) => store.setFilter('keyword', value),
});

const status = computed({
  get: () => store.filters.status,
  set: (value) => store.setFilter('status', value),
});

const tag = computed({
  get: () => store.filters.tag,
  set: (value) => store.setFilter('tag', value),
});

const tryDelete = (bookId) => {
  if (window.confirm('确定删除该图书吗？此操作不可恢复。')) {
    store.deleteBook(bookId);
  }
};
</script>

<style scoped>
.booklist {
  gap: 12px;
}

.booklist__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.caption {
  margin: 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.ghost {
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 999px;
  background: transparent;
  padding: 6px 12px;
  cursor: pointer;
}

.filters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.filters .input {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: 12px;
  background: #f3f4f6;
}

.filters input,
.filters select {
  border: none;
  background: transparent;
  padding: 10px 4px;
  font-size: 0.95rem;
  width: 100%;
}

.filters input:focus,
.filters select:focus {
  outline: none;
}

.list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.book-card {
  border: 1px solid transparent;
  border-radius: 18px;
  padding: 14px 16px;
  background: #f9fbff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border 0.2s ease, background 0.2s ease;
}

.book-card:hover {
  border-color: rgba(99, 102, 241, 0.5);
}

.book-card.active {
  border-color: #111320;
  background: #fff;
}

.book-card__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.book-card__title h4 {
  margin: 0;
}

.status {
  font-size: 0.8rem;
  padding: 2px 10px;
  border-radius: 999px;
  background: #e2e8f0;
}

.status[data-status='草稿'] {
  background: rgba(250, 204, 21, 0.2);
  color: #854d0e;
}

.status[data-status='在写'] {
  background: rgba(59, 130, 246, 0.2);
  color: #1d4ed8;
}

.status[data-status='已成稿'] {
  background: rgba(34, 197, 94, 0.2);
  color: #15803d;
}

.summary {
  margin: 0;
  color: #475569;
}

.meta {
  font-size: 0.85rem;
  color: #94a3b8;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  border-radius: 999px;
  background: #e0e7ff;
  color: #4338ca;
  padding: 2px 10px;
  font-size: 0.8rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.icon {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
}

.icon.danger:hover {
  color: #dc2626;
}

.empty {
  text-align: center;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
