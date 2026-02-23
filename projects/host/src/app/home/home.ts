import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'shared-ui';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Button, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
