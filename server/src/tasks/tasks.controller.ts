import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks.filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
    // if we have any filter defined, call taskService.getTasks Will filters
    // otherwise, just get all tasks
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTaskWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getSingleTask(@Param('id') taskId: string): Task {
    return this.tasksService.getSingleTask(taskId);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    const updatedTask = this.tasksService.updateTask(taskId, status);
    return updatedTask;
  }

  @Delete('/:id')
  deleteTask(@Param('id') taskId: string): Task {
    const task = this.tasksService.deleteTask(taskId);
    return task;
  }
}
