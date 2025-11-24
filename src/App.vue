<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <span class="logo">YD</span>
        <div>
          <strong>有道云图书 · 编辑器</strong>
          <p>灵感收集 · 结构化写作 · 高效发布</p>
        </div>
      </div>
      <div class="top-actions">
        <button class="pill">写作节奏板</button>
        <button class="pill">章节模板</button>
        <div class="avatar">LC</div>
      </div>
    </header>

    <main class="workspace">
      <SidebarNav />
      <BookList />
      <BookEditor />
    </main>
  </div>
</template>

<script setup>
import SidebarNav from './components/SidebarNav.vue';
import BookList from './components/BookList.vue';
import BookEditor from './components/BookEditor.vue';
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(150deg, #2563eb, #7c3aed);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand strong {
  font-size: 1.1rem;
}

.brand p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pill {
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  background: rgba(226, 232, 240, 0.7);
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #111320;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

@media (max-width: 768px) {
  .topbar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .top-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
