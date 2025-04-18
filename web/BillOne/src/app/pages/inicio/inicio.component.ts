import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  showModal: boolean = true;

  ngOnInit(): void {
    // Modal will be shown when the page is loaded
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
