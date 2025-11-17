import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        title: createTodoDto.title,
        description: createTodoDto.description,
        completed: createTodoDto.completed ?? false,
      },
    });
  }

  findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    await this.findOne(id);

    return this.prisma.todo.update({
      where: { id },
      data: {
        title: updateTodoDto.title,
        description: updateTodoDto.description,
        completed: updateTodoDto.completed,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.todo.delete({
      where: { id },
    });
  }
}
