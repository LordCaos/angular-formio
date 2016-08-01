import { Input, OnInit } from '@angular/core';
import { FormioComponents } from '../components';
import { FormioTemplate } from '../../formio.template';
import { InputComponent, InputOptions, InputElement } from '../input/input';

export interface PasswordOptions extends InputOptions {
    
}

export class PasswordComponent extends InputComponent {
    
}

export class PasswordElement extends InputElement implements OnInit {
    @Input() component: PasswordComponent;
    ngOnInit() {
        this.render.emit(true);
    }
}

export function Password(template:FormioTemplate) {
    FormioComponents.register('password', PasswordComponent, PasswordElement, {
        template: template.components.input
    });
    return PasswordElement;
};
