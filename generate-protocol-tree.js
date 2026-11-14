const fs = require('fs');
const path = require('path');

// 项目根目录
const ROOT_DIR = __dirname;

// 文档目录
const PROTOCOL_DIR = path.join(ROOT_DIR, 'static', 'protocol');

// JSON 输出位置
const OUTPUT_FILE = path.join(
    ROOT_DIR,
    'static',
    'protocol-tree.json'
);

// 支持的文件类型
const SUPPORTED_EXTENSIONS = [
    '.docx',
    '.doc',
    '.pdf',
    '.xlsx',
    '.xls',
    '.csv',
    '.pptx',
    '.ppt',
    '.txt',
    '.md',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp'
];

/**
 * 递归扫描目录
 */
function scanDirectory(directory, relativePath = '') {

    const items = fs.readdirSync(directory, {
        withFileTypes: true
    });

    // 排序：文件夹在前，文件在后
    items.sort((a, b) => {

        if (a.isDirectory() && !b.isDirectory()) {
            return -1;
        }

        if (!a.isDirectory() && b.isDirectory()) {
            return 1;
        }

        return a.name.localeCompare(b.name, 'zh-CN');
    });

    const result = [];

    for (const item of items) {

        // 忽略隐藏文件及 Office/编辑器生成的临时文件
        if (
            item.name.startsWith('.') ||
            item.name.startsWith('~$') ||
            item.name.startsWith('~WRL') ||
            item.name.endsWith('.tmp')
        ) {
            continue;
        }

        // 不跟随符号链接，避免循环扫描
        if (item.isSymbolicLink()) {
            continue;
        }

        const fullPath = path.join(directory, item.name);

        const currentPath = path.posix.join(
            relativePath,
            item.name
        );

        // 文件夹
        if (item.isDirectory()) {

            result.push({
                name: item.name,
                type: 'directory',
                path: currentPath,
                children: scanDirectory(
                    fullPath,
                    currentPath
                )
            });

            continue;
        }

        // 文件
        if (item.isFile()) {

            const extension = path.extname(item.name)
                .toLowerCase();

            result.push({
                name: item.name,
                type: 'file',
                path: currentPath,
                extension,
                supported: SUPPORTED_EXTENSIONS.includes(extension)
            });
        }
    }

    return result;
}

/**
 * 主函数
 */
function main() {

    console.log('================================');
    console.log('Protocol Document Scanner');
    console.log('================================');

    // 检查文档目录
    if (!fs.existsSync(PROTOCOL_DIR)) {

        fs.mkdirSync(PROTOCOL_DIR, {
            recursive: true
        });

        console.log('Created protocol directory.');
    }

    // 扫描目录
    const tree = scanDirectory(PROTOCOL_DIR);

    // 写入 JSON
    fs.writeFileSync(
        OUTPUT_FILE,
        JSON.stringify(tree, null, 2),
        'utf-8'
    );

    console.log('Scan completed!');
    console.log('Protocol directory:', PROTOCOL_DIR);
    console.log('Output file:', OUTPUT_FILE);

    console.log(
        'Total files:',
        countFiles(tree)
    );

    console.log(
        'Total directories:',
        countDirectories(tree)
    );
}

/**
 * 统计文件数量
 */
function countFiles(nodes) {

    let count = 0;

    for (const node of nodes) {

        if (node.type === 'file') {
            count++;
        }

        if (node.children) {
            count += countFiles(node.children);
        }
    }

    return count;
}

/**
 * 统计目录数量
 */
function countDirectories(nodes) {

    let count = 0;

    for (const node of nodes) {

        if (node.type === 'directory') {

            count++;

            if (node.children) {
                count += countDirectories(node.children);
            }
        }
    }

    return count;
}

// 执行
try {

    main();

} catch (error) {

    console.error('Failed to generate protocol tree:');
    console.error(error);

    process.exit(1);
}
