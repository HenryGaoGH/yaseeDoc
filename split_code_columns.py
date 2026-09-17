import re
from pathlib import Path

path = Path("docs/comm/comm_error_message_reference.md")
text = path.read_text(encoding="utf-8")

text = text.replace(
    "| code | 描述 | 操作建议 |\n| --- | --- | --- |",
    "| code（16进制） | code（10进制） | 描述 | 操作建议 |\n| --- | --- | --- | --- |",
)
text = text.replace(
    "| 查询码 | 返回 code | 描述 | 操作建议 |\n| --- | --- | --- | --- |",
    "| 查询码（16进制） | 查询码（10进制） | 返回 code（16进制） | 返回 code（10进制） | 描述 | 操作建议 |\n| --- | --- | --- | --- | --- | --- |",
)

# 将每一个形如 `0x01` (1) 的 code 单元格拆分成十六进制和十进制两列。
text, count = re.subn(r"\| (`0x[0-9A-F]+`) \((\d+)\) ", r"| \1 | \2 | ", text)

path.write_text(text, encoding="utf-8")
print(f"split_code_cells={count}")
