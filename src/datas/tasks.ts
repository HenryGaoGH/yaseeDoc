import { Task } from "gantt-task-react";

let _24_09: Task[] = [
    {
      start: new Date(2024, 8, 18),
      end: new Date(2024, 9, 11),
      name: '展会突击项目',
      id: 'project',
      type:'project',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },{
      start: new Date(2024, 8, 18),
      end: new Date(2024, 8, 22),
      name: 'Android 对接工作',
      id: 'task-0',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "#8B0000"},
    },{
      start: new Date(2024, 8, 23),
      end: new Date(2024, 8, 25),
      name: 'Flutter 插件',
      id: 'task-1',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { 
        progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d',
        backgroundColor: 'red'
      },
    },{
      start: new Date(2024, 8, 25),
      end: new Date(2024, 8, 30),
      name: '百合医|绑定&搜索&蓝牙 功能',
      id: 'task-2',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "#FFB6C1" },
    },{
      start: new Date(2024, 8, 30),
      end: new Date(2024, 8, 31),
      name: '心电对接',
      id: 'task-3',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'blue' },
    },{
      start: new Date(2024, 9, 7),
      end: new Date(2024, 9, 11),
      name: '百合医心电对接',
      id: 'task-4',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'blue' },
    },{
      start: new Date(2024, 9, 11),
      end: new Date(2024, 9, 14),
      name: '好络纬Api对接',
      id: 'task-4',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'green' },
    },
    
]


let _24_10: Task[] = [
    {
      start: new Date(2024, 9, 14),
      end: new Date(2024, 10, 9),
      name: 'SDK 架构替换',
      id: 'project',
      type:'project',
      progress: 0,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },{
      start: new Date(2024, 9, 14),
      end: new Date(2024, 9, 17),
      name: 'SDK替换 - 架构',
      id: 'task-0',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "#8B0000"},
    },{
      start: new Date(2024, 9, 17),
      end: new Date(2024, 9, 18),
      name: 'SDK替换 - 绑定修改',
      id: 'task-1',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { 
        progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d',
        backgroundColor: 'red'
      },
    },{
      start: new Date(2024, 9, 18),
      end: new Date(2024, 9, 19),
      name: 'SDK替换 - 搜索修改',
      id: 'task-2',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "#FFB6C1" },
    },{
      start: new Date(2024, 9, 21),
      end: new Date(2024, 9, 22),
      name: 'SDK替换 - 蓝牙状态更新',
      id: 'task-3',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'purple' },
    },{
      start: new Date(2024, 9, 22),
      end: new Date(2024, 10, 2),
      name: 'SDK替换 - 检测修改(TMD)',
      id: 'task-4',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'orange' },
    },{
      start: new Date(2024, 10, 4),
      end: new Date(2024, 10, 6),
      name: 'SDK替换 - 多弹窗检测',
      id: 'task-4',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'blue' },
    },{
      start: new Date(2024, 10, 6),
      end: new Date(2024, 10, 8),
      name: 'SDK替换 - 测量数据存储',
      id: 'task-4',
      project: 'project',
      type:'task',
      progress: 0,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'blue' },
    },{
        start: new Date(2024, 10, 7),
        end: new Date(2024, 10, 9),
        name: 'SDK替换 - 玉成SDK & Yasee SDK共存兼容',
        id: 'task-4',
        project: 'project',
        type:'task',
        progress: 0,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'green' },
      },
    
]


let _24_11: Task[] = [
  {
    start: new Date(2024, 10, 18),
    end: new Date(2024, 10, 22),
    name: '11月份计划',
    id: 'project',
    type:'project',
    progress: 0,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  },{
    start: new Date(2024, 10, 18),
    end: new Date(2024, 10, 19),
    name: '三合一双插',
    id: 'task-0',
    project: 'project',
    type:'task',
    progress: 0,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "#FFB6C1"},
  },{
    start: new Date(2024, 10, 19),
    end: new Date(2024, 10, 21),
    name: '合并百合医',
    id: 'task-0',
    project: 'project',
    type:'task',
    progress: 0,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "red"},
  },{
    start: new Date(2024, 10, 21),
    end: new Date(2024, 10, 22),
    name: '包体积优化',
    id: 'task-0',
    project: 'project',
    type:'task',
    progress: 0,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "green"},
  }
]


let _24_12: Task[] = [
  {
    start: new Date(2024, 11, 18),
    end: new Date(2024, 11, 22),
    name: '12月份计划',
    id: 'project',
    type:'project',
    progress: 0,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  },{
    start: new Date(2024, 11, 18),
    end: new Date(2024, 11, 19),
    name: '三合一双插',
    id: 'task-0',
    project: 'project',
    type:'task',
    progress: 0,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "#FFB6C1"},
  },{
    start: new Date(2024, 11, 19),
    end: new Date(2024, 11, 21),
    name: '合并百合医',
    id: 'task-0',
    project: 'project',
    type:'task',
    progress: 0,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "red"},
  },{
    start: new Date(2024, 11, 21),
    end: new Date(2024, 11, 22),
    name: '包体积优化',
    id: 'task-0',
    project: 'project',
    type:'task',
    progress: 0,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: "green"},
  }
]




export const task_data = (year: number, month: number) => {
    const key = `${year}_${month.toString().padStart(2, '0')}`;
    return {
        "24_09": _24_09,
        "24_10": _24_10,
        "24_11": _24_11,
        "24_12": _24_12,
    }[key];
}