import { useState, useEffect, useCallback } from "react";
import { articles, Article } from "./data/articles";

function CollapsibleBlock({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const el = document.getElementById(`block-content-${id}`);
    if (el) {
      navigator.clipboard.writeText(el.innerText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="bg-[#f8fafc] border-l-4 border-[#2a5298] rounded-md px-4 py-4 mb-3.5">
      <div
        className="flex justify-between items-center cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="font-semibold text-base text-[#1e3c72]">{title}</span>
        <button className="bg-[#2a5298] text-white border-none w-7 h-7 rounded-full cursor-pointer text-sm flex items-center justify-center">
          {collapsed ? "+" : "−"}
        </button>
      </div>
      {!collapsed && (
        <>
          <div
            id={`block-content-${id}`}
            className="mt-3 whitespace-pre-wrap text-sm leading-relaxed"
          >
            {children}
          </div>
          <button
            onClick={handleCopy}
            className={`mt-2.5 text-white border-none py-1.5 px-3.5 rounded-md cursor-pointer text-[13px] transition-colors ${
              copied ? "bg-[#95a5a6]" : "bg-[#27ae60] hover:bg-[#219150]"
            }`}
          >
            {copied ? "✓ Скопировано" : "📋 Копировать"}
          </button>
        </>
      )}
    </div>
  );
}

function ArticleContent({ article }: { article: Article }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <h2 className="text-[#1e3c72] mb-5 pb-3 border-b-2 border-[#e0e6ed] text-xl font-bold">
        {article.code} — {article.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3.5">
        <div className="bg-[#eef3f9] p-3 rounded-lg">
          <div className="text-xs text-[#7f8c8d] uppercase tracking-wide">
            ⏱ Срок давности
          </div>
          <div className="font-semibold text-[#1e3c72] mt-1">
            {article.info.deadline}
          </div>
        </div>
        <div className="bg-[#eef3f9] p-3 rounded-lg">
          <div className="text-xs text-[#7f8c8d] uppercase tracking-wide">
            ⚖️ Ответственность
          </div>
          <div className="font-semibold text-[#1e3c72] mt-1">
            {article.info.punishment}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2.5 mb-3.5">
        <div className="bg-[#eef3f9] p-3 rounded-lg">
          <div className="text-xs text-[#7f8c8d] uppercase tracking-wide">
            🏛 Судебный порядок
          </div>
          <div className="font-semibold text-[#1e3c72] mt-1">
            {article.info.court}
          </div>
        </div>
      </div>

      {article.info.note && (
        <div className="bg-[#fff8e1] border-l-4 border-[#f9a825] rounded-md p-3 mb-4 text-sm text-[#5d4037]">
          <span className="font-semibold">📌 Примечание: </span>
          {article.info.note}
        </div>
      )}

      {article.violations && article.violations.length > 0 && (
        <CollapsibleBlock title="📋 Нарушения ПДД (описание)" id="violations">
          <ol className="ml-5 mt-2 space-y-1.5">
            {article.violations.map((v, i) => (
              <li key={i}>
                {i + 1}. {v}
              </li>
            ))}
          </ol>
        </CollapsibleBlock>
      )}

      {article.caseMaterials && article.caseMaterials.length > 0 && (
        <CollapsibleBlock title="📂 Материалы дела" id="caseMaterials">
          <ul className="ml-5 mt-2 space-y-1.5">
            {article.caseMaterials.map((m, i) => (
              <li key={i}>🔸 {m}</li>
            ))}
          </ul>
        </CollapsibleBlock>
      )}

      <CollapsibleBlock title="❓ Вопросы клиенту" id="questions">
        <ol className="ml-5 mt-2 space-y-1.5">
          {article.questions.map((q, i) => (
            <li key={i}>
              {i + 1}. {q}
            </li>
          ))}
        </ol>
      </CollapsibleBlock>

      <CollapsibleBlock title="🛡 Варианты позиции защиты" id="defense">
        <ol className="ml-5 mt-2 space-y-1.5">
          {article.defense.map((d, i) => (
            <li key={i}>
              {i + 1}. {d}
            </li>
          ))}
        </ol>
      </CollapsibleBlock>

      <CollapsibleBlock title="📄 Что мы готовим" id="docs">
        <ol className="ml-5 mt-2 space-y-1.5">
          {article.documents.map((d, i) => (
            <li key={i}>
              {i + 1}. {d}
            </li>
          ))}
        </ol>
      </CollapsibleBlock>

      <CollapsibleBlock title="🎤 Скрипт презентации услуг" id="presentation">
        {article.presentation}
      </CollapsibleBlock>
    </div>
  );
}

export default function App() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const last = localStorage.getItem("lastArticle");
    if (last !== null) {
      const idx = parseInt(last);
      if (idx >= 0 && idx < articles.length) {
        setSelectedIdx(idx);
      }
    }
  }, []);

  const handleSelect = useCallback((idx: number) => {
    setSelectedIdx(idx);
    localStorage.setItem("lastArticle", idx.toString());
  }, []);

  const filteredArticles = articles
    .map((a, idx) => ({ article: a, originalIdx: idx }))
    .filter(({ article }) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const searchText = [
        article.code,
        article.title,
        article.shortDesc,
        ...article.questions,
        ...article.defense,
      ]
        .join(" ")
        .toLowerCase();
      return searchText.includes(q);
    });

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#2c3e50] leading-relaxed font-sans">
      <div className="max-w-[1200px] mx-auto px-5 py-5">
        {/* Header */}
        <header className="bg-gradient-to-br from-[#1e3c72] to-[#2a5298] text-white p-6 rounded-xl mb-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <h1 className="text-2xl md:text-[24px] font-bold mb-1">
            📚 Книга Продаж — Скрипты Автоюрист
          </h1>
          <p className="opacity-90 text-sm">
            Выберите статью КоАП для просмотра скрипта работы с клиентом
          </p>
          <p className="opacity-70 text-xs mt-1">
            Всего статей: {articles.length}
          </p>
        </header>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 px-4 border-2 border-[#e0e6ed] rounded-lg text-[15px] mb-5 transition-colors focus:outline-none focus:border-[#2a5298] bg-white"
          placeholder="🔍 Поиск по статьям, ключевым словам..."
        />

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {filteredArticles.map(({ article, originalIdx }) => (
            <button
              key={originalIdx}
              onClick={() => handleSelect(originalIdx)}
              className={`text-left p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                selectedIdx === originalIdx
                  ? "bg-[#2a5298] text-white border-[#2a5298]"
                  : "bg-white border-[#e0e6ed] hover:border-[#2a5298] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(42,82,152,0.15)]"
              }`}
            >
              <span className="font-bold text-base block mb-1">
                {article.code}
              </span>
              <span
                className={`text-xs ${
                  selectedIdx === originalIdx ? "opacity-80" : "opacity-70"
                }`}
              >
                {article.title}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {filteredArticles.length > 0 && (
          <ArticleContent article={articles[selectedIdx]} />
        )}

        {filteredArticles.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="text-lg text-[#7f8c8d]">
              Ничего не найдено по запросу «{searchQuery}»
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
