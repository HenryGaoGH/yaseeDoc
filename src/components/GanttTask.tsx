import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { task_data } from '../datas/tasks';


export function GanttTask(props: {year: number, month: number, height?: number}) {

  return (
    <Gantt 
      tasks={task_data(props.year, props.month)} locale='zh' 
      listCellWidth='0' ganttHeight={props.height ?? 350} viewMode={ViewMode.Day} 
      TaskListHeader={ () => <></> }
    />
  )
}