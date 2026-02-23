import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'shared-ui';
import { User } from 'shared-models';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, Button],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
  ];
}
