import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { renderAsync } from 'docx-preview';

import styles from './protocol.module.css';

interface ProtocolNode {
  name: string;
  type: 'directory' | 'file';
  path: string;

  children?: ProtocolNode[];

  fileType?: string;
  extension?: string;
  size?: number;
  modifiedTime?: string;
}

function getFileIcon(node: ProtocolNode): string {
  if (node.type === 'directory') {
    return '📁';
  }

  switch (node.fileType) {
    case 'word':
      return '📘';
    case 'pdf':
      return '📕';
    case 'excel':
      return '📊';
    case 'ppt':
      return '📽️';
    case 'image':
      return '🖼️';
    case 'text':
      return '📝';
    case 'archive':
      return '🗜️';
    default:
      return '📄';
  }
}

function formatFileSize(size?: number): string {
  if (size === undefined) {
    return '-';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function encodeFilePath(filePath: string): string {
  return filePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function filterTree(
  nodes: ProtocolNode[],
  keyword: string
): ProtocolNode[] {
  if (!keyword.trim()) {
    return nodes;
  }

  const lowerKeyword = keyword.trim().toLowerCase();

  return nodes.reduce<ProtocolNode[]>((result, node) => {
    const nameMatched = node.name
      .toLowerCase()
      .includes(lowerKeyword);

    if (node.type === 'directory') {
      const children = filterTree(
        node.children || [],
        keyword
      );

      if (nameMatched || children.length > 0) {
        result.push({
          ...node,
          children: nameMatched
            ? node.children || []
            : children,
        });
      }
    } else if (nameMatched) {
      result.push(node);
    }

    return result;
  }, []);
}

/* =========================
   文件树节点
========================= */

interface TreeNodeProps {
  node: ProtocolNode;
  selectedPath: string | null;
  searchKeyword: string;
  onSelect: (node: ProtocolNode) => void;
}

function TreeNode({
  node,
  selectedPath,
  searchKeyword,
  onSelect,
}: TreeNodeProps) {
  const isDirectory = node.type === 'directory';

  const [expanded, setExpanded] = useState(false);

  const selected = selectedPath === node.path;

  useEffect(() => {
    if (searchKeyword && isDirectory) {
      setExpanded(true);
    }
  }, [searchKeyword, isDirectory]);

  const handleClick = () => {
    if (isDirectory) {
      setExpanded((value) => !value);
    } else {
      onSelect(node);
    }
  };

  return (
    <div className={styles.treeNode}>
      <div
        className={`${styles.treeItem} ${
          selected ? styles.selected : ''
        }`}
        onClick={handleClick}
        title={node.name}
      >
        <span className={styles.expandIcon}>
          {isDirectory
            ? expanded
              ? '⌄'
              : '›'
            : ''}
        </span>

        <span className={styles.fileIcon}>
          {getFileIcon(node)}
        </span>

        <span className={styles.treeName}>
          {node.name}
        </span>
      </div>

      {isDirectory &&
        expanded &&
        node.children &&
        node.children.length > 0 && (
          <div className={styles.treeChildren}>
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                selectedPath={selectedPath}
                searchKeyword={searchKeyword}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
    </div>
  );
}

/* =========================
   主页面
========================= */

export default function ProtocolPage(): JSX.Element {
  const [tree, setTree] = useState<ProtocolNode[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [searchKeyword, setSearchKeyword] = useState('');

  const [selectedFile, setSelectedFile] =
    useState<ProtocolNode | null>(null);

  const [previewLoading, setPreviewLoading] = useState(false);

  const [previewError, setPreviewError] = useState('');

  const [textContent, setTextContent] = useState('');

  const [textLoading, setTextLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const treeUrl = useBaseUrl('/protocol-tree.json');

  const protocolBaseUrl = useBaseUrl('/protocol');

  const extension = selectedFile?.extension?.toLowerCase();

  const isDocx = extension === '.docx';

  const isPdf = extension === '.pdf';

  const isTxt = extension === '.txt';

  const isDoc = extension === '.doc';

  /* =========================
     加载文件树
  ========================= */

  const loadTree = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(treeUrl);

      if (!response.ok) {
        throw new Error(
          `加载文件目录失败：HTTP ${response.status}`
        );
      }

      const data: ProtocolNode[] = await response.json();

      setTree(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : '加载文件目录失败'
      );
    } finally {
      setLoading(false);
    }
  }, [treeUrl]);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  const filteredTree = useMemo(() => {
    return filterTree(tree, searchKeyword);
  }, [tree, searchKeyword]);

  /* =========================
     文件 URL
  ========================= */

  const fileUrl = useMemo(() => {
    if (!selectedFile) {
      return '';
    }

    return `${protocolBaseUrl}/${encodeFilePath(
      selectedFile.path
    )}`;
  }, [selectedFile, protocolBaseUrl]);

  /* =========================
     选择文件
  ========================= */

  const selectFile = (node: ProtocolNode) => {
    setSelectedFile(node);
    setPreviewError('');
    setTextContent('');
  };

  /* =========================
     DOCX 在线预览
  ========================= */

  useEffect(() => {
    if (
      !selectedFile ||
      !isDocx ||
      !previewRef.current ||
      !fileUrl
    ) {
      return;
    }

    let cancelled = false;

    const container = previewRef.current;

    const renderDocument = async () => {
      try {
        setPreviewLoading(true);
        setPreviewError('');

        container.innerHTML = '';

        const response = await fetch(fileUrl);

        if (!response.ok) {
          throw new Error(
            `Word 文档加载失败：HTTP ${response.status}`
          );
        }

        const blob = await response.blob();

        if (cancelled) {
          return;
        }

        await renderAsync(
          blob,
          container,
          undefined,
          {
            className: 'docx-preview-wrapper',
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: false,
            breakPages: true,
            useBase64URL: true,
          }
        );
      } catch (e) {
        if (!cancelled) {
          setPreviewError(
            e instanceof Error
              ? e.message
              : 'Word 文档预览失败'
          );
        }
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    };

    renderDocument();

    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, [selectedFile, fileUrl, isDocx]);

  /* =========================
     TXT 在线预览
  ========================= */

  useEffect(() => {
    if (!selectedFile || !isTxt || !fileUrl) {
      setTextContent('');
      return;
    }

    let cancelled = false;

    const loadText = async () => {
      try {
        setTextLoading(true);
        setPreviewError('');
        setTextContent('');

        const response = await fetch(fileUrl);

        if (!response.ok) {
          throw new Error(
            `文本加载失败：HTTP ${response.status}`
          );
        }

        const text = await response.text();

        if (!cancelled) {
          setTextContent(text);
        }
      } catch (e) {
        if (!cancelled) {
          setPreviewError(
            e instanceof Error
              ? e.message
              : '文本加载失败'
          );
        }
      } finally {
        if (!cancelled) {
          setTextLoading(false);
        }
      }
    };

    loadText();

    return () => {
      cancelled = true;
    };
  }, [selectedFile, fileUrl, isTxt]);

  /* =========================
     页面
  ========================= */

  return (
    <Layout
      title="协议文档中心"
      description="协议与技术文档中心"
    >
      <div className={styles.page}>
        {/* 页面头部 */}

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              📚
            </div>

            <div>
              <h1 className={styles.title}>
                协议文档中心
              </h1>

              <p className={styles.subtitle}>
                Protocol Documentation Center
              </p>
            </div>
          </div>

          <button
            className={styles.refreshButton}
            onClick={loadTree}
            disabled={loading}
          >
            <span>↻</span>
            刷新目录
          </button>
        </header>

        {/* 主体 */}

        <main className={styles.main}>
          {/* 左侧目录 */}

          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span>📂 文档目录</span>

              <span className={styles.fileCount}>
                {tree.length}
              </span>
            </div>

            {/* 搜索框 */}

            <div className={styles.searchBox}>
              <span>⌕</span>

              <input
                type="text"
                placeholder="搜索文档..."
                value={searchKeyword}
                onChange={(e) =>
                  setSearchKeyword(e.target.value)
                }
              />

              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  aria-label="清空搜索"
                >
                  ×
                </button>
              )}
            </div>

            {/* 文件树 */}

            <div className={styles.treeContainer}>
              {loading && (
                <div className={styles.emptyState}>
                  正在加载文档目录...
                </div>
              )}

              {!loading && error && (
                <div className={styles.errorState}>
                  {error}
                </div>
              )}

              {!loading &&
                !error &&
                filteredTree.length === 0 && (
                  <div className={styles.emptyState}>
                    {searchKeyword
                      ? '没有找到匹配的文档'
                      : '暂无文档'}
                  </div>
                )}

              {!loading &&
                !error &&
                filteredTree.map((node) => (
                  <TreeNode
                    key={node.path}
                    node={node}
                    selectedPath={selectedFile?.path || null}
                    searchKeyword={searchKeyword}
                    onSelect={selectFile}
                  />
                ))}
            </div>
          </aside>

          {/* 右侧内容 */}

          <section className={styles.content}>
            {!selectedFile ? (
              <div className={styles.welcome}>
                <div className={styles.welcomeIcon}>
                  📖
                </div>

                <h2>协议文档中心</h2>

                <p>
                  请从左侧目录选择一个文档进行查看
                </p>
              </div>
            ) : (
              <>
                {/* 文件信息栏 */}

                <div className={styles.fileHeader}>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileHeaderIcon}>
                      {getFileIcon(selectedFile)}
                    </span>

                    <div className={styles.fileText}>
                      <h2 title={selectedFile.name}>
                        {selectedFile.name}
                      </h2>

                      <div className={styles.fileMeta}>
                        <span>
                          {selectedFile.extension || '文件'}
                        </span>

                        <span>
                          {formatFileSize(selectedFile.size)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    className={styles.downloadButton}
                    href={fileUrl}
                    download={selectedFile.name}
                  >
                    ↓ 下载文件
                  </a>
                </div>

                {/* 预览区域 */}

                <div className={styles.previewContainer}>
                  {/* DOCX */}

                  {isDocx && (
                    <>
                      {previewLoading && (
                        <div className={styles.previewStatus}>
                          正在加载 Word 文档...
                        </div>
                      )}

                      {previewError && (
                        <div className={styles.errorState}>
                          {previewError}
                        </div>
                      )}

                      <div
                        ref={previewRef}
                        className={styles.docxContainer}
                      />
                    </>
                  )}

                  {/* PDF */}

                  {isPdf && (
                    <iframe
                      key={fileUrl}
                      src={fileUrl}
                      className={styles.pdfViewer}
                      title={selectedFile.name}
                    />
                  )}

                  {/* TXT */}

                  {isTxt && (
                    <div className={styles.textPreview}>
                      {textLoading ? (
                        <div className={styles.previewStatus}>
                          正在加载文本...
                        </div>
                      ) : previewError ? (
                        <div className={styles.errorState}>
                          {previewError}
                        </div>
                      ) : (
                        <pre>{textContent}</pre>
                      )}
                    </div>
                  )}

                  {/* DOC */}

                  {isDoc && (
                    <div className={styles.unsupported}>
                      <div className={styles.unsupportedIcon}>
                        📘
                      </div>

                      <h3>
                        暂不支持旧版 Word 在线预览
                      </h3>

                      <p>
                        当前文件为 .doc 格式。
                      </p>

                      <p>
                        请下载后使用 Microsoft Word 或 WPS 打开。
                      </p>

                      <a
                        href={fileUrl}
                        download={selectedFile.name}
                        className={styles.downloadButton}
                      >
                        ↓ 下载 Word 文档
                      </a>
                    </div>
                  )}

                  {/* 其他格式 */}

                  {!isDocx &&
                    !isPdf &&
                    !isTxt &&
                    !isDoc && (
                      <div className={styles.unsupported}>
                        <div className={styles.unsupportedIcon}>
                          {getFileIcon(selectedFile)}
                        </div>

                        <h3>暂不支持在线预览</h3>

                        <p>
                          当前文件格式：
                          {selectedFile.extension || '未知格式'}
                        </p>

                        <p>
                          请下载文件后使用本地软件打开。
                        </p>

                        <a
                          href={fileUrl}
                          download={selectedFile.name}
                          className={styles.downloadButton}
                        >
                          ↓ 下载文件
                        </a>
                      </div>
                    )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </Layout>
  );
}
