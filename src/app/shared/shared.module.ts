import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

// PrimeNG Imports
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';



const PRIME_NG_MODULES = [ToolbarModule, TableModule, ButtonModule, ToastModule];

@NgModule({
    imports: [...PRIME_NG_MODULES, CommonModule, FormsModule],
    exports: [...PRIME_NG_MODULES, CommonModule, FormsModule  ]
})
export class SharedModule {};