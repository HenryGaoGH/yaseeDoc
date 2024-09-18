import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";


export function GanttTask() {

  let tasks: Task[] = [
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
      
  ];

  return (
    <Gantt tasks={tasks} locale='zh' listCellWidth='0' ganttHeight={350} viewMode={ViewMode.Day} />
  )
}