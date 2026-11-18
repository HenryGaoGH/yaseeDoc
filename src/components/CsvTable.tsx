import React, { useEffect, useMemo, useState } from "react";

import styles from "./CsvTable.module.css";

export interface CsvTableProps {
  /** CSV 文件地址，与 csv 二选一。 */
  src?: string;
  /** 直接传入的 CSV 文本，优先级高于 src。 */
  csv?: string;
  /** 字段分隔符，默认自动识别逗号、制表符或分号。 */
  delimiter?: string;
  /** 是否将第一行作为表头。 */
  hasHeader?: boolean;
  /** 最多展示的数据行数，默认不限制。 */
  maxRows?: number;
  /** 是否展示行号。 */
  showRowNumbers?: boolean;
  /** 表格标题。 */
  caption?: React.ReactNode;
  /** 表格滚动区域的最大高度。 */
  maxHeight?: number | string;
  className?: string;
  emptyText?: string;
}

function detectDelimiter(csv: string): string {
  const firstLine = csv
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/, 1)[0];
  const candidates = [",", "\t", ";"];

  return candidates.reduce((best, candidate) => {
    const count = firstLine.split(candidate).length;
    const bestCount = firstLine.split(best).length;
    return count > bestCount ? candidate : best;
  }, candidates[0]);
}

/** 解析 RFC 4180 风格 CSV，支持转义引号及字段内换行。 */
export function parseCsv(input: string, delimiter?: string): string[][] {
  const csv = input.replace(/^\uFEFF/, "");
  const separator = delimiter ?? detectDelimiter(csv);

  if (separator.length !== 1) {
    throw new Error("CSV 分隔符必须是单个字符");
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (inQuotes) {
      if (character === '"') {
        if (csv[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      inQuotes = true;
    } else if (character === separator) {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && csv[index + 1] === "\n") {
        index += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter(
    (currentRow) =>
      currentRow.length > 1 || currentRow.some((value) => value.length > 0),
  );
}

export default function CsvTable({
  src,
  csv,
  delimiter,
  hasHeader = true,
  maxRows,
  showRowNumbers = false,
  caption,
  maxHeight = 520,
  className,
  emptyText = "暂无 CSV 数据",
}: CsvTableProps) {
  const [remoteCsv, setRemoteCsv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (csv !== undefined || !src) {
      setRemoteCsv("");
      setLoading(false);
      setError("");
      return undefined;
    }

    const controller = new AbortController();

    async function loadCsv() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`CSV 加载失败（HTTP ${response.status}）`);
        }
        setRemoteCsv(await response.text());
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadCsv();
    return () => controller.abort();
  }, [csv, src]);

  const { rows, parseError } = useMemo(() => {
    try {
      return {
        rows: parseCsv(csv ?? remoteCsv, delimiter),
        parseError: "",
      };
    } catch (parseErrorValue) {
      return {
        rows: [],
        parseError:
          parseErrorValue instanceof Error
            ? parseErrorValue.message
            : "CSV 解析失败",
      };
    }
  }, [csv, delimiter, remoteCsv]);

  const headers = hasHeader ? rows[0] ?? [] : [];
  const allDataRows = hasHeader ? rows.slice(1) : rows;
  const dataRows =
    maxRows === undefined ? allDataRows : allDataRows.slice(0, maxRows);
  const columnCount = Math.max(
    headers.length,
    ...dataRows.map((row) => row.length),
    0,
  );
  const displayHeaders = hasHeader
    ? Array.from(
        { length: columnCount },
        (_, index) => headers[index] || `列 ${index + 1}`,
      )
    : [];
  const visibleError = error || parseError;
  const truncated = dataRows.length < allDataRows.length;

  if (loading) {
    return <div className={styles.status}>正在加载 CSV…</div>;
  }

  if (visibleError) {
    return (
      <div className={`${styles.status} ${styles.error}`} role="alert">
        {visibleError}
      </div>
    );
  }

  if (rows.length === 0 || columnCount === 0) {
    return <div className={styles.status}>{emptyText}</div>;
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <div className={styles.scroller} style={{ maxHeight }}>
        <table className={styles.table}>
          {caption && <caption>{caption}</caption>}
          {hasHeader && (
            <thead>
              <tr>
                {showRowNumbers && (
                  <th className={styles.rowNumber} scope="col">
                    #
                  </th>
                )}
                {displayHeaders.map((header, index) => (
                  <th key={`${header}-${index}`} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {dataRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {showRowNumbers && (
                  <th className={styles.rowNumber} scope="row">
                    {rowIndex + 1}
                  </th>
                )}
                {Array.from({ length: columnCount }, (_, columnIndex) => (
                  <td key={columnIndex}>{row[columnIndex] ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.summary}>
        共 {allDataRows.length} 行 × {columnCount} 列
        {truncated && `，当前展示前 ${dataRows.length} 行`}
      </div>
    </div>
  );
}
