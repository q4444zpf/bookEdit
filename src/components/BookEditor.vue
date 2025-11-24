<template>
  <section class="panel editor-panel" v-if="currentBook">
    <header class="editor-header">
      <div class="title-group">
        <input v-model="title" class="title-input" placeholder="输入书名" />
        <p class="subtitle">
          最后更新：{{ formatDateLabel(currentBook.updatedAt) }}
        </p>
      </div>
      <div class="header-actions">
        <button class="ghost" @click="store.duplicateBook(currentBook.id)">复制草稿</button>
        <button class="ghost" @click="store.toggleFavorite(currentBook.id)">
          {{ currentBook.favorite ? '取消收藏' : '收藏' }}
        </button>
      </div>
    </header>

    <section class="meta-grid">
      <label>
        <span>作者</span>
        <input v-model="author" />
      </label>
      <label>
        <span>分类</span>
        <input v-model="category" placeholder="如：创作方法" />
      </label>
      <label>
        <span>状态</span>
        <select v-model="status">
          <option v-for="item in store.statusOptions" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <label>
        <span>标签（逗号分隔）</span>
        <input v-model="tagsInput" @blur="applyTags" placeholder="AI, 笔记, 结构化" />
      </label>
    </section>

    <label class="summary-block">
      <span>一句话摘要</span>
      <textarea v-model="summary" rows="2" placeholder="输入简介，方便检索"></textarea>
    </label>

    <div class="editor-body">
      <article class="editor-area">
        <div class="editor-toolbar">
          <span>内容编辑</span>
          <small>Markdown 支持标题、列表、引用等语法</small>
        </div>
        <textarea v-model="contentDraft" class="editor-textarea" placeholder="以 # 开头创建章节标题"></textarea>
      </article>
      <article class="preview-area">
        <div class="editor-toolbar">
          <span>实时预览</span>
          <small>仿有道云笔记风格</small>
        </div>
        <div class="preview" v-html="compiledMarkdown"></div>
      </article>
    </div>
  </section>

  <section v-else class="panel editor-panel empty-state">
    <h3>请选择左侧的图书或创建新图书</h3>
    <p>支持 Markdown 实时预览、分类管理与收藏标记。</p>
    <button class="primary" @click="store.createBook()">新建第一本书</button>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { marked } from 'marked';
import { useBookStore } from '../stores/bookStore';
import { formatDateLabel } from '../utils/time';

marked.setOptions({
  gfm: true,
  breaks: true,
});

const store = useBookStore();

const currentBook = computed(() => store.selectedBook);

const title = ref('');
const author = ref('');
const category = ref('');
const status = ref('草稿');
const summary = ref('');
const tagsInput = ref('');
const contentDraft = ref('');

watch(
  currentBook,
  (book) => {
    if (!book) return;
    title.value = book.title;
    author.value = book.author;
    category.value = book.category;
    status.value = book.status;
    summary.value = book.summary;
    tagsInput.value = book.tags.join(', ');
    contentDraft.value = book.content;
  },
  { immediate: true },
);

watch(title, (val) => {
  if (currentBook.value) {
    store.updateBook(currentBook.value.id, { title: val });
  }
});

watch(author, (val) => {
  if (currentBook.value) {
    store.updateBook(currentBook.value.id, { author: val });
  }
});

watch(category, (val) => {
  if (currentBook.value) {
    store.updateBook(currentBook.value.id, { category: val });
  }
});

watch(status, (val) => {
  if (currentBook.value) {
    store.updateBook(currentBook.value.id, { status: val });
  }
});

watch(summary, (val) => {
  if (currentBook.value) {
    store.updateBook(currentBook.value.id, { summary: val });
  }
});

let typingTimer;
watch(
  contentDraft,
  (val) => {
    if (!currentBook.value) return;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      store.updateBook(currentBook.value.id, { content: val });
    }, 350);
  },
  { flush: 'post' },
);

const applyTags = () => {
  if (!currentBook.value) return;
  const tags = tagsInput.value
    .split(/[,，#\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
  store.updateBook(currentBook.value.id, { tags: tags.length ? tags : ['未分类'] });
};

const compiledMarkdown = computed(() => {
  if (!contentDraft.value) return '<p class="empty-preview">暂无内容</p>';
  return marked.parse(contentDraft.value);
});
</script>

<style scoped>
.editor-panel {
  gap: 18px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.title-group {
  flex: 1;
  min-width: 240px;
}

.title-input {
  width: 100%;
  border: none;
  font-size: 1.8rem;
  font-weight: 600;
  background: transparent;
  padding: 0;
}

.title-input:focus {
  outline: none;
}

.subtitle {
  margin: 4px 0 0;
  color: #94a3b8;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.ghost {
  border-radius: 999px;
  border: 1px solid rgba(71, 85, 105, 0.3);
  background: transparent;
  padding: 6px 12px;
  cursor: pointer;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: 12px;
}

.meta-grid label,
.summary-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  color: #475569;
}

.meta-grid input,
.meta-grid select,
.summary-block textarea {
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 10px 12px;
  font-size: 1rem;
}

.summary-block textarea {
  resize: vertical;
}

.editor-body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  min-height: 400px;
}

.editor-area,
.preview-area {
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: #fdfdfd;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #64748b;
}

.editor-textarea {
  flex: 1;
  border: none;
  padding: 16px;
  font-size: 1rem;
  font-family: "Fira Code", "JetBrains Mono", "PingFang SC", monospace;
  resize: none;
  background: transparent;
}

.editor-textarea:focus {
  outline: none;
}

.preview {
  flex: 1;
  padding: 16px 20px 32px;
  overflow: auto;
  line-height: 1.7;
}

.preview h1,
.preview h2,
.preview h3 {
  margin-top: 1.2em;
}

.preview pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 12px;
  overflow: auto;
}

.empty-preview {
  margin: 0;
  color: #94a3b8;
}

.empty-state {
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
}

@media (max-width: 1200px) {
  .meta-grid {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }

  .editor-body {
    grid-template-columns: 1fr;
  }
}
</style>
