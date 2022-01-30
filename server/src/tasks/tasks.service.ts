import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks.filter.dto';
import { NotFoundError } from 'rxjs';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    // define a temporary array to hold the result
    let tasks = this.getAllTasks();

    // do something with status
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    // do something with search
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    //return final result
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);

    return task;
  }

  getSingleTask(taskId: string): Task {
    const found = this.tasks.find((task) => task.id === taskId);

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  deleteTask(taskId: string): Task {
    const deletedTask = this.tasks.find((task) => task.id === taskId);
    if (!deletedTask) throw new Error('Data not found');
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    return deletedTask;
  }

  updateTask(taskId: string, status: TaskStatus): Task {
    const task = this.getSingleTask(taskId);
    task.status = status;
    return task;
  }
}
