import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { task_data } from '../datas/tasks';


export function GanttTask(props: {year: number, month: number}) {

  const tasks = task_data(props.year, props.month);

  return (
    <Gantt 
      tasks={tasks} locale='zh' 
      listCellWidth='0' ganttHeight={(tasks.length+1) * 45} viewMode={ViewMode.Day} 
      TaskListHeader={ () => <></> }
      
    />
  )
}