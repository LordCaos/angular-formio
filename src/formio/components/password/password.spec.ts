import { describe, expect, it } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { FORMIO_TEMPLATE } from '../../templates/bootstrap';
import { PasswordComponent, PasswordOptions, Password } from './password';
import { FormioComponent } from '../../formio-component.component';

describe('PasswordComponent', () => {
    beforeEach(() => {
        this.form = new FormGroup({});
    });

    // Register the Password component.
    Password(FORMIO_TEMPLATE);

    // An easy method for getting new password settings.
    var getSettings = (overrides: {}): PasswordOptions => {
        let settings: PasswordOptions = {
            input: true,
            tableView: false,
            inputType: "password",
            label: "Password",
            key: "password",
            placeholder: "Enter Your Password",
            prefix: "$",
            suffix: "@",
            protected: true,
            persistent: true,
            type: "password",
            conditional: {
                show: null,
                when: null,
                eq: ""
            },
            validate: {
                required: true,
                minLength: 8,
                pattern: "",
                custom: "",
                customPrivate: false
            },
            unique: true
        };
        Object.assign(settings, overrides);
        return settings;
    };

    let getComponent = (overrides: {}): FormioComponent<string> => {
        let settings:PasswordOptions = getSettings(overrides);
        let component = new FormioComponent<string>();
        component.component = settings;
        component.form = this.form;
        component.ngOnInit();
        return component;
    };

    it('Test FormioComponent for Password', () => {
        let component = getComponent({});
        expect(component.components.length).toEqual(1);
        expect(component.components[0] instanceof PasswordComponent).toEqual(true);
    });

    it('Should allow label value', () => {
        let settings: PasswordOptions = getSettings({
            label: 'Password'
        });

        // Create the password component.
        let password = new PasswordComponent(this.form, settings);
        expect(password.label).toEqual('Password');
    });

    it('Should not allow invalid Password values.', () => {
        let settings: PasswordOptions = getSettings({
            validate: {
                required: true,
                minLength: 8,
                pattern: '(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}'
            }
        });

        // Create the password component.
        let password = new PasswordComponent(this.form, settings);
        expect(password.settings).toEqual(settings);
        expect(password.label).toEqual('Password');
        expect(password.control instanceof FormControl).toEqual(true);

        let updateValue = (val: string) => {
            password.control['updateValue'](val);
            password.control['markAsDirty']();
        };

        updateValue('');
        expect(password.control.valid).toEqual(false);
        expect(password.control.errors).toEqual({required: true});
        expect(password.getError('required', password.control.errors['required'])).toEqual('Password is required');

        // The password must be at least 8 characters
        updateValue('P');
        expect(password.control.valid).toEqual(false);
        expect(password.control.errors).toEqual({ minlength: ({ requiredLength: 8, actualLength: 1 }), pattern: ({ requiredPattern: '^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$', actualValue: 'P' }) });
        expect(password.getError('minlength', password.control.errors['minlength'])).toEqual('Password must be at least 8 characters');

        // The password should not contain only lower case letters
        updateValue('testingg');
        expect(password.control.valid).toEqual(false);
        expect(password.control.errors).toEqual({pattern: ({ requiredPattern: '^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$', actualValue: 'testingg' })});
        expect(password.getError('pattern', password.control.errors['pattern'])).toEqual('Password must match the pattern ^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$');

        // The password should not contain only upper case letters
        updateValue('TESTINGG');
        expect(password.control.valid).toEqual(false);
        expect(password.control.errors).toEqual({pattern: ({ requiredPattern: '^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$', actualValue: 'TESTINGG' })});
        expect(password.getError('pattern', password.control.errors['pattern'])).toEqual('Password must match the pattern ^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$');

        // The password should contain upper case and lower case letters along with numbers
        updateValue('Testingg');
        expect(password.control.valid).toEqual(false);
        expect(password.control.errors).toEqual({pattern: ({ requiredPattern: '^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$', actualValue: 'Testingg' })});
        expect(password.getError('pattern', password.control.errors['pattern'])).toEqual('Password must match the pattern ^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$');

        // The password should have atleast 1 upper case letter, 1 lower case letter and 1 number
        updateValue('Testing123');
        expect(password.control.valid).toEqual(true);
    });

    it('Should allow placeholder', () => {
        let settings: PasswordOptions = getSettings({
            placeholder: "Enter Password"
        });

        // Create the password component.
        let number = new PasswordComponent(this.form, settings);
        expect(number.settings.placeholder).toEqual("Enter Password");
    });

    it('Should allow prefix', () => {
        let settings: PasswordOptions = getSettings({
            prefix: "$"
        });

        // Create the password component.
        let number = new PasswordComponent(this.form, settings);
        expect(number.settings.prefix).toEqual("$");
    });

    it('Should allow suffix', () => {
        let settings: PasswordOptions = getSettings({
            suffix: "@"
        });

        // Create the password component.
        let number = new PasswordComponent(this.form, settings);
        expect(number.settings.suffix).toEqual("@");
    });
});
